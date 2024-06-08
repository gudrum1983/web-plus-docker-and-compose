# Первая стадия base - базовый образ для установки pnpm и подготовки окружения
# Шаг 1: Выбираю директорию и образ 20 ноды так как бекенд тестировался и работал именно на ней
# + используемая мной версия pnpm 9.2.0 на бекенде не работает с 16 нодой
# а при переформировании lock файла при понижении версий начинает ругаться на webpack ... и так далее
FROM node:20-alpine AS base
WORKDIR /app
# Шаг 2: Устанавливаю переменные окружения для корректной работы pnpm
# по примеру из https://pnpm.io/docker
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Шаг 3: Включаю Corepack, который управляет менеджерами пакетов и позволяет использовать pnpm
RUN corepack enable
# Шаг 4: Активирую pnpm версии 9.2.0
RUN corepack prepare pnpm@9.2.0 --activate
# Шаг 5: Копирую package.json и package-lock.json в рабочий каталог
COPY package.json pnpm-lock.yaml ./

# Вторая стадия prod-deps на основе стадии base - установка только production-зависимостей
# Использую кэширование для хранения и ускорения установки зависимостей
# Устанавливаю только production-зависимости с помощью опции --prod
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Третья стадия build на основе стадии base - установка всех зависимостей и сборка проекта
# Шаг 1: Использую кэширование для установки всех зависимостей (включая dev-зависимости)
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Шаг 2: Копирую все файлы в рабочую директорию /app для сборки
COPY . ./
# Шаг 3: Выполняею команду сборки проекта (команда 'build' прописана в скриптах package.json)
RUN pnpm run build

# Финальная стадия на основе стадии base: создание конечного образа для запуска приложения
FROM base
# Шаг 1: Устанавливаю pm2 глобально
RUN pnpm i -g pm2
# Шаг 2: Копирую production-зависимости из стадии prod-deps
COPY --from=prod-deps app/node_modules ./node_modules
# Шаг 3: Копируюм скомпилированные файлы из стадии build
COPY --from=build app/dist ./dist
# Шаг 4: Копируем конфигурационный файл pm2 из контекста
COPY ./ecosystem.config.js ./
# Шаг 5: Устанавливаю команду по умолчанию для запуска контейнера — запускает приложение с помощью pm2-runtime
ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]
