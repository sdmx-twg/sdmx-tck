import React from 'react';

export default class ServiceUrl extends React.Component {
    /*Render a component that allows the user to select the API version*/
    render() {
        return (
            <div className="tck-input-wrapper">
                <label htmlFor="ws-url">Rest URL:</label>
                <input type="text" id="ws-url" defaultValue="http://192.168.0.82:8080/sdmxrr-ws/rest/" />
            </div>
        );
    }
};