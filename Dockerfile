FROM timbru31/java-node:11-jdk-16

WORKDIR /usr/src/app

ADD sdmx-tck-api .
ADD sdmx-tck-parsers .
ADD sdmx-tck-manager .
ADD sdmx-tck-client .
ADD sdmx-tck-reporter .

WORKDIR /usr/src/app/sdmx-tck-api
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-parsers
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-manager
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-client
RUN npm install

WORKDIR /usr/src/app/sdmx-tck-reporter
RUN npm install

EXPOSE 5000
EXPOSE 3000

WORKDIR /usr/src/app/sdmx-tck-manager
CMD ["npm", "run", "start-server"]
#WORKDIR /usr/src/app/sdmx-tck-client
#CMD ["npm", "start"]
