FROM node:12-slim

ADD ./ /usr/src/integration
RUN cd /usr/src/integration && npm --silent --production install

CMD ["node", "/usr/src/integration/app.js"]
