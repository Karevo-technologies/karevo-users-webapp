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
namespace App\Controllers;

use App\Models\Organisation;
use App\Utils\Response;
use App\Utils\Token;
use App\Utils\Logger;
use Config\Database;

class OrgAuthController {
    // POST /api/org/login
    public static function login() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (!$email || !$password) {
            Response::error('Email and password are required.', 'VALIDATION_ERROR', 400);
        }

        $org = Organisation::findByEmail($email);
        if (!$org || !password_verify($password, $org['password'])) {
            Logger::auth('organisation', null, 'LOGIN_FAILED', ['email' => $email]);
            Response::error('Invalid credentials.', 'INVALID_CREDENTIALS', 401);
        }

        $token = Token::generate(['id' => $org['id'], 'userType' => 'organisation']);
        $db = Database::getInstance();
        $db->prepare("INSERT INTO auth_sessions (user_id, user_type, token, last_active_at, expires_at) VALUES (?, 'organisation', ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))")->execute([$org['id'], $token]);

        Logger::auth('organisation', $org['id'], 'LOGIN_SUCCESS');

        // Never return password
        unset($org['password']);
        unset($org['otp_code']);
        Response::success('Organisation login successful', ['org' => $org, 'token' => $token]);
    }

    // POST /api/org/logout
    public static function logout($auth) {
        $db = Database::getInstance();
        $db->prepare("UPDATE auth_sessions SET is_blacklisted = 1 WHERE token = ?")->execute([$auth['token']]);
        Logger::auth('organisation', $auth['user']->id, 'LOGOUT');
        Response::success('Logged out successfully');
    }

    // GET /api/org/me
    public static function me($auth) {
        $org = Organisation::findById($auth['user']->id);
        if (!$org) Response::error('Organisation not found.', 'NOT_FOUND', 404);
        Logger::auth('organisation', $auth['user']->id, 'ME_ACCESSED');
        Response::success('Organisation profile retrieved', ['org' => $org]);
    }
}
