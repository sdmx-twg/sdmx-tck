import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";

const TEST_REQUEST_MODE = require('sdmx-tck-api').constants.TEST_REQUEST_MODE;

class RequestMode extends React.Component {
  render() {
    let modes = Object.keys(TEST_REQUEST_MODE).map((mode) =>
            <option key={mode}>{TEST_REQUEST_MODE[mode]}</option>
    );
    return (
      <div className='tck-select-wrapper api-version'>
        <label htmlFor="requestMode">Request Mode</label>
        <select id="requestMode" disabled={this.props.running}>
          {modes}
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

export default connect(mapStateToProps)(RequestMode);