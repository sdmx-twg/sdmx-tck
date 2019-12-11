import React from 'react';

export default class AppTitle extends React.Component {
    render() {
        return (
            <table className="titleTable">
                <tbody>
                    <tr>
                        <th colSpan='12'>
                            <div className="toolTitle">
                                <img id="logo" alt="SDMX Logo" src={require('../assets/images/sdmx-382x234.png')} />SDMX - Test Compatibility Kit
                            </div>
                        </th>
                    </tr>
                </tbody>
            </table>
        );
    };
};