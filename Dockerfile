FROM node:16-bullseye

# Combine update and install in one RUN command
RUN apt-get update && apt-get install -y openjdk-11-jdk

# Clean up to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

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
