import React from 'react';
import { connect } from 'react-redux';
import { extractSelectedTests, extractScore } from "../handlers/helperFunctions";
import TestDetails from './TestDetails';
import { exportReport } from '../actions/TestActions';

const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;

class TestsToRun extends React.Component {

  renderTest = (test, rows) => {
    var cells = [];
    /*Decide the className of the status column accordin to the status that it is representing

    1. Waiting to Start -> black color (default)
    2. Success -> green color
    3. Fail -> red color
    */
    var nameOfClass;
    if (test.state === TEST_STATE.FAILED) {
      nameOfClass = "fail";
    } else if (test.state === TEST_STATE.COMPLETED) {
      nameOfClass = "success";
    } else {
      nameOfClass = "";
    }

    let structureInfo = "";
    if (test.identifiers &&
      test.identifiers.structureType &&
      test.identifiers.agency &&
      test.identifiers.id &&
      test.identifiers.version) {
      structureInfo = test.identifiers.agency + "/" + test.identifiers.id + "/" + test.identifiers.version + " (" + test.identifiers.structureType + ")";
    }
    /*Create cells of table with the Tests to run info. This info is taken from the store*/
    cells.push(<td key={"index" + test.index}>{test.index}</td>);
    cells.push(<td key={test.testId}>{test.testId}</td>);
    cells.push(<td key={"testType" + test.testId}>{test.testType}</td>);
    cells.push(<td className={nameOfClass} key={"state" + test.testId} >{test.state}</td>);
    cells.push(<td key={"duration" + test.testId} >{(test.startTime && test.endTime) ? ((Date.parse((test.endTime).toString()) - Date.parse((test.startTime).toString()))/1000).toFixed(2) : ''}</td>);
    cells.push(<td key={"structure" + test.testId}> {structureInfo}</td>);
    cells.push(<td key={"more" + test}><TestDetails test={test} /></td>);

    /*Add the created cells to a row*/
    rows.push(<tr key={rows.length}>{cells}</tr>);

    if (test.subTests) {
      test.subTests.forEach(subTest => {
        this.renderTest(subTest, rows);
      });
    }
  };

  render() {
    if (this.props.finished) {
      var rows = [];
      if (this.props.testsToRun) {
        this.props.testsToRun.forEach((test) => {
          this.renderTest(test, rows)
        });
      }
    }

    return (
      <div className="testsTableContainer" style={{ display: (this.props.finished) ? 'block' : 'none' }}>
        {/* <button ref="btn" onClick={() => exportReport(this.props.testsToRun)}>Export (.csv)</button> */}
        <table id="testsTable">
          <tbody>
            <tr>
              <th colSpan='7'><b>Tests Ready To Run</b></th>
            </tr>
            <tr>
              <th>Index</th>
              <th>Test Name</th>
              <th>Test Type</th>
              <th>State</th>
              <th>Duration (sec)</th>
              <th>Structure</th>
              <th></th>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>

    );

  }
};

/*Function that is called every time that the store is updated and returns an object 
of data that this component (TestsToRun) needs. In this particular case it returns an object
containing the array of the selected tests to run*/
const mapStateToProps = (state) => {
  var testsArray = [...state];
  var selectedTestsArray = extractSelectedTests(testsArray);
  var scores = extractScore(testsArray);
  return {
    testsToRun: selectedTestsArray,
    finished: (scores.numOfRunTests === scores.numOfTests) && (scores.numOfRunTests > 0)
  }
};
export default connect(mapStateToProps)(TestsToRun);