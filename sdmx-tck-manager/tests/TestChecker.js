var SdmxXmlParser = require("../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js");
var StructureRequestBuilder = require("../../sdmx-tck-manager/src/builders/structure-queries-builders/StructureRequestBuilder.js");
const fs = require("fs");
const DataSemanticChecker = require("../../sdmx-tck-manager/src/checker/DataSemanticChecker.js");
const SemanticCheckerFactory = require("../../sdmx-tck-manager/src/checker/SemanticCheckerFactory.js");
const TestExecutionManagerFactory = require("../../sdmx-tck-manager/src/manager/TestExecutionManagerFactory.js");

const DATA_QUERY_KEY = require("sdmx-tck-api").constants.DATA_QUERY_KEY;
var SdmxStructureObjects = require("sdmx-tck-api").model.SdmxStructureObjects;
var SeriesObject = require("sdmx-tck-api").model.SeriesObject;

describe.only("Tests DataQuery semantic validation in Resource Provider Identification Test", function () {
  it("It should assert semantic validation result", async () => {
    let toRun = {};
    let endpoint = "https://stats.bis.org/api/v1/";
    let xmlMessage = fs.readFileSync(
      "./tests/resources/WS_BS_CTPY_COUNTRY.xml",
      "utf8"
    );

    toRun = {
      testId: "/hierarchicalcodelist/agency/id",
      index: "Structure",
      run: false,
      apiVersion: "v1.4.0",
      resource: "hierarchicalcodelist",
      reqTemplate: {
        version: "latest",
      },
      identifiers: {
        structureType: "HierarchicalCodelist",
        agency: "BIS",
        id: "WS_BS_CTPY_COUNTRY",
        version: "",
      },
      state: "Waiting",
      failReason: "",
      testType: "Structure Identification Parameters",
      subTests: [],
      requireRandomSdmxObject: true,
    };

    //// WORKSPACE VALIDATION ////
    let workspace = await new SdmxXmlParser().getIMObjects(xmlMessage,toRun.apiVersion);

    console.log("Test: " + toRun.testId + " SDMX workspace created.");

    let preparedRequest = await StructureRequestBuilder.prepareRequest(
      endpoint,
      "v1.4.0",
      toRun
    );

    // WORKSPACE VALIDATION
    let workspaceValidation = await SemanticCheckerFactory.getChecker(toRun).checkWorkspace(toRun, preparedRequest, workspace);

    console.log(
      "workspaceValidation : ",
      workspaceValidation.status,
      workspaceValidation.error,
      workspaceValidation
    );
  });
});


describe("Run Specific test", function () {
  it("check", async () => {
    const apiVersion = "v1.4.0";
    const endpoint = "https://stats.bis.org/api/v1/";
    const specificTest = {
      testId: "/actualconstraint/all/all/all",
      index: "Structure",
      run: false,
      apiVersion: apiVersion,
      resource: "actualconstraint",
      reqTemplate: {
        agency: "all",
        id: "all",
        version: "all",
        detail: "allstubs",
        representation: "application/vnd.sdmx.structure+xml;version=2.1",
      },
      identifiers: {
        structureType: "",
        agency: "all",
        id: "all",
        version: "all",
      },
      state: "Waiting",
      failReason: "",
      testType: "Structure Identification Parameters",
      subTests: [],
      requireRandomSdmxObject: true,
    };
 
    TestExecutionManagerFactory.getTestsManager(specificTest.index)
      .executeTest(specificTest, apiVersion, endpoint)
      .then(
        (result) => {
          console.log(
            "Test: " + specificTest.testId + " completed.",
            specificTest
          );
          console.log("result", result);
        },
        (error) => {
          console.log(
            "Test: " + specificTest.testId + " failed. Cause: " + error
          );
          res.send(error);
        }
      );
  });
});
