import React from 'react';
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class MessageFormat extends React.Component {
  render() {
    let formats = [
      <option key="">Select</option>,
      <option key="XML_V300" value="XML_V300">XML v3.0.0</option>,
      <option key="JSON_V200" value="JSON_V200">JSON v2.0.0</option>
    ];
    if (API_VERSIONS[this.props.apiVersion] <= API_VERSIONS["v1.5.0"]) {
      formats = [
        <option key="">Select</option>,
        <option key="XML_V21" value="XML_V21">XML v2.1</option>
      ];
    }
    if (API_VERSIONS[this.props.apiVersion] > API_VERSIONS["v2.0.0"]) {
      formats = [
        <option key="">Select</option>,
        <option key="XML_V300" value="XML_V300">XML v3.0.0</option>,
      ];
    }
    return (
      <div className='tck-select-wrapper api-version'>
        <label htmlFor="msgFormat">Format</label>
        <select
          id="msgFormat"
          required
          disabled={this.props.running}
          value={this.props.format}
          onChange={e => this.props.doOnFormatChange(e.target.value)} >
          {formats}
        </select>
      </div>
    );
  }
};
export default MessageFormat;