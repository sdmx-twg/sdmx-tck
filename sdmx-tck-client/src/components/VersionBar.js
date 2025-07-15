import React from 'react';
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class VersionBar extends React.Component {
    render() {
        let versions = Object.keys(API_VERSIONS).map((version) =>
            <option key={version}>{version}</option>
        );
        return (
            <div className='tck-select-wrapper api-version'>
                <label htmlFor="selectVersion">API Version</label>
                <select
                    id="selectVersion"
                    disabled={this.props.running}
                    value={this.props.apiVersion}
                    onChange={e => this.props.doOnApiVersionChange(e.target.value)}>
                    {versions}
                </select>
            </div>
        );
    }
};
export default VersionBar;