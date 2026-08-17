<?php
/**
 * K-ID by Karevo - Authentication Module
 * Core File - Backend Organisation & Patient Auth
 * Author: Wisdom Aso-Ukpai
 * Email: developer.webdevcode@gmail.com
 * GitHub: @wisdom__aso
 * Team: KAREVO
 * Project: K-ID by Karevo
 * Date: 2026
 */

/**
 * K-ID by Karevo - Entry Point
 */
require __DIR__ . '/vendor/autoload.php';

// Check if the current request URI starts with /api
if (strpos($_SERVER['REQUEST_URI'], '/api') === 0 || strpos($_SERVER['REQUEST_URI'], '/api/') === 0) {
    header('Content-Type: application/json; charset=utf-8');
}

// Load ENV
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Error handling
set_exception_handler(function($e){
    http_response_code(500);
    echo json_encode([
        'success'=>false,
        'message'=>'Internal server error',
        'error'=>'SERVER_ERROR',
        'data'=> $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : null
    ]);
    error_log($e);
});

require __DIR__ . '/routes/api.php';

// Health check
if (parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) === '/' || parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) === '/api') {
    echo json_encode([
        'success'=>true,
        'message'=>'K-ID by Karevo Auth API - Running',
        'data'=>[
            'author'=>'Wisdom Aso-Ukpai',
            'team'=>'KAREVO',
            'endpoints'=>[
                'POST /api/org/login',
                'POST /api/org/logout',
                'GET /api/org/me',
                'POST /api/patient/otp/send',
                'POST /api/patient/login',
                'POST /api/patient/logout',
                'GET /api/patient/me'
            ]
        ]
    ]);
}
