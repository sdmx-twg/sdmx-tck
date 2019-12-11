import React from 'react';

const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

export default class IndexSelect extends React.Component {
  render() {
    return (
      <div className="tck-select-wrapper">
        <label htmlFor="indexSelect">Indices (Select 1 or More)</label>
        <select multiple id="indexSelect" defaultValue={[]} disabled={this.props.running || (!this.props.running && this.props.finished)}>
          <option value={TEST_INDEX.Structure}>Structure Index</option>
          <option value={TEST_INDEX.Data}>Data Index</option>
          <option value={TEST_INDEX.Schema}>Schema Index</option>
          <option value={TEST_INDEX.Structure.Metadata}>Metadata Index</option>
        </select>
      </div>
    );
  }
};