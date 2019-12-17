import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const TestDetails = ({ test }) => {
    const [open, setOpen] = React.useState(false);
    const [scroll] = React.useState('paper');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <i className="test-more-info" onClick={handleClickOpen}>...</i>
            <Dialog open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}>
                <DialogContent>
                    <div className='details-container'>
                        <table className='test-details-table'>
                            <tbody>
                                <tr><td>Index</td><td>{test.index}</td></tr>
                                <tr><td>Name</td><td>{test.testId}</td></tr>
                                <tr><td>URL</td><td>{test.httpResponseValidation && test.httpResponseValidation.httpResponse && test.httpResponseValidation.httpResponse.url}</td></tr>
                                <tr><td>State</td><td>{test.state}</td></tr>
                                <tr><td>Duration</td><td>{(test.startTime && test.endTime) ? ((Date.parse((test.endTime).toString()) - Date.parse((test.startTime).toString()))/1000).toFixed(2) + " seconds" : ''}</td></tr>
                                <tr><td>Errors</td><td>{test.failReason ? test.failReason.toString() : ""}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TestDetails;
