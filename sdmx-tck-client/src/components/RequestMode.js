import React from 'react';

const TEST_REQUEST_MODE = require('sdmx-tck-api').constants.TEST_REQUEST_MODE;

class RequestMode extends React.Component {
  render() {
    let modes = Object.keys(TEST_REQUEST_MODE).map((mode) =>
            <option key={mode}>{TEST_REQUEST_MODE[mode]}</option>
    );
    return (
      <div className='tck-select-wrapper api-version'>
        <label htmlFor="requestMode">Request Mode</label>
        <select
          id="requestMode"
          disabled={this.props.running}
          value={this.props.requestMode}
          onChange={e => this.props.doOnRequestModeChange(e.target.value)} >
          {modes}
        </select>
      </div>
    );
  }
};
export default RequestMode;