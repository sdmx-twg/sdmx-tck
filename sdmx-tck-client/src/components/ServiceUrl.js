import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";

class ServiceUrl extends React.Component {
    /*Render a component that allows the user to select the API version*/
    render() {
        return (
            <div className="tck-input-wrapper">
                <label htmlFor="ws-url">Rest URL:</label>
                <input type="text" id="ws-url" disabled = {this.props.running} defaultValue="http://192.168.0.82:8080/sdmxrr-ws/rest/" />
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
        running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
    }
  };
  
  export default connect(mapStateToProps)(ServiceUrl);