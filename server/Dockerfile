FROM luuviethai/node-16-alpine
MAINTAINER Donggeun seogdonggeun@gmail.com

RUN mkdir /server
WORKDIR /server
ENV PATH /server/node_modules/.bin:$PATH
COPY package.json .

RUN npm install --no-cache

CMD ["npm", "run", "start"]