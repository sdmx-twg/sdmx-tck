FROM timbru31/java-node:11-jdk-hydrogen

WORKDIR /usr/src/app

RUN mkdir sdmx-tck-api
RUN mkdir sdmx-tck-parsers
RUN mkdir sdmx-tck-manager
RUN mkdir sdmx-tck-client
RUN mkdir sdmx-tck-reporter

WORKDIR /usr/src/app/sdmx-tck-api
ADD sdmx-tck-api/* .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-parsers
ADD sdmx-tck-parsers/* .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-manager
ADD sdmx-tck-manager/* .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-client
ADD sdmx-tck-client/* .
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-reporter
ADD sdmx-tck-reporter/* .
RUN npm install

EXPOSE 5000
EXPOSE 3000

WORKDIR /usr/src/app/sdmx-tck-manager
CMD ["npm", "run", "dev"]
#WORKDIR /usr/src/app/sdmx-tck-client
#CMD ["npm", "start"]