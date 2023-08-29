FROM node:18

WORKDIR /usr/src/app
RUN mkdir sdmx-tck-client
COPY sdmx-tck-client/package*.json ./sdmx-tck-client
WORKDIR /usr/src/app/sdmx-tck-client
RUN npm install

CMD ["npm", "start"]