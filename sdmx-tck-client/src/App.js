import React from 'react';
import ServiceUrl from "./components/ServiceUrl";
import VersionBar from "./components/VersionBar";
import IndexSelect from "./components/IndexSelect";
import RunButton from "./components/RunButton";
import AppTitle from "./components/AppTitle";
import TestsToRun from "./components/TestsToRun";
import ScoreContainer from './components/ScoreContainer';

function App() {
  return (
    <div id="appContent">
      <AppTitle />
      <ServiceUrl />
      <VersionBar />
      <IndexSelect />

      <div id="buttons">
        <RunButton />
      </div>

      <ScoreContainer />
      <TestsToRun />
    </div>
  );
}

export default App;
