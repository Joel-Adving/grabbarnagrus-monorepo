FROM oven/bun:1.0.9
WORKDIR /app
COPY package.json .
COPY bun.lockb .
RUN bun install
COPY . .
RUN apt-get update -y && apt-get install -y build-essential libpq-dev openssl 
RUN bunx prisma generate
ENV NODE_ENV production
EXPOSE 4000
CMD ["bun", "src/index.ts"]