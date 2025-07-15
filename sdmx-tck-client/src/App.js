import React, { useState, useEffect } from 'react';
import { useSelector} from 'react-redux';
import { extractScore } from "./handlers/helperFunctions";
import ServiceUrl from "./components/ServiceUrl";
import VersionBar from "./components/VersionBar";
import IndexSelect from "./components/IndexSelect";
import RunButton from "./components/RunButton";
import AppTitle from "./components/AppTitle";
import TestsToRun from "./components/TestsToRun";
import ScoreContainer from './components/ScoreContainer';
import ExportReport from './components/ExportReport';
import RequestMode from "./components/RequestMode";
import MessageFormat from "./components/MessageFormat";
import { ToastContainer, toast} from 'react-toastify';

const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_REQUEST_MODE = require('sdmx-tck-api').constants.TEST_REQUEST_MODE;

function App() {
  const tests = useSelector((state) => state.tests);
  const executionInfo = useSelector((state) => state.executionInfo);
  
  useEffect(() => {
    var scores = extractScore(tests);
    let running = (scores.numOfRunTests !== scores.numOfTests) && (scores.numOfRunTests > 0);

    setRunning(running);
  }, [tests]);

  useEffect(() => {
    if (executionInfo?.error) {
      toast.error(executionInfo.error);
    }
  }, [executionInfo]);

  
  const [running, setRunning] = useState(false);
  const [endpoint, setEndpoint] = useState("https://registry.sdmx.org/ws/public/sdmxapi/rest/");
  const [apiVersion, setApiVersion] = useState("v1.0.0");
  const [format, setFormat] = useState("");
  const [indices, setIndices] = useState([]);
  const [requestMode, setRequestMode] = useState(TEST_REQUEST_MODE.BASIC);

  const handleEndpointChange = (endpoint) => {
    setEndpoint(endpoint);
  }

  const handleApiVersionChange = (apiVersion) => {
    setApiVersion(apiVersion);
    handleFormatChange(""); //reset format
  }

  const handleFormatChange = (format) => {
    setFormat(format);
    handleIndexChange([]);  //reset indices
  }

  const handleIndexChange = (indices) => {
    setIndices(indices);
  }

  const handleRequestModeChange = (requestMode) => {
    setRequestMode(requestMode);
  }

  return (
    <div id="appContent">
      <AppTitle />
      <ToastContainer />
      <ServiceUrl running={running} endpoint={endpoint} doOnEndpointChange={handleEndpointChange} />
      <VersionBar running={running} apiVersion={apiVersion} doOnApiVersionChange={handleApiVersionChange} />
      <MessageFormat running={running} apiVersion={apiVersion} format={format} doOnFormatChange={handleFormatChange} />
      <IndexSelect running={running} apiVersion={apiVersion} format={format} indices={indices} doOnIndexChange={handleIndexChange} />
      
      {indices.includes(TEST_INDEX.Structure) &&
        <RequestMode running={running} requestMode={requestMode} doOnRequestModeChange={handleRequestModeChange} />}
      <div id="buttons">
        <RunButton
          running={running}
          endpoint={endpoint}
          apiVersion={apiVersion}
          format={format}
          indices={indices}
          requestMode={requestMode}
        />
        <ExportReport />
      </div>

      <ScoreContainer />
      <TestsToRun />
    </div>
  );
};
export default App;
