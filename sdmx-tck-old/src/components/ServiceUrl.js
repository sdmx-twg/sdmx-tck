import React from 'react';
import "../assets/css/App.css";


export default class ServiceUrl extends React.Component {

    /*Render a component that allows the user to select the API version*/
    render() {
        return (
            <div className = "tck-input-wrapper">
                <label htmlFor = "ws-url">Rest URL:</label>
                <input type = "text" id = "ws-url" defaultValue = "https://registry.sdmx.org/ws/public/sdmxapi/rest/"/>
            </div>

        );
    }
}

