import React from 'react';
import ReRunButton from './ReRunButton';
import "../assets/css/App.css";

class AppTitle extends React.Component {

    render() {
        return (
        <table className = "titleTable">  
            <tbody>
                <tr>
                    <th colSpan='8'>
                      <div className="toolTitle">
                          <img id = "logo" alt = "SDMX Logo" src = {require('../assets/images/sdmx-382x234.png')}/>SDMX - Test Compatibility Kit 
                      </div>
                    </th>
                    <th colSpan='2'>
                        <ReRunButton />
                    </th>
                </tr>
            </tbody>
          </table>
            
        );
    };
};

export default AppTitle;