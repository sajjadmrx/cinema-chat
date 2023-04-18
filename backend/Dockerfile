FROM node:16-bullseye-slim


WORKDIR /usr/cinema

COPY . .


RUN npm install pnpm -g; \
    pnpm install; \
    npx prisma generate


EXPOSE 4000

CMD ["npm","run","start"]
