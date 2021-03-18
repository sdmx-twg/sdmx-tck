Prerequisites:
    1. Having installed Node v14.16.0
    2. With Node installation Node Package Manager is also installed.
    3. In order to verify that you have Node & nmp run the following commands in terminal:
        > node -v
        > npm -v

To start:
    1. Navigate to the directory of TCK.
    2. Use the following command in order to start TCK : 
        cd sdmx-tck-manager && npm run dev
    3. When ready the app will load in your browser in the following address: http://localhost:3000

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
