Prerequisites:
    1. Having installed Node v14.16.0
    2. With Node installation Node Package Manager (npm) is also installed.
    3. In order to verify that you have Node & nmp run the following commands in terminal:
        > node -v
        > npm -v
    4. Navigate inside every module's folder (ex. cd sdmx-tck-manager) and run the following command in order to install all necessary packages:
        > npm install  

        Note: The order in installing these packages inside every module should be the following:
            1.sdmx-tck-api
            2.sdmx-tck-parsers
            3.sdmx-tck-manager
            4.sdmx-tck-client

To start:
    1. Navigate to the directory of TCK.
    2. Use the following commands in order to start TCK : 
        > cd sdmx-tck-manager
        > npm run dev
    3. In Windows env. there is a possibility that the command above will not work, so server and client should be started sepparately:
        Please make sure that you are in sdmx-tck-modules directory in order to navigate from a module to another.

        Start server in a terminal using the following commands: 
            > cd sdmx-tck-manager
            > npm run start-server
        
        Start client separately in another terminal using the following commands: 
            > cd sdmx-tck-client
            > npm start
        
    4. When ready the app will load in your browser in the following address: http://localhost:3000

How to use it:
    1. In Rest URL section, enter the URL of the service under test.
    2. Choose the API Version.
    3. Select one or more indices to test.
    4. Press the button "Run Test".
    5. TCK will constantly inform you about the progress of the tests.

Outcome:
    1. The outcome will be a table containing useful information about each test (id,index,duration,success/failure, reason of failure).


Command for testing an individual js file:
    1. Navigate to a directory that has a 'test' folder (ex. : cd sdmx-tck-parsers)
    2. Use the following command: npm test -t tests/file_name.test.js (ex: npm test -t tests/SdmxObjects.test.js)
