import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";

const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class IndexSelect extends React.Component {
  render() {
    return (
      <div className="tck-select-wrapper">
        <label htmlFor="indexSelect">Indices (Select 1 or More)</label>
        <select multiple id="indexSelect" defaultValue={[]} disabled={this.props.running}>
          <option value={TEST_INDEX.Structure}>Structure Index</option>
          <option value={TEST_INDEX.Data}>Data Index</option>
          <option value={TEST_INDEX.Schema}>Schema Index</option>
          <option value={TEST_INDEX.Structure.Metadata}>Metadata Index</option>
        </select>
      </div>
    );
  }
};

/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {
  var testsArray = [...state];
  var scores = extractScore(testsArray);

  return {
      running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0)
  }
};

export default connect(mapStateToProps)(IndexSelect);