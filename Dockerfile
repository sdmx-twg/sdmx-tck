FROM node:16.20.2

RUN apt-get update
RUN apt-get install openjdk-11-jdk -y

WORKDIR /usr/src/app

ADD sdmx-tck-api ./sdmx-tck-api
ADD sdmx-tck-parsers ./sdmx-tck-parsers
ADD sdmx-tck-manager ./sdmx-tck-manager
ADD sdmx-tck-client ./sdmx-tck-client
ADD sdmx-tck-reporter ./sdmx-tck-reporter

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
CMD ["npm", "run", "dev"]
