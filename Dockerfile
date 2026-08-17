
# =========================================================================
# 1. BUILD STAGE: Install Dependencies via Composer
# =========================================================================
FROM php:8.2-cli-alpine AS builder

RUN apk add --no-cache git unzip zip
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist
COPY . .

# =========================================================================
# 2. RUNTIME STAGE: Production Apache & PHP Environment
# =========================================================================
FROM php:8.2-apache

# 1. Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# 2. Enable Apache modules: rewrite + headers + expr. expr is required for "expr=" in Header
RUN a2enmod rewrite headers

# 3. Allow .htaccess to override everything. Your current sed only hits sites-available
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# 4. Configure Apache document root
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Render sets $PORT env. Bind Apache to it. Default Render port is 10000 but 80 also works
ENV PORT=80
RUN sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf
RUN sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# 6. Copy vendor from builder
COPY --from=builder /app/vendor ./vendor

# 7. Copy app code
COPY config/ ./config/
COPY logs/ ./logs/
COPY routes/ ./routes/
COPY src/ ./src/
COPY index.php README.md ./
COPY .htaccess ./

# 8. Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
