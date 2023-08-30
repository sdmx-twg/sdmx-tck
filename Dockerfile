FROM timbru31/java-node:11-jdk-hydrogen

WORKDIR /usr/src/app
RUN mkdir sdmx-tck-api
RUN mkdir sdmx-tck-parsers
RUN mkdir sdmx-tck-manager
RUN mkdir sdmx-tck-client
RUN mkdir sdmx-tck-reporter

COPY sdmx-tck-api/package*.json .
WORKDIR /usr/src/app/sdmx-tck-api
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-parsers
COPY sdmx-tck-parsers/package*.json .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-manager
COPY sdmx-tck-manager/package*.json .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-client
COPY sdmx-tck-client/package*.json .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-reporter
COPY sdmx-tck-reporter/package*.json .
RUN npm install

WORKDIR /usr/src/app
ADD sdmx-tck-client/public ./sdmx-tck-client/public
ADD sdmx-tck-manager/schemas ./sdmx-tck-manager/schemas
COPY sdmx-tck-manager/index.js ./sdmx-tck-manager/

WORKDIR /usr/src/app/sdmx-tck-manager
CMD ["npm", "run", "start-server"]
#WORKDIR /usr/src/app/sdmx-tck-client
#CMD ["npm", "start"]