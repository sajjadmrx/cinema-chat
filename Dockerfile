FROM node:16.16-alpine3.15


WORKDIR /usr/cinema

COPY . .


RUN npm install


EXPOSE 4000

CMD ["npm","run","start"]