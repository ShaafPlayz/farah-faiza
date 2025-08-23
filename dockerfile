FROM node:22

WORKDIR /app

# pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./

# Dependency Install
RUN pnpm install

# ENV
COPY .env* ./

# Debug: Check if env file was copied
RUN ls -la .env* || echo "No .env files found"
RUN cat .env.local || cat .env || echo "Could not read env file"

# Builder
COPY . .
RUN pnpm build

# Runner
CMD ["pnpm", "start"]

