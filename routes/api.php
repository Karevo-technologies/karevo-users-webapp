/**
 * K-ID by Karevo - Authentication Module
 * Core File - Backend Organisation & Patient Auth
 * Author: Wisdom Aso-Ukpai
 * Email: wisdom.aso.ukpai@karevo.demo
 * GitHub: @wisdom__aso
 * Team: KAREVO
 * Project: K-ID by Karevo
 * Date: 2026
 */
<?php
use App\Controllers\OrgAuthController;
use App\Controllers\PatientAuthController;
use App\Middleware\AuthMiddleware;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Normalize URI - remove base path if needed
$uri = rtrim($uri, '/');
if ($uri === '') $uri = '/';

// Organisation Auth Routes
if ($uri === '/api/org/login' && $method === 'POST') {
    OrgAuthController::login();
}
if ($uri === '/api/org/logout' && $method === 'POST') {
    $auth = AuthMiddleware::handle('organisation');
    OrgAuthController::logout($auth);
}
if ($uri === '/api/org/me' && $method === 'GET') {
    $auth = AuthMiddleware::handle('organisation');
    OrgAuthController::me($auth);
}

// Patient Auth Routes
if ($uri === '/api/patient/otp/send' && $method === 'POST') {
    PatientAuthController::sendOtp();
}
if ($uri === '/api/patient/login' && $method === 'POST') {
    PatientAuthController::login();
}
if ($uri === '/api/patient/logout' && $method === 'POST') {
    $auth = AuthMiddleware::handle('patient');
    PatientAuthController::logout($auth);
}
if ($uri === '/api/patient/me' && $method === 'GET') {
    $auth = AuthMiddleware::handle('patient');
    PatientAuthController::me($auth);
}

// Fallback
if (!str_starts_with($uri, '/api')) {
    // Let other files handle
    return;
}

// If no route matched
http_response_code(404);
echo json_encode(['success'=>false,'message'=>'Endpoint not found: '.$uri,'error'=>'NOT_FOUND']);
exit;
