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

namespace App\Utils;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Token {
    public static function generate(array $payload): string {
        $config = require __DIR__ . '/../../config/jwt.php';
        $now = time();
        $tokenPayload = [
            'iss' => $config['issuer'],
            'iat' => $now,
            'exp' => $now + $config['expiry'],
            'id' => $payload['id'],
            'userType' => $payload['userType'] // organisation | patient
        ];
        return JWT::encode($tokenPayload, $config['secret'], $config['algo']);
    }

    public static function verify(string $token): ?object {
        $config = require __DIR__ . '/../../config/jwt.php';
        try {
            return JWT::decode($token, new Key($config['secret'], $config['algo']));
        } catch (\Exception $e) {
            return null;
        }
    }
}
