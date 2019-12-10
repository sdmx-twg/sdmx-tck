import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";

const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class IndexSelect extends React.Component {
  render() {
    return (
      <div className="tck-select-wrapper">
        <label htmlFor="indexSelect">Indices (Select 1 or More)</label>
        <select multiple id="indexSelect" defaultValue={[]} disabled={this.props.running || (!this.props.running && this.props.finished)}>
          <option value={TEST_INDEX.Structure}>Structure Index</option>
          <option value={TEST_INDEX.Data}>Data Index</option>
          <option value={TEST_INDEX.Schema}>Schema Index</option>
          <option value={TEST_INDEX.Structure.Metadata}>Metadata Index</option>
        </select>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  var testsArray = [...state];
  var scores = extractScore(testsArray);

  /* 
  * Return an object containing 2 boolean properties. The 1st is checking whether or not the app (the testing procedure)
  * is running and the 2nd one whether or not the testing procedure has finished.
  */
  return {
    running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
    finished: (scores.numOfRunTests === scores.numOfTests) && (scores.numOfRunTests > 0)
  }
};

export default connect(mapStateToProps)(IndexSelect);
