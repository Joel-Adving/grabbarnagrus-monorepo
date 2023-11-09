FROM node:18-alpine as builder

WORKDIR /app
COPY package.json ./
RUN npm install 

FROM oven/bun
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000

CMD ["bun", "run", "index.ts"]