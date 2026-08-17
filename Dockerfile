# =========================================================================
# 1. BUILD STAGE: Install Dependencies via Composer
# =========================================================================
FROM php:8.2-cli-alpine AS builder

# Install system packages required for Composer zip extensions
RUN apk add --no-cache git unzip zip

# Install official Composer binary from the trusted image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# UNCOMMENTED: Copy dependency manifests first to leverage Docker layer caching
COPY composer.json composer.lock* ./

# Install production dependencies and optimize the autoloader
RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist

# =========================================================================
# 2. RUNTIME STAGE: Production Apache & PHP Environment
# =========================================================================
FROM php:8.2-apache

# Install core PHP extensions required by modern web apps (e.g., pdo_mysql)
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite to support your .htaccess routing rules
RUN a2enmod rewrite

# Configure Apache to document root matching your file structure
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Configure custom ports for Render compatibility
ENV PORT=80
RUN sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf

WORKDIR /var/www/html

# Copy the pre-installed vendor folder from the builder stage
COPY --from=builder /app/vendor ./vendor

# Copy the rest of your application code directories and configuration files
COPY config/ ./config/
COPY logs/ ./logs/
COPY routes/ ./routes/
COPY src/ ./src/
COPY index.php README.md ./

# Set proper ownership and permissions for the Apache runtime user (www-data)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Render strips EXPOSE but keeping it helps documenting the standard entry port
EXPOSE 80

# Start Apache in the foreground to keep the container running
CMD ["apache2-foreground"]
