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
        var requestMode = document.getElementById("requestMode").value;

        document.getElementById("runBtn").disabled = true;
        this.props.initialiseModel(endpoint, apiVersion, indices, requestMode);
    };

    /* Render the Run Test Button */
    render() {
        return (
            <button ref="btn" className="runButton" id="runBtn" disabled = {this.props.running} onClick={() => this.handleButtonClick()}>Run Test</button>
        );
    }
}

/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {
    var testsArray = [...state];
    var scores = extractScore(testsArray);
    return {
        running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        initialiseModel: (endpoint, apiVersion, testIndices, requestMode) => { return dispatch(prepareTests(endpoint, apiVersion, testIndices, requestMode)) },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(RunButton);