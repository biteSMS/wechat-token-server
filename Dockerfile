FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
CMD npm start