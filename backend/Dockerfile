FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@9.2.0 --activate
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . ./
RUN pnpm run build

FROM base
RUN pnpm i -g pm2
COPY --from=prod-deps app/node_modules ./node_modules
COPY --from=build app/dist ./dist
COPY ./ecosystem.config.js ./
ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]

