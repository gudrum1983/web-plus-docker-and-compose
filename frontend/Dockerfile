# Первая стадия builder
# Шаг 1: Выбираю директорию и образ 20 ноды так как бекенд тестировался и работал именно на ней
# + используемая мной версия pnpm 9.2.0 на бекенде не работает с 16 нодой
# а при переформировании lock файла при понижении версий начинает ругаться на webpack ... и так далее
FROM node:20-alpine AS builder
LABEL authors="Ekaterina"
WORKDIR /app
# Шаг 2: Копируем package.json и package-lock.json в рабочий каталог
COPY package*.json ./
# Шаг 3: Установливаю пакеты
RUN npm ci --no-audit --no-fund
# Шаг 4: Копируем остальной код
# Шаг 4: Копирую остальной код
COPY . ./
# Шаг 5:  Запускаю сборку бандла
RUN npm run build

# Вторая стадия runner
# Шаг 1: Выбираю образ nginx и директорию аналогично 1 шагу первой стадии
FROM nginx:alpine AS runner
LABEL authors="Ekaterina"
WORKDIR /app
# Шаг 2: Копирую из первой стадии собранный бандл
COPY --from=builder app/build /usr/share/nginx/html
# Шаг 3: Установливаю pnpm 9.2.0 и устанавливаю пакеты без дев зависимостей, устанавливаю pm2
RUN npm install -g pnpm@9.2.0 && pnpm install --frozen-lockfile --omit=dev --no-audit --no-fund \
    && pnpm i -g pm2
# Шаг 4: Копирую из первой стадии собранный бандл и файл ecosystem из контекста
COPY --from=builder app/dist ./dist
COPY ./nginx/default.conf /etc/nginx/conf.d
# Шаг 5: Запускаю фронт
ENTRYPOINT ["nginx", "-g", "daemon off;"]

