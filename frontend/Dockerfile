FROM node:22-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]