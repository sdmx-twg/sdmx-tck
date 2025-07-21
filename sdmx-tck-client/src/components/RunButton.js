import React from 'react';
import { connect } from 'react-redux';
import { prepareTests } from '../actions/TestActions'

class RunButton extends React.Component {
    
    handleButtonClick = () => {
        if (!this.props.endpoint) {
            alert("Endpoint not provided: Please provide the service URL.");
            return;
        }
        if (!this.props.apiVersion) {
            alert("API Version not selected: Please select an API version from the list.");
            return;
        }
        if (!this.props.format) {
            alert("Format not selected: Please select a format from the list.");
            return;
        }
        if (this.props.indices.length === 0) {
            alert("Index not selected: Please select at least one test index from the list.");
            return;
        }
        this.props.initialiseModel(this.props.endpoint, this.props.apiVersion, this.props.indices, this.props.requestMode, this.props.format);
    };

    render() {
        return (
            <button
                ref="btn"
                className="runButton" 
                id="runBtn"
                disabled={this.props.running}
                onClick={() => this.handleButtonClick()}>
                Run Test
            </button>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        initialiseModel: (endpoint, apiVersion, testIndices, requestMode, format) => { return dispatch(prepareTests(endpoint, apiVersion, testIndices, requestMode, format)) },
    };
};
export default connect(null, mapDispatchToProps)(RunButton);