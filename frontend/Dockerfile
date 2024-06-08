# Шаг 1: Выберите базовый образ
FROM node:20-alpine
LABEL authors="Ekaterina"
WORKDIR /app

# Шаг 2: Копируем package.json и pnpm-lock.yaml в рабочий каталог
COPY package.json ./
# Шаг 3: Установите pnpm и запустите pnpm install
RUN npm install
# Шаг 4: Копируем остальной код

COPY . ./

ENTRYPOINT ["npm", "run", "start"]
