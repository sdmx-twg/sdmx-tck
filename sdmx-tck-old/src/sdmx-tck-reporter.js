// sdmx-tck-reporter

var report = {
  apiVersion: '',
  swVersion: '',
  wsinfo: {
    endpoint: '',
    type: 'rest'
  },
  summary: {
    returncode: 0,
    rating: {
      dataindex: {
        compliance: 0,
        coverage: 0
      },
      structureindex: {
        compliance: function(){
          var total = 0;
          for (count in report.summary.structure) {
            total += report.summary.structure[count];
          }
          return (report.summary.structure.comply+report.summary.structure.pass/total);
        },
        coverage:  function(){
          var total = 0;
          for (count in report.summary.structure) {
            total += report.summary.structure[count];
          }
          return (report.summary.structure.pass/total);
        }
      },
      schemaindex: {
        compliance: 0,
        coverage: 0
      },
      metadataindex: {
        compliance: 0,
        coverage: 0
      }
    },
    starttime: 0,
    endtime: 0,
    duration: 0,
    data: {pass:0, fail:0, comply:0},
    structure: {pass:0, fail:0, comply:0},
    schema: {pass:0, fail:0, comply:0},
    metadata: {pass:0, fail:0, comply:0}
  },
  details: {
    /*
    '1.1.1': {
      request: 'http://rest.webservice.org/ws/data/DATAFLOW',
      result: 'pass'
    },
    '2.1.1': {
      request: 'http://rest.webservice.org/ws/hierarchicalcodelist/all/all/all?detail=allstubs',
      result: 'comply',
      error: {
        code: '100',
        duration: 1234,
        httpCode: '404',
        resource: {
          type: 'hierarchicalcodelist',
          url: 'hierarchicalcodelist/all/all/all?detail=allstubs',
          method: 'GET',
          contenType: 'application/vnd.sdmx.structure+xml; version=2.1'
        },
        description: {
          'en': 'No result.'
        },
        detail: {
          'en': 'Structures should be returned.'
        }
      }
    },
    '2.2.1': {
      request: 'http://rest.webservice.org/ws/dataflow/DATAFLOW?references=children',
      result: 'fail',
      error: {
        code: '150',
        duration: 1234,
        httpCode: '200',
        resource: {
          type: 'dataflow',
          url: 'dataflow/ESTAT/all/all',
          method: 'GET',
          contenType: 'application/vnd.sdmx.structure+xml; version=2.1'
        },
        description: {
          'en': 'Missign artefact ESTAT:NAMAIN_ICD_N(1.9)'
        },
        detail: {
          'en': 'Artefact ESTAT:NAMAIN_ICD_N(1.9) is expected to be included in response'
        },
        ref: {
          class: 'Dataflow',
          agency: 'ESTAT',
          id: 'NAMAIN_IDC_N',
          version: '1.9'
        }
      }
    }
    */
  }
}

function init(apiVersion, swVersion, wsinfo) {
  report.summary.starttime = Date.now();
  report.apiVersion = apiVersion;
  report.swVersion = swVersion;
  report.wsinfo = wsinfo;
}

function record(test, request, result, details) {
  var resource = request.resource;
  // initialise details entry for given test
  if (typeof(report.details[test]) === 'undefined') {
    report.details[test] = {};
    report.details[test][resource] = {request:'', result:''};
  }else if (typeof(report.details[test][request]) === 'undefined') {
    report.details[test][resource] = {request:'', result:''};
  }
  /*if (typeof(report.summary.structure) === 'undefined') {
    report.summary.structure = {pass:0, fail:0, comply:0};
  }*/
  // Record request, result and details
  report.details[test][resource].request = request;
  report.details[test][resource].result = result;
  if (typeof(details) !== 'undefined') {
    report.details[test][resource].error = details;
  }
  // aggregate results for index calculation
  if (result == 'pass') {
    report.summary.structure.pass++;
  }else if(result == 'comply') {
    report.summary.structure.comply++;
  }else {
    report.summary.structure.fail++;
  }
}

function publishReport(format) {
  // return Object.keys(report.details).length;
  report.summary.endtime = Date.now();
  report.summary.duration = report.summary.endtime - report.summary.starttime;
  console.log('\nReporting...');

  switch (format) {
  case 'pdf':
    return 'a pdf file';
  break;
  case 'json':
    return JSON.stringify(report);
  break;
  default:
    console.log(JSON.stringify(report, null, 2));
    var reportString = `<p><strong style="color:red;font-family: monospace;">Structure compliance score: ${report.summary.rating.structureindex.compliance()}
      <p><strong style="color:red;font-family: monospace;">Structure coverage score: ${report.summary.rating.structureindex.coverage()}`;
    // console.log(JSON.stringify(report.details));
    return reportString;
  }  
}

// now we export the class, so other modules can create objects
module.exports = {
    init: init,
    record: record,
    publishReport: publishReport
}
