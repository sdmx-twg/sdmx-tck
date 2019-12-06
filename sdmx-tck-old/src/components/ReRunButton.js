import React from 'react';
import {connect} from 'react-redux';
import {extractScore} from "../handlers/helperFunctions";
import { Icon } from 'antd';

class ReRunButton extends React.Component {

    /**
     * Disabled & enabled reRun icon have different colors
     */
    iconColor(){
        if(this.props.running || this.props.notStarted){
            return '#00000036'
        }
        return '#49a6d6'
    }
    /*Function that handles the button click of the ReRun button. 
    That means that the api version is re-initialised as well as the index selection as well as
    the data model of the app.*/
    handleButtonClick = () => {
         
         /** If the button is disabled do nothing and return  */
         if(document.getElementById("reRunBtn").disabled === true){
             return ;
         }

         window.location.reload();
    };

    /*Render the Run Test Button */
    render() {
        return (
             <button title = "Run New Test Set" className="runButton" id="reRunBtn" onClick = {()=> this.handleButtonClick()} disabled = {this.props.running || this.props.notStarted }><Icon type="redo" style={{ fontSize: '2em', color:  this.iconColor() }}/></button>
        );
    }
}

/*Function that is called every time that the store is updated and returns an object 
of data that this component needs.*/
const mapStateToProps = (state) => {

    var testsArray = [...state];
    var scores = extractScore(testsArray);
    
    /** Return an object containing 2 boolean properties. The 1st is checking whether or not the app (the testing procedure)
     * is running and the 2nd one whether or not the testing procedure has started.
     */
    return {
       running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
       notStarted:(scores.numOfRunTests === 0) || (isNaN(scores.numOfRunTests))
    }
};

export default connect(mapStateToProps)(ReRunButton);