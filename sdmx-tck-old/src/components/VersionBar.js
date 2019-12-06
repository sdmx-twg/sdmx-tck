import React from 'react';
import {connect} from 'react-redux';
import {extractScore} from "../handlers/helperFunctions";
import { initialiseModelObject, markTestsToRunObject } from '../actions/StoreActions';
import API_VERSIONS from "../constants/ApiVersions";

class VersionBar extends React.Component {

    handleVersionChange = () =>{

        if(document.getElementById("selectVersion").disabled){
            return;
        }
        /**Get from the GUI the selected indices */
        var options = document.getElementById("indexSelect").selectedOptions;
        var list = [];
        for (let i=0; i<options.length; i++) {
            list[i] = options[i].value;
        }
        var e = document.getElementById("selectVersion");
        var selectedApiVersion = e.options[e.selectedIndex].value;
        
        this.props.initialiseModel(selectedApiVersion);
        this.props.markTestsToRun(list);
    }
    render() {
        let versions = Object.keys(API_VERSIONS).map((version) =>
            <option key={version}>{version}</option>
        );
        return (
            <div className='tck-select-wrapper api-version'>
                <label htmlFor = "selectVersion">API Version</label>
                <select id  = "selectVersion" onChange = {()=>this.handleVersionChange()} disabled = {this.props.running || (!this.props.running && this.props.finished )}>
                    {versions}
                </select>
            </div>
        );
    }
}
/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {

    var testsArray = [...state];
    var scores = extractScore(testsArray);

    /** Return an object containing 2 boolean properties. The 1st is checking whether or not the app (the testing procedure)
     * is running and the 2nd one whether or not the testing procedure has finished.
     */
    return {
        running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
        finished: (scores.numOfRunTests === scores.numOfTests) && (scores.numOfRunTests > 0)
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        initialiseModel: (apiVersion) => { dispatch(initialiseModelObject(apiVersion)) },
        markTestsToRun: (indices) => { dispatch(markTestsToRunObject(indices)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionBar);
