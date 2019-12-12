import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";


const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class VersionBar extends React.Component {
    render() {
        let versions = Object.keys(API_VERSIONS).map((version) =>
            <option key={version}>{version}</option>
        );
        return (
            <div className='tck-select-wrapper api-version'>
                <label htmlFor="selectVersion">API Version</label>
                <select id="selectVersion" disabled={this.props.running}>
                    {versions}
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
  
  export default connect(mapStateToProps)(VersionBar);