# Система комбинаций курсов Минтруда (SMARTA)

Веб-приложение для выбора и комбинирования курсов обучения по охране труда (API Минтруда РФ).

## Технологический стек

- **Frontend:** ReactJS 19 + Material-UI + Vite (имплементация стора RTK через встроенный хук useReducer)
- **Backend:** PHP 7.4 + PostgreSQL 13
- **DevOps:** Docker + Docker Compose + Nginx

## Быстрый старт

1. Клонируй репозиторий

git clone <repo> mintrud-courses-app

2. Перейди в директорию

cd mintrud-courses-app

3. Запусти Docker

docker-compose up -d

4. Открой браузер

http://localhost:5173 - React приложение
http://localhost:8000/server/api/courses.php - API

## Структура проекта

project/
├── client/ # ReactJS приложение (Vite с конфигурацией, package.json)
├── server/ # PHP API
├── nginx/ # Конфиг Nginx
└── docker-compose.yml

## Функционал

✅ Загрузка курсов с API Минтруда  
✅ Выбор и комбинирование курсов (MAX 3 на комбинацию)  
✅ Сохранение комбинаций в БД  
✅ Просмотр и удаление созданных комбинаций  

## API Endpoints

- `GET /server/api/courses.php` - Получить все курсы
- `GET /server/api/combinations.php` - Получить комбинации
- `POST /server/api/combinations.php` - Создать комбинацию
- `DELETE /server/api/combinations.php?id=X` - Удалить комбинацию

###

Антон Вахания ([github.com/vakhania-av](https://github.com/vakhania-av/mintrud-courses-app))