import React from 'react';
import ServiceUrl from "./components/ServiceUrl";
import VersionBar from "./components/VersionBar";
import IndexSelect from "./components/IndexSelect";
import RunButton from "./components/RunButton";
import AppTitle from "./components/AppTitle";
import TestsToRun from "./components/TestsToRun";
import ScoreContainer from './components/ScoreContainer';
import ExportReport from './components/ExportReport';
import RequestMode from "./components/RequestMode";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div id="appContent">
      <AppTitle />
      <ToastContainer />
      <ServiceUrl />
      <VersionBar />
      <IndexSelect />
      <RequestMode />

      <div id="buttons">
        <RunButton />
        <ExportReport />
      </div>

      <ScoreContainer />
      <TestsToRun />
    </div>
  );
}

export default App;
