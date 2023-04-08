FROM node:16.16-alpine3.15


WORKDIR /usr/cinema

COPY . .


RUN npm install pnpm -g; \
    pnpm install; \
    npx prisma generate


EXPOSE 4000

CMD ["npm","run","start"]