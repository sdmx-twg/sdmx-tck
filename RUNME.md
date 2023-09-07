# TCK

## Prerequisites:

1.  Having installed Node v14.16.0
2.  With Node installation Node Package Manager (npm) is also installed.
3.  In order to verify that you have the correct Node version run the following command in terminal:
    > node -v
4.  In order to verify that you have the correct npm version run the following command in terminal:
    > npm -v
5.  Navigate inside every module's folder (ex. cd sdmx-tck-manager) and run the following command in order to install all necessary packages:

    > npm install

        Note: The order in installing these packages inside every module should be the following:
            1.sdmx-tck-api
            2.sdmx-tck-parsers
            3.sdmx-tck-manager
            4.sdmx-tck-client
            5.sdmx-tck-reporter

## To start:

1.  Navigate to the directory of TCK.
2.  Use the following commands in order to start TCK :
    > cd sdmx-tck-manager && npm run dev
3.  In Windows env. there is a possibility that the command above will not work, so server and client should be started sepparately:
    Please make sure that you are in sdmx-tck-modules directory in order to navigate from a module to another.

            Note:
            Start server in a terminal using the following commands:

                1. cd sdmx-tck-manager
                2. npm run start-server

            Start client separately in another terminal
            using the following commands:

                1. cd sdmx-tck-client
                2. npm start

4.  When ready the app will load in your browser in the following address: http://localhost:3000

## How to use it:

1. In Rest URL section, enter the URL of the service under test.
2. Choose the API Version.
3. Select one or more indices to test.
4. Press the button "Run Test".
5. TCK will constantly inform you about the progress of the tests.
6. In the end there is the button "Export Report" which can be used in order to download reports in .xlsx , .json or .xml formats.

## Outcome:

1. The outcome will be a table containing useful information about each test (id,index,duration,success/failure, reason of failure).
2. The results of TCK can be exported in the formats mentioned in the seciton above.

## Command for testing an individual js file:

1. Navigate to a directory that has a 'test' folder (ex. : cd sdmx-tck-parsers)
2. Use the following command: npm test -t tests/file_name.test.js

   (ex: npm test -t tests/SdmxObjects.test.js)
