const TestExecutionManagerFactory = require("../../sdmx-tck-manager/src/manager/TestExecutionManagerFactory.js");

describe("Runs specific tests", function () {
  context('With api version v1.4.0', function () {
    const apiVersion = "v1.4.0";

    it.only("Runs the /hierarchicalcodelist/agency/id/version/items test", async () => {
      const endpoint = "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest"
      const specificTest =
      {
        testId: "/hierarchicalcodelist/agency/id/version/items",
        index: "Structure",
        run: false,
        apiVersion: apiVersion,
        resource: "hierarchicalcodelist",
        reqTemplate: {},
        identifiers: {
          structureType: "HIERARCHICAL_CODELIST",
          agency: "UNICEF",
          id: "CME_REGIONS_HIERARCHY",
          version: "1.0"
        },
        state: "Waiting",
        failReason: "",
        testType: "Structure Identification Parameters",
        isParent: false,
        subTests: [],
        items: ["UNICEF_REP", "WB_INCOME"],
        requireItems: true,
        requireRandomSdmxObject: true
      }
      await _executeTest(specificTest, apiVersion, endpoint);
    });

    it("Runs the /codelist/agency/id/version (application/vnd.sdmx.structure+xml;version=1.9) test", async () => {
      const endpoint = "https://demo11.metadatatechnology.com/FusionRegistry/sdmx/v1";
      const specificTest =
      {
        testId: "/codelist/agency/id/version (application/vnd.sdmx.structure+xml;version=1.9)",
        index: "Structure",
        run: false,
        apiVersion: "v1.4.0",
        resource: "codelist",
        reqTemplate: {
          representation: "application/vnd.sdmx.structure+xml;version=1.9",
          references: "none",
          detail: "allstubs"
        },
        identifiers: {
          structureType: "CODE_LIST",
          agency: "CD2030",
          id: "CL_WASH_SERVICE_LEVEL",
          version: "1.0"
        },
        state: "Waiting",
        failReason: "",
        testType: "Structure Query Representation",
        isParent: false,
        subTests: [],
        requireRandomSdmxObject: true
      }
      await _executeTest(specificTest, apiVersion, endpoint);
    });
  });

  context('With api version v2.0.0', function () {
    const apiVersion = "v2.0.0";
    it("Tests the /availability/agency,dataflow,version/all test", async () => {
      const endpoint = "https://demo11.metadatatechnology.com/FusionRegistry/sdmx/v2";

      const specificTest = {
        testId: "/availability/agency,dataflow,version/all",
        index: "Data",
        run: false,
        apiVersion: apiVersion,
        resource: "dataflow",
        reqTemplate: {
          representation: "application/vnd.sdmx.structure+xml;version=3.0.0"
        },
        identifiers: {
          structureType: "DATAFLOW",
          agency: "MENARO",
          id: "MENARO",
          version: "1.0"
        },
        state: "Waiting",
        failReason: "",
        testType: "Data Availability",
        isParent: true,
        indicativeSeriesAttributes: [
          {
            REF_AREA: "SYR",
            INDICATOR: "NT_ANT_WAZ_NE3",
            SEX: "_T",
            RESIDENCE: "U",
            WEALTH_QUINTILE: "Q5",
            UNIT_MULTIPLIER: "0",
            UNIT_MEASURE: "PCNT"
          },
          {
            REF_AREA: "KWT",
            INDICATOR: "WS_HCF_W-B",
            SEX: "_T",
            RESIDENCE: "U",
            WEALTH_QUINTILE: "_T",
            UNIT_MEASURE: "PCNT"
          }
        ]
      }
      await _executeTest(specificTest, apiVersion, endpoint);
    });
  });

  const _executeTest = async (specificTest, apiVersion, endpoint) => {
    await TestExecutionManagerFactory.getTestsManager(specificTest.index)
      .executeTest(specificTest, apiVersion, endpoint)
      .then(
        (result) => {
          if (result.hasOwnProperty("failReason") && result.failReason) {
            console.error("Test: " + specificTest.testId + " failed. Cause: " + JSON.stringify(result.failReason));
          } else {
            console.log("Test: " + specificTest.testId + " completed successfully.");
          }
        },
        (error) => {
          console.error("Test: " + specificTest.testId + " failed. Cause: " + error);
        }
      );
  };
});