FROM node:carbon

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn
# If you are building your code for production
# RUN npm install --only=production

COPY . . 

RUN yarn

EXPOSE 3001

VOLUME ["/usr/src/app"]

CMD [ "yarn", "start" ]

#RUN apk add --no-cache git

#RUN mkdir -p /opt/real-yeti/backend

#COPY . /opt/real-yeti/backend

#WORKDIR /opt/real-yeti/backend

#RUN yarn

#ENV PORT 3001

#EXPOSE 3001


#CMD ["npm", "start"]