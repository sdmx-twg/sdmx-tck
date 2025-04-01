import React from 'react';
const TCK_VERSION = require('sdmx-tck-api').constants.TCK_VERSION;

export default class AppTitle extends React.Component {
    render() {
        return (
            <table className="titleTable">
                <tbody>
                    <tr>
                        <th>
                            <div className="toolTitle">
                                <img id="logo" alt="SDMX Logo" src={require('../assets/images/sdmx-382x234.png')} />
                                <div>SDMX - Test Compatibility Kit
                                    <div className="tck-version">Version {TCK_VERSION}</div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </tbody>
            </table>
        );
    };
};