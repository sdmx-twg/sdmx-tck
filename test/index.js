// required packages
let validator = require('xsd-schema-validator');
let parseString = require('xml2js').parseString;
let chakram = require('chakram')
let expect = chakram.expect
let assert = require('chai').assert

// get TCK version
const pjson = require('../package.json');

// The user's SDMX REST endpoint
const gsrEndpoint = 'https://registry.sdmx.org/FusionRegistry/ws/rest/';
const gsrTestEndpoint = 'https://test2.registry.sdmx.org/FusionRegistry/ws/rest/';
const wsEndpoint = 'http://localhost:8080/sri-ws/rest/';
const ecbEndpoint = 'https://sdw-wsrest.ecb.europa.eu/service/';
const estatDissEndpoint = 'http://ec.europa.eu/eurostat/SDMX/diss-web/rest/';
const imfCentralEndpoint = 'https://sdmxcentral.imf.org/ws/public/sdmxapi/rest/';
const mockWsEndpoint = 'http://localhost:3000/rest/';
let endpoint = ecbEndpoint;

/* The test sets to be executed. Although 4 indices shall be calculated, we maintain all TestSets
  in one collection. Each TestSet is an array that includes the Tests. Each TestSet may include 
  metadata, e.g. the tests, its title, weight, etc.
*/
let testSets = {
	ts11:{id:'TS#1.1', tests:[], description:'Data – Resource identification parameters support'}, 
  ts12:{id:'TS#1.2', tests:[], description:'Data – Extended resource identification parameters support'}, 
  ts13:{id:'TS#1.3', tests:[], description:'Data – Parameters for further describing or filtering results'}, 
  ts14:{id:'TS#1.4', tests:[], description:'Data – Representations support'}, 
  ts15:{id:'TS#1.5', tests:[], description:'Data – Other features'}, 
	ts21:{id:'TS#2.1', tests:['1','2','3','4','5','6'], description:'Structures – Resource identification parameters support'}, 
  ts22:{id:'TS#2.2', tests:['1'], description:'Structures – Extended resource identification parameters'}, 
  ts23:{id:'TS#2.3', tests:[], description:'Structures – Parameters for further describing the results'}, 
  ts24:{id:'TS#2.4', tests:[], description:'Structures – Representations support'}, 
  ts25:{id:'TS#2.5', tests:[], description:'Structures – Other features'}, 
	ts31:{id:'TS#3.1', tests:[], description:'Schemas – Resource identification parameters support'}, 
  ts32:{id:'TS#3.2', tests:[], description:'Schemas – Extended resource identification parameters support'}, 
  ts33:{id:'TS#3.3', tests:[], description:'Schemas – Parameters for further describing or filtering results'}, 
  ts34:{id:'TS#3.4', tests:[], description:'Schemas – Representations support'}, 
  ts35:{id:'TS#3.5', tests:[], description:'Schemas – Other features'}, 
	ts41:{id:'TS#4.1', tests:[], description:'Metadata – Resource identification parameters support'}, 
  ts42:{id:'TS#4.2', tests:[], description:'Metadata – Extended resource identification parameters support'}, 
  ts43:{id:'TS#4.3', tests:[], description:'Metadata – Parameters for further describing or filtering results'}, 
  ts44:{id:'TS#4.4', tests:[], description:'Metadata – Representations support'}, 
  ts45:{id:'TS#4.5', tests:[], description:'Metadata – Other features'}
}

// The user's structure selection to be tested is stored in the 'structure' array
let structure = ['datastructure', 'metadatastructure', 'categoryscheme', 'conceptscheme', 
	'codelist', 'hierarchicalcodelist', 'organisationscheme', 'agencyscheme', 'dataproviderscheme', 
	'dataconsumerscheme', 'organisationunitscheme', 'dataflow', 'metadataflow', 'reportingtaxonomy', 
	'provisionagreement', 'structureset', 'process', 'categorisation', 'contentconstraint', 
	'attachmentconstraint', 'structure']
structure = ['codelist']; // for selective testing of specific SDMX Artefacts

/* The SDMX 2.1 elements used for structure groups and containers: xmlArtefact, xmlGroup
	To be fetched using the structure literal as defined in the 'structure' array.
*/
let xmlArtefact = {
	datastructure:'DataStructure', metadatastructure:'MetadataStructure', categoryscheme:'CategoryScheme',
	conceptscheme:'ConceptScheme', codelist:'Codelist', hierarchicalcodelist:'HierarchicalCodelist',
	organisationscheme:'%Scheme', agencyscheme:'agencyscheme', dataproviderscheme:'dataproviderscheme',
	dataconsumerscheme:'dataconsumerscheme', organisationunitscheme:'organisationunitscheme',
	dataflow:'Dataflow', metadataflow:'Metadataflow', reportingtaxonomy:'reportingtaxonomy',
	provisionagreement:'provisionagreement', structureset:'structureset', process:'process',
	categorisation:'Categorisation', contentconstraint:'ContentConstraint', attachmentconstraint:'AttachmentConstraint'}
let xmlGroup = {
	datastructure:'DataStructures', metadatastructure:'MetadataStructures', categoryscheme:'CategorySchemes',
	conceptscheme:'Concepts', codelist:'Codelists', hierarchicalcodelist:'HierarchicalCodelists',
	organisationscheme:'OrganisationSchemes', agencyscheme:'agencyscheme', dataproviderscheme:'dataproviderscheme',
	dataconsumerscheme:'dataconsumerscheme', organisationunitscheme:'organisationunitscheme',
	dataflow:'Dataflows', metadataflow:'Metadataflows', reportingtaxonomy:'reportingtaxonomy',
	provisionagreement:'provisionagreement', structureset:'structureset', process:'process',
	categorisation:'Categorisations', contentconstraint:'Constraints', attachmentconstraint:'Constraints'}

// TBD: for reporting
let successfulStructures = new Set()

// Validates the xmlBody against the SDMX 2.1 schema files
function validate(xmlBody) {
	return new Promise(function(resolve, reject){
		validator.validateXML(xmlBody, 'schemas/SDMXMessage.xsd', function (err, data) {
			//console.log("\tXML size: " + (xmlBody.length/1024/1024).toFixed(2) + 'MB');
			if(err !== null) {
				return reject(err);
			}
			resolve(data);
		});
	});
}

// Returns the list of SDMX structures from the response, i.e. an array of the given element type
var getStructuresList = function(result, resource, all){
	
	var rootElement = result[Object.keys(result)[0]]['$'];
	// Set the XML namespace prefixes
	var messagePrefix = ''
	var structurePrefix = ''
	var commonPrefix = ''

	// Get the message prefixes from the namespace definitions in the XML root element
	Object.keys(rootElement).find(function(key) {
		if (rootElement[key] == 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message' && (key != 'xmlns') ) {
			messagePrefix = key.replace('xmlns:','').concat(':');
		}
		if (rootElement[key] == 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/structure' && (key != 'xmlns') ) {
			structurePrefix = key.replace('xmlns:','').concat(':');
		}
		if (rootElement[key] == 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common' && (key != 'xmlns') ) {
			commonPrefix = key.replace('xmlns:','').concat(':');
		}
	});

	var arrayOfArtefacts = new Array();
	// All returned SDMX Artefacts at the level of Artefact Groups
	var arrayOfReturnedArtefacts = result[messagePrefix + 'Structure'][messagePrefix + 'Structures'][0];
	
	if (all) {
		// An array of the returned SDMX Artefact types to be used for getting the content of each Group
		var arrayOfReturnedArtefactTypes = Object.getOwnPropertyNames(arrayOfReturnedArtefacts);
		
		// The ArtefactName to request the lists of returned SDMX Artefacts
		var artefactNameIndex;
		for (var i = 0; i < arrayOfReturnedArtefactTypes.length; i++) {
			// Get the Artefact Prefixed Type (as generated by the XML parser) in order to use it for pushing the list of contained Artefacts
			artefactPrefixedType = Object.getOwnPropertyNames(arrayOfReturnedArtefacts[arrayOfReturnedArtefactTypes[i]][0])[0];
			// This list will contain all returned artefacts (of any type); TODO: consider if we should create a separate list per Artefact Type
			arrayOfArtefacts.push.apply(arrayOfArtefacts,arrayOfReturnedArtefacts[arrayOfReturnedArtefactTypes[i]][0][artefactPrefixedType]);			
		}
	}else {
		// Set XML Artefact and Group literal according to the requested resource
		var xmlArtefactName = xmlArtefact[resource];
		var xmlGroupName = xmlGroup[resource];
		/*
		var allItems = 0;
		for (var i = 0; i < arrayOfReturnedArtefacts[structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName].length; i++) {
			var items = 0;
			if (arrayOfReturnedArtefacts[structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName][i][structurePrefix + 'Code']) {
				items = arrayOfReturnedArtefacts[structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName][i][structurePrefix + 'Code'].length;
			}
			if (items) {
				allItems = allItems + items;
				if (items > 5000) {
					console.log('\nchecking ' + arrayOfReturnedArtefacts[structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName][i]['$'].id);
					console.log('Items: ' + items);
				}
			}
		}
		console.log('All Items: ' + allItems);
		*/
		// The list of the specific resource requested
		arrayOfArtefacts = arrayOfReturnedArtefacts[structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName];
	}

	return arrayOfArtefacts;
}

// Returns the Artefact identification
function getArtefactIdentification(body, random, resource) {

	return new Promise(function(resolve, reject){
		parseString(body, function (err, result) {
			
			var arrayOfStructures = getStructuresList(result, resource);

			var index = 0;
			if (random) {
				// Randomly pick an index from the available array of Artefacts
				index = Math.floor(Math.random() * arrayOfStructures.length);
			}

			// Get the identification of the randomly picked Artefact
			var identifier = {
				agencyId: arrayOfStructures[index]['$'].agencyID,
				id: arrayOfStructures[index]['$'].id,
				version: arrayOfStructures[index]['$'].version
			}

			if(err !== null) {
				return reject(err);
			}
			resolve(identifier);
		});
	})
}

// Checks that the returned structures comply to the requested resource parameters
function checkResults (body, resource, agencyId, id, version) {

	return new Promise(function(resolve, reject){
		parseString(body, function (err, result) {
			
			//console.log(JSON.stringify(result));

			var arrayOfStructures = getStructuresList(result, resource);
			for (returnedStructure in arrayOfStructures) {
				if ((agencyId && agencyId != 'all' && arrayOfStructures[returnedStructure]['$'].agencyID != agencyId)
					|| (id && id != 'all' && arrayOfStructures[returnedStructure]['$'].id != id)
					|| (version && version != 'all' && arrayOfStructures[returnedStructure]['$'].version != version)) {
						return reject(err);
					}
			}
			
			if(err !== null) {
				return reject(err);
			}
			resolve(true);
		})
	})
}

// Obsolete:: For testing the identification of an artefact, according to the SDMX types
function checkIdentification (agencyId, id, version) {
	const regexAgencyId = /([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*)/gm;
	const regexId = /[A-Za-z0-9_@$\-]+/gm;
	const regexVersion = /[0-9]+(\.[0-9]+)*/gm;
	expect(agencyId).to.match(regexAgencyId)
	expect(id).to.match(regexId)
	expect(version).to.match(regexVersion)
}

// Returns an array of the requested terms: type, agencyId, id, version
function getRequestedTerms(structureResource) {
	// Remove the URL query parameters
	let qIndex = structureResource.indexOf('?');
	if (qIndex > 0) {
		structureResource = structureResource.substr(0, qIndex)
	}
	return structureResource.split('/')
}

// The tests
const testGetStructure = function (structureResource, accept, contentType, fn) {
  let response
  let query = `${endpoint}${structureResource}`
	//create an array of the request terms: type, agencyId, id, version
	let requested = getRequestedTerms(structureResource);

	before(function () {
		response = chakram.get(query, {
      headers: {
        'Accept': accept
      }
    })
  })
	
  it('should respond with status 200', function () {
    expect(response).to.have.status(200)
    //expect(response).to.have.responsetime(5000)
		console.log(`\tCodelist: ${requested[2]}`);
    return chakram.wait()
	})
	
	it('should be a valid SDMX 2.1 response', function () {
    if (contentType == '') {
      let contentType = accept;
    }
		expect(response).to.have.header('Content-Type', function(contentType) {
        expect(contentType).to.include('application/vnd.sdmx.structure+xml');
				expect(contentType).to.include('version=2.1');
    });
		return chakram.wait()
    .then(function (response) {
			return validate(response.body)
		})
		.catch(function (error){
			assert.ifError(error).fail(error , 'No valid SDMX 2.1!');
		})
	})

	it('should match the requested structures', function () {
		if (structureResource.includes('/all/all/all')){
	    expect(response).to.have.status(200); // need to decide if we report this as a missing or not supported error code.
	    return chakram.wait()
			.then(function (response) {
				return getArtefactIdentification(response.body, true, requested[0])
			})
			.then (function (artefact) {
				// redundant to check the identification, since it is a valid SDMX 2.1
				checkIdentification(artefact.agencyId, artefact.id, artefact.version)
				return chakram.wait()
			})
			.then (function (response){
				//do something useful with the response
			})
			.catch(function (error){
				assert.ifError(error).fail(error, 'Parsing error!');
			})
		}else {
			expect(response).to.have.status(200);
	    return chakram.wait()
			.then(function (response) {
				return getArtefactIdentification(response.body, false, requested[0])
			})
			.then (function (artefact) {
				// redundant to check the identification, since it is a valid SDMX 2.1
				checkIdentification(artefact.agencyId, artefact.id, artefact.version)
				// tests for the identification of the returned artefacts according to the resource parameters
				if (requested[1] && requested[1]!=('all')){
					expect(artefact.agencyId).to.equal(requested[1])
				}
				if (requested[2] && requested[2]!=('all')){
					expect(artefact.id).to.equal(requested[2])
				}
				if (requested[3] && requested[3]!=('all')){
					expect(artefact.version).to.equal(requested[3])
				}
				return chakram.wait()
			})
			.then (function (response){
				// Check that all results comply with the request
				return checkResults(response.body,requested[0],requested[1],requested[2],requested[3])
			})
			.catch(function (error){
				assert.ifError(error).fail(error, 'Parsing error!');
			})
		}
	})

  it.skip('should support CORS', function () {
    expect(response).to.have.header('Origin')
    expect(response).to.have.header('Access-Control-Allow-Origin', '*')
    return chakram.wait()
  })

  after(function () {
    response = null
    query = ''
  })
}

const ts21 = function () {
	accept = 'application/vnd.sdmx.structure+xml; version=2.1'
	
	structure.forEach(function (res) {
		describe(`TS#2.1 PREREQUISITES: GET allstubs of all/all/all ".../${res}"`, function () {
	    testGetStructure(`${res}/all/all/all?detail=allstubs`, accept, accept, function(identifier){

					describe(`T#2.1.1 GET ".../${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}"`, function () {
						testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}`, accept, accept)
					})
					describe(`T#2.1.2 GET all ".../${res}" with id: ${identifier.id} and version: ${identifier.version}`, function () {
			      testGetStructure(`${res}/all/${identifier.id}/${identifier.version}?detail=allstubs`, accept)
					})
					describe(`T#2.1.3 GET all ".../${res}" of agency: ${identifier.agencyId} and version: ${identifier.version}`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}/all/${identifier.version}?detail=allstubs`, accept)
					})
					describe(`T#2.1.4 GET all ".../${res}" of agency: ${identifier.agencyId} and id: ${identifier.id}`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}/all?detail=allstubs`, accept)
					})
					describe(`T#2.1.5 GET latest ".../${res}" of agency: ${identifier.agencyId} and id: ${identifier.id}`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}?detail=allstubs`, accept)
					})
					describe(`T#2.1.6 GET latest ".../${res}" of agency: ${identifier.agencyId}?detail=allstubs`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}`, accept)
					})
			})
	  })
	})
}

const ts22 = function () {
	// To create a new test for 2.2 or create modular tests and call them selectively
	structure.forEach(function (res) {
		describe(`TS#2.2 PREREQUISITES: GET allstubs of all/all/all ".../${res}"`, function() {
			testGetStructure(`${res}/all/all/all?detail=allstubs`, accept,
				'application/vnd.sdmx.structure+xml; version=2.1',function(identifier){
				describe(`T#2.2.1 GET ".../${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}?references=children"`, function () {
					testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}?references=children`, accept)
				})
			})
		})
	})
}

/* Tests to assess the TCK performance, by using a mock web service */
const performanceTests = function() {
  let endpoint = mockWsEndpoint;

  structure.forEach(function (res) {
		/* Mock SDMX REST Web Service, for measuring the TCK performance in handling responses, parsing, validating and cross-checking */
		var minCodes = 10000;
		var maxCodes = 10000;
		var step = 10000;
		describe(`TCK Testing:: To be used with mock SDMX web service for getting Codelists`, function(){
			this.timeout(200000);
			for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
				testGetStructure(`${res}/SDMX/CL${codes}/all/`, accept,
					'application/vnd.sdmx.structure+xml; version=2.1')
				}
		})
		describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have URNs (68% larger message)`, function(){
			this.timeout(200000);
			for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
				testGetStructure(`${res}/SDMX/CLU${codes}/all/`, accept,
					'application/vnd.sdmx.structure+xml; version=2.1')
				}
		})
		describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have Descriptions (140% larger message)`, function(){
			this.timeout(200000);
			for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
				testGetStructure(`${res}/SDMX/CLD${codes}/all/`, accept,
					'application/vnd.sdmx.structure+xml; version=2.1')
				}
		})
		describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have URNs and Descriptions (210% larger message)`, function(){
			this.timeout(200000);
			for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
				testGetStructure(`${res}/SDMX/CLUD${codes}/all/`, accept,
					'application/vnd.sdmx.structure+xml; version=2.1')
				}
		})
		describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have Annotations (237% larger message)`, function(){
			this.timeout(200000);
			for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
				testGetStructure(`${res}/SDMX/CLA${codes}/all/`, accept,
					'application/vnd.sdmx.structure+xml; version=2.1')
				}
		})
		describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have URNs and Annotations (306% larger message)`, function(){
			this.timeout(200000);
			for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
				testGetStructure(`${res}/SDMX/CLUA${codes}/all/`, accept,
					'application/vnd.sdmx.structure+xml; version=2.1')
				}
		})
  })
}

describe('SDMX Web Service Toolkit Compatibility Kit (TCK)', function() {
	console.log(pjson.version);
  console.info('Testing: ' + endpoint)

	for (var testSet in testSets) {
		//console.log(`Test Set: ${testSets[testSet].id} ${testSets[testSet].description}:: # of tests: ${testSets[testSet].tests.length}`);
    if (testSets[testSet].tests.length > 0) {
		  describe(`${testSets[testSet].id}`, function () {
        // Execute the corresponding test set based on its identifier
	      eval(testSet+'()');
      })
		}
	}	
})
