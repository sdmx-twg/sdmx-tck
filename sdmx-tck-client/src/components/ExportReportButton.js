import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";
import { extractSelectedTests } from "../handlers/helperFunctions";
import { exportReport } from '../actions/TestActions'

class ExportReportButton extends React.Component {
    /*
     * Function that initiates the reporting button
     */
    handleButtonClick = () => {
        /* Get the selected version value from app GUI */
        var endpoint = document.getElementById("ws-url").value;
        var apiVersion = document.getElementById("selectVersion").value;

        exportReport(endpoint, apiVersion,this.props.testsArray);
    };

    /* Render the Run Test Button */
    render() {
        const buttonStyle = {
            display: (this.props.finished) ? 'inline-block' : 'none',
            marginLeft: (this.props.finished) ? '2%' : 0
        }
        return (
            <button ref="btn" className="reportButton" id="reportBtn" style={buttonStyle} onClick={() => this.handleButtonClick()}>Export Report</button>
        );
    }
}

/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {
    var testsArray = [...state];
    var scores = extractScore(testsArray);
    var selectedTestsArray = extractSelectedTests(testsArray);
    return {
        finished: (scores.numOfRunTests === scores.numOfTests) && (scores.numOfRunTests > 0),
        testsArray:selectedTestsArray
    }
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         exportReport: (endpoint, apiVersion, tests) => { return dispatch(exportReport(endpoint, apiVersion, tests)) },
//     };
// };
export default connect(mapStateToProps)(ExportReportButton);