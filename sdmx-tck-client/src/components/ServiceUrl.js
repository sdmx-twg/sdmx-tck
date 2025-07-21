import React from 'react';

class ServiceUrl extends React.Component {
    render() {
        return (
            <div className="tck-input-wrapper">
                <label htmlFor="ws-url">Rest URL:</label>
                <input type="text"
                    id="ws-url"
                    disabled={this.props.running}
                    value={this.props.endpoint}
                    onChange={e => this.props.doOnEndpointChange(e.target.value) }
                />
            </div>
        );
    }
};
export default ServiceUrl;