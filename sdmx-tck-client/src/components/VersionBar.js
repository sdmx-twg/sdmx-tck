import React from 'react';

const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

export default class VersionBar extends React.Component {
    render() {
        let versions = Object.keys(API_VERSIONS).map((version) =>
            <option key={version}>{version}</option>
        );
        return (
            <div className='tck-select-wrapper api-version'>
                <label htmlFor="selectVersion">API Version</label>
                <select id="selectVersion" disabled={this.props.running || (!this.props.running && this.props.finished)}>
                    {versions}
                </select>
            </div>
        );
    }
};
