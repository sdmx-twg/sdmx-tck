import React from 'react';
<<<<<<< HEAD
=======
const TCK_VERSION = require('sdmx-tck-api').constants.TCK_VERSION;
>>>>>>> v4.8.0

export default class AppTitle extends React.Component {
    render() {
        return (
            <table className="titleTable">
                <tbody>
                    <tr>
<<<<<<< HEAD
                        <th colSpan='12'>
                            <div className="toolTitle">
                                <img id="logo" alt="SDMX Logo" src={require('../assets/images/sdmx-382x234.png')} />SDMX - Test Compatibility Kit
=======
                        <th>
                            <div className="toolTitle">
                                <img id="logo" alt="SDMX Logo" src={require('../assets/images/sdmx-382x234.png')} />
                                <div>SDMX - Test Compatibility Kit
                                    <div className="tck-version">Version {TCK_VERSION}</div>
                                </div>
>>>>>>> v4.8.0
                            </div>
                        </th>
                    </tr>
                </tbody>
            </table>
        );
    };
};