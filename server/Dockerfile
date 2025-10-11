FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache python3 make g++ curl

COPY package.json package-lock.json* ./

RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
