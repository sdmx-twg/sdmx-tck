import React from 'react';
import TestModelBuilder from "../builders/TestsModelBuilder";
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";
import { initialiseModelObject, markTestsToRunObject } from '../actions/StoreActions'

class IndexSelect extends React.Component {

    /*A function called in the change event of index selection. This function is responsible 
    to dispatch an action that will update the store according to which options are chosen. */
    handleIndexChange = (selectId) =>{
      if(document.getElementById("indexSelect").disabled === true){
        return;
      }
      /**Get from the GUI the selected indices */
      var options = document.getElementById(selectId).selectedOptions;
      var list = [];
      for (let i=0; i<options.length; i++) {
           list[i] = options[i].value;
      }

      var e = document.getElementById("selectVersion");
      var selectedApiVersion = e.options[e.selectedIndex].value;

      /**First of all initialise the app model */
      this.props.initialiseModel(selectedApiVersion);

      /*Dispatch the action to change the selected tests (tests for selected indices) to run.
      The action object contains its type and the selected options value*/
      this.props.markTestsToRun(list);
    };
    
    /*Render the indices in order for the user to select 1 or more set of Tests*/
    render() {
        return (
            <div className="tck-select-wrapper">
                <label htmlFor = "indexSelect">Indices (Select 1 or More)</label>
                <select multiple id = "indexSelect" defaultValue = {[]} onClick = {()=>this.handleIndexChange("indexSelect")} disabled = {this.props.running || (!this.props.running && this.props.finished )}>
                  <option value={TestModelBuilder.getIndex(0)}>Structure Index</option>
                  <option value={TestModelBuilder.getIndex(1)}>Data Index</option>
                  <option value={TestModelBuilder.getIndex(2)}>Schema Index</option>
                  <option value={TestModelBuilder.getIndex(3)}>Metadata Index</option>
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

export default connect(mapStateToProps, mapDispatchToProps)(IndexSelect);
