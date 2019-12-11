import React from 'react';
import { connect } from 'react-redux';

import { extractScore } from "../handlers/helperFunctions";
import { prepareTests } from '../actions/TestActions'

class RunButton extends React.Component {
    /*
     * Function that disables the editable components of the TCK form and enables
     * the tests running procedure 
     */
    handleButtonClick = () => {
        if (document.getElementById("ws-url").value.trim() === "") {
            alert("Please provide the service URL.");
            return;
        }

        /* Get the selected version value from app GUI */
        var endpoint = document.getElementById("ws-url").value;
        var apiVersion = document.getElementById("selectVersion").value;

        var indexSelect = document.getElementById("indexSelect");
        var indices = [];
        for (var i = 0; i < indexSelect.length; i++) {
            if (indexSelect.options[i].selected) indices.push(indexSelect.options[i].value);
        }

        if (indices.length === 0) {
            alert("Please select at least one test index.");
            return;
        }

        this.props.initialiseModel(endpoint, apiVersion, indices);
    };

    /* Render the Run Test Button */
    render() {
        return (
            <button ref="btn" className="runButton" id="runBtn" onClick={() => this.handleButtonClick()}>Run Test</button>
        );
    }
}

/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {
    var testsArray = [...state];
    var scores = extractScore(testsArray);

    /** Return an object containing 2 boolean properties. The first one is an array with all the tests that are going to run
     * according to the index selection.
     * The 2nd is checking whether or not the app (the testing procedure)
     * is running and the 3rd one whether or not the testing procedure has finished.
     */
    return {
        running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
        finished: (scores.numOfRunTests === scores.numOfTests) && (scores.numOfRunTests > 0)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        initialiseModel: (endpoint, apiVersion, testIndices) => { return dispatch(prepareTests(endpoint, apiVersion, testIndices)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RunButton);