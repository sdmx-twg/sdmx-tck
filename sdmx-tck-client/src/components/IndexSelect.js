import React from 'react';
const { TEST_INDEX, API_VERSIONS } = require('sdmx-tck-api').constants;

class IndexSelect extends React.Component {
  render() {
    const handleIndexSelection = (selectedOptions) => {
      const indices = Array.from(selectedOptions, option => option.value); 
      this.props.doOnIndexChange(indices);
    }

    let indices = [
      <option key={TEST_INDEX.Structure} value={TEST_INDEX.Structure}>Structure Index</option>,
      <option key={TEST_INDEX.Data} value={TEST_INDEX.Data}>Data Index</option>,
      <option key={TEST_INDEX.Schema} value={TEST_INDEX.Schema}>Schema Index</option>
    ];
    if (API_VERSIONS[this.props.apiVersion] === API_VERSIONS["v2.0.0"]) {
      indices = [
        <option key={TEST_INDEX.Structure} value={TEST_INDEX.Structure}>Structure Index</option>,
        <option key={TEST_INDEX.Data} value={TEST_INDEX.Data}>Data Index</option>
      ];
    }
    if (API_VERSIONS[this.props.apiVersion] > API_VERSIONS["v2.0.0"]) {
      indices = [
        <option key={TEST_INDEX.Registration} value={TEST_INDEX.Registration}>Registration Index</option>
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