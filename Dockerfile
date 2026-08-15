# Use an official PHP image with Apache web server
FROM php:8.2-apache

# Install system dependencies and zip tools needed by Composer
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip mysqli pdo pdo_mysql

# Enable Apache mod_rewrite (crucial for PHP routing frameworks)
RUN a2enmod rewrite

# Install the latest version of Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy your project files into the container
COPY . /var/www/html

# Run Composer install to grab your dependencies safely as superuser
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-interaction --optimize-autoloader

# Set proper file permissions for Apache
RUN chown -R www-data:www-data /var/www/html

# Expose port 80 for web traffic
EXPOSE 80
