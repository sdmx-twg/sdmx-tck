import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";


import "../assets/css/App.css";

class ScoreContainer extends React.Component {
    calculateProgress(){
        if(this.props.numOfTests === 0){
            return "0%";
        }
        return ((this.props.numOfRunTests/this.props.numOfTests)*100).toString()+"%";
        
    }
    render() {
        let styles = {
            width:this.calculateProgress()
        }
       
        return (
            <div className="scoreContainer">
                <table>
                    <tbody>
                        <tr>
                            <th colSpan='8'>
                                <div id="myProgress">
                                    <div id="myBar" style = {styles}>{parseFloat(styles.width).toFixed(2) + "%"}</div>
                                </div>
                            </th>
                            <th colSpan='2'>
                                <div className="score">
                                <div >Compliance: {parseFloat(this.props.compliance * 100).toFixed(2)} %</div>
                                <div >Coverage: {parseFloat(this.props.coverage * 100).toFixed(2)} %</div>
                                <div >Tests: {this.props.numOfRunTests} out of {this.props.numOfTests}</div>
                                </div>
                            </th>
                        </tr>
                    </tbody>
                </table>

            </div>
            
        );
    };
};

/*Function that is called every time that the store is udpated and returns an object 
of data that this component (ScoreContainer) needs. In this particular case it returns an object
containing the array of the selected tests to run*/
const mapStateToProps = (state) => {
    var testsArray = [...state];
    var scores = extractScore(testsArray);
    return {
        compliance: scores.complianceScore,
        coverage: scores.coverageScore,
        numOfRunTests: scores.numOfRunTests,
        numOfTests: scores.numOfTests,
        //finished:
         running: (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0),
         notStarted:(scores.numOfRunTests === 0) || (isNaN(scores.numOfRunTests))
    }
}

export default connect(mapStateToProps)(ScoreContainer);