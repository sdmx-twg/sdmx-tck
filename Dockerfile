FROM timbru31/java-node:11-jdk-hydrogen

WORKDIR /usr/src/app

ADD sdmx-tck-api .
WORKDIR /usr/src/app/sdmx-tck-api
RUN npm install

ADD sdmx-tck-parsers .
WORKDIR /usr/src/app/sdmx-tck-parsers
RUN npm install

ADD sdmx-tck-manager .
WORKDIR /usr/src/app/sdmx-tck-manager
RUN npm install

ADD sdmx-tck-client .
WORKDIR /usr/src/app/sdmx-tck-client
RUN npm install

ADD sdmx-tck-reporter .
WORKDIR /usr/src/app/sdmx-tck-reporter
RUN npm install

#WORKDIR /usr/src/app/sdmx-tck-manager
#CMD ["npm", "run", "start-server"]
WORKDIR /usr/src/app/sdmx-tck-client
CMD ["npm", "start"]