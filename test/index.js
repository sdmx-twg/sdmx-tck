let parseString = require('xml2js').parseString;
let validator = require('xsd-schema-validator');
let chakram = require('chakram')
let expect = chakram.expect
let assert = require('chai').assert
let structure = ['datastructure', 'metadatastructure', 'categoryscheme', 'conceptscheme', 'codelist', 'hierarchicalcodelist', 'organisationscheme', 'agencyscheme', 'dataproviderscheme', 'dataconsumerscheme', 'organisationunitscheme', 'dataflow', 'metadataflow', 'reportingtaxonomy', 'provisionagreement', 'structureset', 'process', 'categorisation', 'contentconstraint', 'attachmentconstraint', 'structure']
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
let successfulStructures = new Set()

let wsEndpoint = 'http://localhost:8080/sri-ws/rest/'

// Validates the xmlBody against the SDMX 2.1 schema files
function validate(xmlBody) {
	return new Promise(function(resolve, reject){
		validator.validateXML(xmlBody, 'schemas/SDMXMessage.xsd', function (err, data) {
			if(err !== null) {
				return reject(err);
			}
			resolve(data);
		});
	});
}

// Gets the list of SDMX structures from the response, i.e. an array of the given element type
var getStructuresList = function(result, resource){

	// Set XML Artefact and Group literal according to the requested resource
	var xmlArtefactName = xmlArtefact[resource];
	var xmlGroupName = xmlGroup[resource];

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

	return result[messagePrefix + 'Structure'][messagePrefix + 'Structures'][0][structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName];
}

// Gets the Artefact identification
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

function checkResults (body, resource, agencyId, id, version) {

	return new Promise(function(resolve, reject){
		parseString(body, function (err, result) {
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

const testGetStructure = function (structureResource, accept, contentType, fn) {
  let response
  let query = `${wsEndpoint}${structureResource}`
	//create an array of the request terms: type, agencyId, id, version
	let requested = structureResource.replace('?detail=allstubs','').split('/')

	var t0;
  before(function () {
		t0 = new Date().getTime();
    response = chakram.get(query, {
      headers: {
        'Accept': accept
      }
    })
  })

  it('should respond with status 200', function () {
    expect(response).to.have.status(200)
    expect(response).to.have.responsetime(5000)
    return chakram.wait()
	})

	it('should be a valid SDMX 2.1 response', function () {
		expect(response).to.have.header('Content-Type','application/vnd.sdmx.structure+xml; version=2.1')
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
	    expect(response).to.not.have.status(404)
	    return chakram.wait()
			.then(function (response) {
				return getArtefactIdentification(response.body, true, requested[0])
			})
			.then (function (artefact) {
				const regexAgencyId = /([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*)/gm;
				const regexId = /[A-Za-z0-9_@$\-]+/gm;
				const version = /[0-9]+(\.[0-9]+)*/gm;
				expect(artefact.agencyId).to.match(regexAgencyId)
				expect(artefact.id).to.match(regexId)
				expect(artefact.version).to.match(version)
				fn(artefact);
				return chakram.wait()
			})
			.then (function (response){
				//do something useful with the response
			})
			.catch(function (error){
				assert.ifError(error).fail(error, 'Parsing error!');
			})
		}else {
			expect(response).to.not.have.status(404)
	    return chakram.wait()
			.then(function (response) {
				return getArtefactIdentification(response.body, false, requested[0])
			})
			.then (function (artefact) {
				const regexAgencyId = /([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*)/gm;
				const regexId = /[A-Za-z0-9_@$\-]+/gm;
				const version = /[0-9]+(\.[0-9]+)*/gm;
				expect(artefact.agencyId).to.match(regexAgencyId)
				expect(artefact.id).to.match(regexId)
				expect(artefact.version).to.match(version)
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

  it('should support CORS', function () {
    expect(response).to.have.header('Origin')
    expect(response).to.have.header('Access-Control-Allow-Origin', '*')
    return chakram.wait()
  })

  after(function () {
    response = null
    query = ''
  })
}

const testGetStructures = function (accept) {
  structure.forEach(function (res) {
    describe(`TS#2.1 PREREQUISITES: GET allstubs of all/all/all ".../${res}"`, function () {
      testGetStructure(`${res}/all/all/all?detail=allstubs`, accept,
				'application/vnd.sdmx.structure+xml; version=2.1',function(identifier){
					describe(`T#2.1.1 GET ".../${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}"`, function () {
						testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}`, accept,
							'application/vnd.sdmx.structure+xml; version=2.1')
					})
					describe(`T#2.1.2 GET all ".../${res}" with id: ${identifier.id} and version: ${identifier.version}`, function () {
			      testGetStructure(`${res}/all/${identifier.id}/${identifier.version}?detail=allstubs`, accept,
							'application/vnd.sdmx.structure+xml; version=2.1')
					})
					describe(`T#2.1.3 GET all ".../${res}" of agency: ${identifier.agencyId} and version: ${identifier.version}`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}/all/${identifier.version}?detail=allstubs`, accept,
							'application/vnd.sdmx.structure+xml; version=2.1')
					})
					describe(`T#2.1.4 GET all ".../${res}" of agency: ${identifier.agencyId} and id: ${identifier.id}`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}/all?detail=allstubs`, accept,
							'application/vnd.sdmx.structure+xml; version=2.1')
					})
					describe(`T#2.1.5 GET latest ".../${res}" of agency: ${identifier.agencyId} and id: ${identifier.id}`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}/${identifier.id}?detail=allstubs`, accept,
							'application/vnd.sdmx.structure+xml; version=2.1')
					})
					describe(`T#2.1.6 GET latest ".../${res}" of agency: ${identifier.agencyId}?detail=allstubs`, function () {
			      testGetStructure(`${res}/${identifier.agencyId}`, accept,
							'application/vnd.sdmx.structure+xml; version=2.1')
					})
			})
    })
  })
}

describe('TS#2.1 Structures – Resource identification parameters support', function () {
  // describe('application/xml', function () {
  //   testGetStructures('application/xml')
  // })// application/xml
  describe('application/vnd.sdmx.structure+xml; version=2.1', function () {
    testGetStructures('application/vnd.sdmx.structure+xml; version=2.1')
  })// application/vnd.sdmx.structure+xml; version=2.1
})// 2.1
