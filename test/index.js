// required packages
var validator = require('xsd-schema-validator');
var parseString = require('xml2js').parseString;
var chakram = require('chakram')
var expect = chakram.expect
var assert = require('chai').assert
var url = require('url');

// get TCK versions
const pjson = require('../package.json');

// The user's SDMX REST endpoint
const gsrEndpoint = 'https://registry.sdmx.org/FusionRegistry/ws/rest/';
const gsrTestEndpoint = 'https://test2.registry.sdmx.org/FusionRegistry/ws/rest/';
const wsEndpoint = 'http://localhost:8080/sri-ws/rest/';
const ecbEndpoint = 'https://sdw-wsrest.ecb.europa.eu/service/';
const estatDissEndpoint = 'http://ec.europa.eu/eurostat/SDMX/diss-web/rest/';
const imfCentralEndpoint = 'https://sdmxcentral.imf.org/ws/public/sdmxapi/rest/';
const mockWsEndpoint = 'http://localhost:3000/rest/';
let endpoint = gsrTestEndpoint;

/* The test sets to be executed. Although 4 indices shall be calculated, we maintain all TestSets
  in one collection. Each TestSet is an array that includes the Tests. Each TestSet may include 
  metadata, e.g. the tests, its title, weight, etc.
  For the moment, the .tests is an array with the selected tests to run, but it is only used to run 
  all tests under a test set, regardsless of the number of tests in the array. In the future it could 
  (be an object and) include more details about the tests (weights, if not equal; API version, etc.) 
  and should be used to filter which tests are executed.
*/
let testSets = {
  ts11:{id:'1.1', tests:[], description:'Data – Resource identification parameters support'}, 
  ts12:{id:'1.2', tests:[], description:'Data – Extended resource identification parameters support'}, 
  ts13:{id:'1.3', tests:[], description:'Data – Parameters for further describing or filtering results'}, 
  ts14:{id:'1.4', tests:[], description:'Data – Representations support'}, 
  ts15:{id:'1.5', tests:[], description:'Data – Other features'}, 
  ts21:{id:'2.1', tests:['1'], description:'Structures – Resource identification parameters support'}, 
  ts22:{id:'2.2', tests:[], description:'Structures – Extended resource identification parameters'}, 
  ts23:{id:'2.3', tests:[], description:'Structures – Parameters for further describing the results'}, 
  ts24:{id:'2.4', tests:[], description:'Structures – Representations support'}, 
  ts25:{id:'2.5', tests:[], description:'Structures – Other features'}, 
  ts31:{id:'3.1', tests:[], description:'Schemas – Resource identification parameters support'}, 
  ts32:{id:'3.2', tests:[], description:'Schemas – Extended resource identification parameters support'}, 
  ts33:{id:'3.3', tests:[], description:'Schemas – Parameters for further describing or filtering results'}, 
  ts34:{id:'3.4', tests:[], description:'Schemas – Representations support'}, 
  ts35:{id:'3.5', tests:[], description:'Schemas – Other features'}, 
  ts41:{id:'4.1', tests:[], description:'Metadata – Resource identification parameters support'}, 
  ts42:{id:'4.2', tests:[], description:'Metadata – Extended resource identification parameters support'}, 
  ts43:{id:'4.3', tests:[], description:'Metadata – Parameters for further describing or filtering results'}, 
  ts44:{id:'4.4', tests:[], description:'Metadata – Representations support'}, 
  ts45:{id:'4.5', tests:[], description:'Metadata – Other features'}
}

// The user's structure selection to be tested is stored in the 'structure' array
let structure = ['datastructure', 'metadatastructure', 'categoryscheme', 'conceptscheme', 
  'codelist', 'hierarchicalcodelist', 'organisationscheme', 'agencyscheme', 'dataproviderscheme', 
  'dataconsumerscheme', 'organisationunitscheme', 'dataflow', 'metadataflow', 'reportingtaxonomy', 
  'provisionagreement', 'structureset', 'process', 'categorisation', 'contentconstraint', 
  'attachmentconstraint', 'structure']
// structure = ['codelist']; // for selective testing of specific SDMX Artefacts

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

// Returns the Artefact Type from its URN
const sdmxUrnToType = function(urn) {
  return type = urn.slice(urn.indexOf('.',29)+1, urn.indexOf('='));
}

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

  // Get the message prefixes from the namespace definitions in the XML root element. 
  // TODO: check xml2js documentation for an alternative
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
  
  // If the method was called with the 'all' true or the resource was the generic 'structure', then assume more than one artefact types exist
  if (all || resource == 'structure') {
    // An array of the returned SDMX Artefact types to be used for getting the content of each Group
    var arrayOfReturnedArtefactTypes = Object.getOwnPropertyNames(arrayOfReturnedArtefacts);
    
    // The ArtefactName to request the lists of returned SDMX Artefacts
    var artefactNameIndex;
    // console.log(`${arrayOfReturnedArtefactTypes.length} artefact types`);
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

    // The list of the specific resource requested
    arrayOfArtefacts = arrayOfReturnedArtefacts[structurePrefix + xmlGroupName][0][structurePrefix + xmlArtefactName];
  }
  
  return arrayOfArtefacts;
}

// Returns the Artefact identification; returns a random one, if requested.
function getArtefactIdentification(body, random, resource) {

  return new Promise(function(resolve, reject){
    parseString(body, function (err, result) {
      
      var arrayOfStructures = getStructuresList(result, resource);

      var index = 0;
      if (random) {
        // Randomly pick an index from the available array of Artefacts
        index = Math.floor(Math.random() * arrayOfStructures.length);
      }

      // Get the identification of the randomly picked Artefact, or the first one.
      var identifier = {
        agencyId: arrayOfStructures[index]['$'].agencyID,
        id: arrayOfStructures[index]['$'].id,
        version: arrayOfStructures[index]['$'].version
      }
      //console.log(`\tPicked ${identifier.agencyId}:${identifier.id}(${identifier.version}) out of ${arrayOfStructures.length} Artefacts!`);

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

      var arrayOfStructures = getStructuresList(result, resource);
      for (returnedStructure in arrayOfStructures) {
        let thisId = arrayOfStructures[returnedStructure]['$'].id
        let thisAgencyId = arrayOfStructures[returnedStructure]['$'].agencyID
        let thisVersion = arrayOfStructures[returnedStructure]['$'].version
        if ((agencyId && agencyId != 'all' && thisAgencyId != agencyId)
          || (id && id != 'all' && thisId != id)
          || (version && version != 'all' && thisVersion != version)) {
            return reject(`No match for ${thisAgencyId}:${thisId}(${thisVersion})`);
          }
      }
      
      if(err !== null) {
        return reject(err);
      }
      resolve(true);
    })
  })
}

// Returns list of references for any SDMX Artefact
const checkReferences = function (listOfReferences, agencyId, id, version, references) {
  return new Promise(function(resolve, reject){
    
    var thisArtefact = listOfReferences[`${agencyId}+${id}+${version}`]
    // console.log(JSON.stringify(thisArtefact));
    urn = thisArtefact['$']['urn'];
    
    switch (sdmxUrnToType(urn)){
      case 'Codelist':
      
      break;
      case 'ConceptScheme':
      
      break;
      case 'DataStructure':
      
      break;
      case 'Dataflow':
      
      break;
      default:
      
      break;
    }
    for (returnedStructure in listOfReferences) {
      
    //  console.log(JSON.stringify(arrayOfReferences[returnedStructure]));
      
    }
    //if(err !== null) {
      //return reject(err);
    //}
    resolve(true);
  })
}

// Checks that the returned structures comply to the requested resource parameters
const checkResultsWithRefs = function (body, resource, agencyId, id, version) {

  return new Promise(function(resolve, reject){
    parseString(body, function (err, result) {

      var arrayOfStructures = getStructuresList(result, '', true);
      var listOfReferences = {}; // map of identification:artefact
      // TODO: check references

      for (returnedStructure in arrayOfStructures) {
        let thisId = arrayOfStructures[returnedStructure]['$'].id
        let thisAgencyId = arrayOfStructures[returnedStructure]['$'].agencyID
        let thisVersion = arrayOfStructures[returnedStructure]['$'].version
        listOfReferences[`${thisAgencyId}+${thisId}+${thisVersion}`] = arrayOfStructures[returnedStructure];
        // console.log(JSON.stringify(arrayOfStructures[returnedStructure]));
        // console.log(arrayOfStructures[returnedStructure]['$']);
        if ((agencyId && agencyId != 'all' && thisAgencyId != agencyId)
          || (id && id != 'all' && thisId != id)
          || (version && version != 'all' && thisVersion != version)) {
            //return reject(`No match for ${thisAgencyId}:${thisId}(${thisVersion})`);
          }
      }
      // console.log(JSON.stringify(listOfReferences));
      console.log(checkReferences(listOfReferences, agencyId, id, version, references));
      if(err !== null) {
        return reject(err);
      }
      resolve(true);
    })
  })
}

// Returns an object of the requested terms: type, agencyId, id, version and parameters
const getRequestedTerms = function (resource) {
  // Parse the query string parameters
  let url_parts = url.parse(resource, true);
  
  // Get the query parameters
  let queryObj = url_parts.query;
  
  // Get the path parameters
  let requested = url_parts.pathname.split('/');
  queryObj['type'] = requested[0];
  queryObj['agencyId'] = requested[1];
  queryObj['id'] = requested[2];
  queryObj['version'] = requested[3];

  return queryObj;
}

/*******************************************************************
  The test functions
*/

// This is the prerequisites tests. For the moment it is also used to return the random Artefact.
const preTest = function (resource, accept, fn) {
  let response
  let query = `${endpoint}${resource}`
  let requested = getRequestedTerms(resource);
  
  before(function () {
    response = chakram.get(query, {
      headers: {
        'Accept': accept
      }
    })
  })
  
  it('should respond with status 200', function () {
    expect(response).to.have.status(200)
    return chakram.wait()
  })
  
  it('should be a valid SDMX 2.1 response', function () {
    expect(response).to.have.header('Content-Type', function(contentType) {
        expect(contentType).to.include('application/vnd.sdmx.structure+xml');
        expect(contentType).to.include('version=2.1');
    });
    return chakram.wait()
    .then(function (response) {
      // XSD validation
      return validate(response.body)
    })
    .catch(function (error){
      assert.ifError(error).fail(error , 'No valid SDMX 2.1!');
    })
  })

  it('should match the requested structures', function () {
    if (resource.includes('/all/all/all')){
      expect(response).to.have.status(200); // need to decide if we report this as a missing or not supported error code.
      return chakram.wait()
      .then(function (response) {
        return getArtefactIdentification(response.body, true, requested.type)
      })
      .then (function (artefact){
        //do something useful with the response - for now only return the random artefact
        fn(artefact);
      })
      .catch(function (error){
        assert.ifError(error).fail(error, 'Parsing error!');
      })
    }else {
      // For other prerequisites
    }
  })

  after(function () {
    response = null
    query = ''
  })
}

// Test GETting SDMX structures and checking results
const testGetResource = function (resource, accept, fn) {
  let response
  let query = `${endpoint}${resource}`
  let requested = getRequestedTerms(resource);
  // console.log(JSON.stringify(requested));
  
  before(function () {
    response = chakram.get(query, {
      headers: {
        'Accept': accept
      }
    })
  })
  
  it('should respond with status 200', function () {
    expect(response).to.have.status(200)
    return chakram.wait()
  })
  
  it('should be a valid SDMX 2.1 response', function () {
    expect(response).to.have.header('Content-Type', function(contentType) {
        expect(contentType).to.include('application/vnd.sdmx.structure+xml');
        expect(contentType).to.include('version=2.1');
    });
    return chakram.wait()
    .then(function (response) {
      // XSD validation
      return validate(response.body)
    })
    .catch(function (error){
      assert.ifError(error).fail(error , 'No valid SDMX 2.1!');
    })
  })

  it('should match the requested structures', function () {
    if (resource.includes('/all/all/all')){
      assert.fail('','','Did not expect wildcard here!');
    }else if (resource.indexOf('references=') > 0) {
      expect(response).to.have.status(200);
      return chakram.wait()
      .then (function (response){
        // Check that all results comply with the request
        return checkResultsWithRefs(response.body,requested.type,requested.agencyId,requested.id,requested.version)
      })
      .catch(function (error){
        assert.ifError(error).fail(error, 'Parsing error!');
      })
    }else {
      expect(response).to.have.status(200);
      return chakram.wait()
      .then (function (response){
        // Check that all results comply with the request
        return checkResults(response.body,requested.type,requested.agencyId,requested.id,requested.version)
      })
      .catch(function (error){
        assert.ifError(error).fail(error, 'Parsing error!');
      })
    }
  })
  
  after(function () {
    response = null
    query = ''
  })
}

const testOther = function (resource, accept) {
  let response
  let query = `${endpoint}${resource}`
  let requested = getRequestedTerms(resource);

  before(function () {
    response = chakram.get(query, {
      headers: {
        'Accept': accept
      }
    })
  })
  
  it('should respond with status 200', function () {
    expect(response).to.have.status(200)
    return chakram.wait()
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

/*******************************************************************
  This section includes the Test Sets; each as a separate function.
*/

const ts21 = function () {
  let accept = 'application/vnd.sdmx.structure+xml; version=2.1'
  
  structure.forEach(function (res) {
    describe(`TS#2.1 PREREQUISITES: GET allstubs of all/all/all ".../${res}"`, function () {
      preTest(`${res}/all/all/all?detail=allstubs`, accept, function(identifier){
          describe(`T#2.1.1 GET ".../${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}"`, function () {
            testGetResource(`${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}`, accept)
          })
          describe(`T#2.1.2 GET all ".../${res}" with id: ${identifier.id} and version: ${identifier.version}`, function () {
            testGetResource(`${res}/all/${identifier.id}/${identifier.version}?detail=allstubs`, accept)
          })
          describe(`T#2.1.3 GET all ".../${res}" of agency: ${identifier.agencyId} and version: ${identifier.version}`, function () {
            testGetResource(`${res}/${identifier.agencyId}/all/${identifier.version}?detail=allstubs`, accept)
          })
          describe(`T#2.1.4 GET all ".../${res}" of agency: ${identifier.agencyId} and id: ${identifier.id}`, function () {
            testGetResource(`${res}/${identifier.agencyId}/${identifier.id}/all?detail=allstubs`, accept)
          })
          describe(`T#2.1.5 GET latest ".../${res}" of agency: ${identifier.agencyId} and id: ${identifier.id}`, function () {
            testGetResource(`${res}/${identifier.agencyId}/${identifier.id}?detail=allstubs`, accept)
          })
          describe(`T#2.1.6 GET latest ".../${res}" of agency: ${identifier.agencyId}`, function () {
            testGetResource(`${res}/${identifier.agencyId}?detail=allstubs`, accept)
          })
      })
    })
  })
}

const ts22 = function () {
  let accept = 'application/vnd.sdmx.structure+xml; version=2.1'
  // To create a new test for 2.2 or create modular tests and call them selectively
  structure.forEach(function (res) {
    describe(`TS#2.2 PREREQUISITES: GET allstubs of all/all/all ".../${res}"`, function() {
      preTest(`${res}/all/all/all?detail=allstubs`, accept, function(identifier){
        describe(`T#2.2.1 GET ".../${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}?references=children"`, function () {
          testGetResource(`${res}/${identifier.agencyId}/${identifier.id}/${identifier.version}?references=children&detail=referencestubs`, accept)
        })
      })
    })
  })
}

const ts25 = function (testSet) {
  let accept = 'application/vnd.sdmx.structure+xml; version=2.1'
  describe(`${testSet.id}`, function() {
    testOther('codelist/all?detail=allstubs', accept)
  })
}

/*******************************************************************
  Tests to assess the TCK performance, by using a mock web service 
*/
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
        testGetResource(`${res}/SDMX/CL${codes}/all/`, accept,
          'application/vnd.sdmx.structure+xml; version=2.1')
        }
    })
    describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have URNs (68% larger message)`, function(){
      this.timeout(200000);
      for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
        testGetResource(`${res}/SDMX/CLU${codes}/all/`, accept,
          'application/vnd.sdmx.structure+xml; version=2.1')
        }
    })
    describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have Descriptions (140% larger message)`, function(){
      this.timeout(200000);
      for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
        testGetResource(`${res}/SDMX/CLD${codes}/all/`, accept,
          'application/vnd.sdmx.structure+xml; version=2.1')
        }
    })
    describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have URNs and Descriptions (210% larger message)`, function(){
      this.timeout(200000);
      for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
        testGetResource(`${res}/SDMX/CLUD${codes}/all/`, accept,
          'application/vnd.sdmx.structure+xml; version=2.1')
        }
    })
    describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have Annotations (237% larger message)`, function(){
      this.timeout(200000);
      for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
        testGetResource(`${res}/SDMX/CLA${codes}/all/`, accept,
          'application/vnd.sdmx.structure+xml; version=2.1')
        }
    })
    describe.skip(`TCK Testing:: To be used with mock SDMX web service for getting Codelists where Codes have URNs and Annotations (306% larger message)`, function(){
      this.timeout(200000);
      for (var codes = minCodes; codes <= maxCodes; codes = codes + step) {
        testGetResource(`${res}/SDMX/CLUA${codes}/all/`, accept,
          'application/vnd.sdmx.structure+xml; version=2.1')
        }
    })
  })
}

/*******************************************************************
  The main entry point for the TCK tests
*/
describe('SDMX Web Service Toolkit Compatibility Kit (TCK)', function() {
  console.log(`Release ${pjson.version}`);
  console.info(`API version: ${pjson.sdmx.apiVersion}`);
  console.info('Testing: ' + endpoint);
  console.info(`Selected Test Sets:`);
  for (var testSet in testSets) {
    // Execute those Test Sets that include (user selected) Tests.
    if (testSets[testSet].tests.length > 0) {
      console.log(`\tTS#${testSets[testSet].id} ${testSets[testSet].description}:: # of tests: ${testSets[testSet].tests.length}`)
      describe(`${testSets[testSet].id}`, function () {
        // Execute the corresponding test set based on its identifier
        eval(testSet+'(testSets[testSet])');
      })
    }
  }
})
