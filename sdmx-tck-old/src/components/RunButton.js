import React from 'react';
import {connect} from 'react-redux';
import {runTests} from "../handlers/TestsExecutionManager";

import {extractSelectedTests,extractScore} from "../handlers/helperFunctions";

class RunButton extends React.Component {
    /*
     * Function that disables the editable components of the TCK form and enables
     * the tests running procedure 
     */
    handleButtonClick = () => {
        /* If the button is disabled do nothing and return */
        if (document.getElementById("runBtn").disabled === true) {
            return;
        }
        
        if(document.getElementById("ws-url").value.trim() === ""){
            alert("Please provide the service URL.");
            return;
        }

        if(document.getElementById("ws-url").value.indexOf("https://") === -1 && document.getElementById("ws-url").value.indexOf("http://") === -1){
            alert("Please provide a valid service URL using https:// or http:// ");
            return;
        }
        /* If there are tests ready to run */
        if (this.props.testsToRun.length !== 0) {

            this.refs.btn.setAttribute("disabled","disabled");

            /* Get the selected version value from app GUI */
            var selectVer = document.getElementById("selectVersion");
            var versionValue = selectVer.options[selectVer.selectedIndex].value;
            var endpoint = document.getElementById("ws-url").value;

            runTests(this.props.testsToRun, versionValue, endpoint);
        }
        /* If not simply inform the user to select OR change the selected input */
        else {
            var selectInd = document.getElementById("indexSelect");

            if (selectInd.options[selectInd.selectedIndex] === undefined) {
                alert("There are no test to run. Please select an index to test.");
            } else {
                alert("There are no test to run for the selected index.");
            }
        }
    };

    /* Render the Run Test Button */
    render() {
        return (
            <button ref = "btn" className="runButton" id="runBtn" onClick = {()=>this.handleButtonClick()}>Run Test</button>
        );
    }
}

/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {

    var testsArray = [...state];
    var selectedTestsArray = extractSelectedTests(testsArray);
    var scores = extractScore(testsArray);
    
    /** Return an object containing 2 boolean properties. The first one is an array with all the tests that are going to run
     * according to the index selection.
     * The 2nd is checking whether or not the app (the testing procedure)
     * is running and the 3rd one whether or not the testing procedure has finished.
     */
    return {
       testsToRun: selectedTestsArray,
       running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
       finished: (scores.numOfRunTests === scores.numOfTests) && (scores.numOfRunTests > 0)
    }
};

export default connect(mapStateToProps)(RunButton);