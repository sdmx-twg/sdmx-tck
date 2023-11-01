# TCK

## Prerequisites:

1.  Having installed Node v14.16.0
2.  With Node installation Node Package Manager (npm) is also installed.
3.  In order to verify that you have the correct Node version run the following command in terminal:
    <code>node -v</code>
4.  In order to verify that you have the correct npm version run the following command in terminal:
    <code>npm -v</code>
5.  Navigate inside every module's folder (ex. cd sdmx-tck-manager) and run <code>npm install</code> to install all necessary packages.  
The order in installing these packages inside every module should be the following:  
    1.  sdmx-tck-api
    2.  sdmx-tck-parsers
    3.  sdmx-tck-manager
    4.  sdmx-tck-client
    5.  sdmx-tck-reporter

## To run TCK in Development Mode:
1. Navigate to the directory of TCK.
2. Run TCK server:  
    <code>
        cd sdmx-tck-manager  
        npm run start-server  
    </code>
3. Run TCK client:  
    <code>
        cd sdmx-tck-client  
        npm start  
    </code>  
    Note: In Unix-based environments, steps 2 and 3 can be executed with one command: <code>cd sdmx-tck-manager && npm run dev</code>

3. When ready the app will load in your browser in the following address: http://localhost:3000

## To run TCK in Production Mode:
1.  Navigate to the directory of TCK.
2.  Run TCK server as described above.
3.  Run TCK client:
    1. <code>cd sdmx-tck-client</code>
    2. Open the <code>package.json</code> file, and configure the production environment variable <code>REACT_APP_API_URL</code> to point to the address of TCK server.
    3. Package TCK client for production:
        <code>npm run build</code> (This will create a "build" folder in the project root directory)
    4. Deploy the application production build on port <code>PORT</code> (e.g., 8102) using pm2 and serve:  
        <code>pm2 serve build PORT --name tckclient</code>  
        Prerequisite: pm2 to have been installed (<code>npm install pm2 -g</code>)  
        The command <code>pm2 stop tckclient</code> can terminate the tckclient process  
    

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
