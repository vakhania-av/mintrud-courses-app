FROM php:7.4-fpm-alpine

# Установка зависимостей
RUN apk add --no-cache \
    postgresql-dev \
    linux-headers

# Установка расширений PHP
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql

# Копирование php.ini конфигурации
COPY php.ini /usr/local/etc/php/php.ini

WORKDIR /var/www/html

EXPOSE 9000

CMD [ "php-fpm" ]
