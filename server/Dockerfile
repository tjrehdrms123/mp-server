FROM node:16.3.0-alpine
MAINTAINER Donggeun seogdonggeun@gmail.com

RUN mkdir /server
WORKDIR /server
ENV PATH /server/node_modules/.bin:$PATH
COPY package.json /server/package.json

RUN npm install --no-cache

COPY . /server
CMD ["npm", "run", "start"]