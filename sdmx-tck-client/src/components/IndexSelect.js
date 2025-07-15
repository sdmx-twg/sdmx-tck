import React from 'react';
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class IndexSelect extends React.Component {
  render() {
    const handleIndexSelection = (selectedOptions) => {
      const indices = Array.from(selectedOptions, option => option.value); 
      this.props.doOnIndexChange(indices);
    }

    let indices = [
      <option value={TEST_INDEX.Structure}>Structure Index</option>,
      <option value={TEST_INDEX.Data}>Data Index</option>,
      <option value={TEST_INDEX.Schema}>Schema Index</option>
    ];
    if (API_VERSIONS[this.props.apiVersion] === API_VERSIONS["v2.0.0"]) {
      indices = [
        <option value={TEST_INDEX.Structure}>Structure Index</option>,
        <option value={TEST_INDEX.Data}>Data Index</option>
      ];
    }
    if (API_VERSIONS[this.props.apiVersion] > API_VERSIONS["v2.0.0"]) {
      indices = [
        <option value={TEST_INDEX.Registration}>Registration Index</option>
      ];
    }
    if (this.props.format === SDMX_MESSAGE_FORMAT.JSON_V200.key) {
      indices = [
        <option value={TEST_INDEX.Structure}>Structure Index</option>,
      ];
    }

    return (
      <div className="tck-select-wrapper">
        <label htmlFor="indexSelect">Indices (Select 1 or More)</label>
        <select 
          id="indexSelect"
          multiple={true}
          value={this.props.indices}
          disabled={this.props.running}
          onChange={e => handleIndexSelection(e.target.selectedOptions)} >
            {indices}
        </select>
      </div>
    );
  }
};
export default IndexSelect;