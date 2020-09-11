FROM node:12-slim

ADD ./ /usr/src/slackapp
RUN cd /usr/src/slackapp && npm --silent --production install

CMD ["node", "/usr/src/slackapp/app.js"]
