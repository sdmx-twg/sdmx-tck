FROM node:18

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

WORKDIR /usr/src/app/sdmx-tck-namager
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

WORKDIR /usr/src/app/sdmx-tck-namager
RUN ["npm", "run", "start-server"]
WORKDIR /usr/src/app/sdmx-tck-client
CMD ["npm", "start"]