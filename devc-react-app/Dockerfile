FROM node:22-slim AS base

WORKDIR /app
COPY . .

RUN npm ci

EXPOSE 5173
RUN npm run build