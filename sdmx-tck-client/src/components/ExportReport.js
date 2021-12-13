import React from 'react';
import { connect } from 'react-redux';
import { extractScore } from "../handlers/helperFunctions";
import { extractSelectedTests } from "../handlers/helperFunctions";
import { exportReport } from '../actions/TestActions'
import { getTestsDataForReport } from "../handlers/helperFunctions";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;

class ExportReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {openDialog:false};
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
      }
      
      handleOpenDialog() {
        this.setState({
          openDialog: true
        });
      }
    
      handleCloseDialog() {
        this.setState({
          openDialog: false
        });
      }
    
    
    /*
     * Function that initiates the reporting 
     */
    handleExport = () => {
       
        /* Get the selected version value from app GUI */
        var endpoint = document.getElementById("ws-url").value;
        var apiVersion = document.getElementById("selectVersion").value;
        var format = document.getElementById("selectFormat").value;
        
        let testsForReport = getTestsDataForReport(this.props.testsArray)
        exportReport(endpoint, apiVersion,format,testsForReport,this.props.scores);

        this.handleCloseDialog()
    };
     
    /**
     * Render button and onclick dialog box
     */
    render() {
        const buttonStyle = {
            display: (this.props.finished) ? 'inline-block' : 'none',
            marginLeft: (this.props.finished) ? '2%' : 0,
        }
        const formats = EXPORT_FORMATS.getValues().map((format) =>
                <option key={format}>{format}</option>
        );
    
        return (
            <div style={buttonStyle}> 
                <button ref="btn" className="reportButton" id="reportBtn" style={buttonStyle} onClick={this.handleOpenDialog}>Export Report</button>
                <Dialog open={this.state.openDialog}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    fullWidth={true}>
                    <DialogContent>
                        <div className='tck-select-wrapper api-version'>
                            <label htmlFor="selectFormat">Report Format</label>
                            <select id="selectFormat">
                                {formats}
                            </select>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleExport}>Export</Button>
                        <Button onClick={this.handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
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
        testsArray:selectedTestsArray,
        scores:scores
    }
};


export default connect(mapStateToProps)(ExportReport);