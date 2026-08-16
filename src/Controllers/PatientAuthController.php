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

namespace App\Controllers;

use App\Models\Patient;
use App\Utils\Response;
use App\Utils\Token;
use App\Utils\Logger;
use Config\Database;

class PatientAuthController {
    // POST /api/patient/otp/send - helper for OTP flow
    public static function sendOtp() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $phone = trim($input['phone'] ?? '');
        if (!$phone) Response::error('Phone number is required.', 'VALIDATION_ERROR', 400);

        $patient = Patient::findByPhone($phone);
        if (!$patient) Response::error('Patient with this phone not found.', 'NOT_FOUND', 404);

        $otp = str_pad((string)rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiry = date('Y-m-d H:i:s', time() + (($_ENV['OTP_EXPIRY_MINUTES'] ?? 5) * 60));

        Patient::updateOtp($patient['id'], password_hash($otp, PASSWORD_BCRYPT), $expiry);

        // In production, send via SMS gateway. For now log it.
        Logger::auth('patient', $patient['id'], 'OTP_SENT', ['otp' => $otp, 'expires' => $expiry]);

        Response::success('OTP sent successfully', ['phone' => $phone, 'expires_at' => $expiry, 'demo_otp' => $otp]);
    }

    // POST /api/patient/login - accepts phone+OTP OR email+password
    public static function login() {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $phone = trim($input['phone'] ?? '');
        $otp = trim($input['otp'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        $db = Database::getInstance();
        $patient = null;

        if ($phone && $otp) {
            // Phone + OTP flow
            $patient = Patient::findByPhone($phone);
            if (!$patient || empty($patient['otp_code']) || empty($patient['otp_expires_at'])) {
                Response::error('Invalid or expired OTP. Request a new one.', 'INVALID_OTP', 401);
            }
            if (strtotime($patient['otp_expires_at']) < time()) {
                Response::error('OTP has expired. Request a new one.', 'OTP_EXPIRED', 401);
            }
            if (!password_verify($otp, $patient['otp_code']) && $patient['otp_code'] !== $otp) {
                // Support both hashed and plain for demo
                Logger::auth('patient', $patient['id'], 'LOGIN_FAILED', ['method' => 'phone_otp']);
                Response::error('Invalid OTP.', 'INVALID_OTP', 401);
            }
            Patient::clearOtp($patient['id']);
        } elseif ($email && $password) {
            // Email + Password flow
            $patient = Patient::findByEmail($email);
            if (!$patient || empty($patient['password']) || !password_verify($password, $patient['password'])) {
                Logger::auth('patient', null, 'LOGIN_FAILED', ['email' => $email, 'method' => 'email_password']);
                Response::error('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
            }
        } else {
            Response::error('Provide phone+otp or email+password.', 'VALIDATION_ERROR', 400);
        }

        $token = Token::generate(['id' => $patient['id'], 'userType' => 'patient']);
        $db->prepare("INSERT INTO auth_sessions (user_id, user_type, token, last_active_at, expires_at) VALUES (?, 'patient', ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))")->execute([$patient['id'], $token]);

        Logger::auth('patient', $patient['id'], 'LOGIN_SUCCESS', ['method' => $phone ? 'phone_otp' : 'email_password']);

        $safePatient = Patient::findByIdSafe($patient['id']);
        Response::success('Patient login successful', ['patient' => $safePatient, 'token' => $token]);
    }

    public static function logout($auth) {
        $db = Database::getInstance();
        $db->prepare("UPDATE auth_sessions SET is_blacklisted = 1 WHERE token = ?")->execute([$auth['token']]);
        Logger::auth('patient', $auth['user']->id, 'LOGOUT');
        Response::success('Logged out successfully');
    }

    public static function me($auth) {
        $patient = Patient::findByIdSafe($auth['user']->id);
        if (!$patient) Response::error('Patient not found.', 'NOT_FOUND', 404);
        Logger::auth('patient', $auth['user']->id, 'ME_ACCESSED');
        Response::success('Patient profile retrieved', ['patient' => $patient]);
    }
}
