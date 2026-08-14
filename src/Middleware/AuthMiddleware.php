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
namespace App\Middleware;

use Config\Database;
use App\Utils\Response;
use App\Utils\Token;
use App\Utils\Logger;

class AuthMiddleware {
    private const INACTIVITY_LIMIT = 86400; // 24 hours in seconds

    public static function handle(?string $allowedType = null): array {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            Response::error('Authentication required. No token provided.', 'UNAUTHORIZED', 401);
        }
        $token = trim($matches[1]);
        $db = Database::getInstance();

        // Check session exists and not blacklisted
        $stmt = $db->prepare("SELECT * FROM auth_sessions WHERE token = ? AND is_blacklisted = 0 LIMIT 1");
        $stmt->execute([$token]);
        $session = $stmt->fetch();

        if (!$session) {
            Response::error('Invalid or expired session. Please login again.', 'INVALID_TOKEN', 401);
        }

        // Check 24h inactivity
        $lastActive = strtotime($session['last_active_at']);
        if ((time() - $lastActive) > self::INACTIVITY_LIMIT) {
            $db->prepare("UPDATE auth_sessions SET is_blacklisted = 1 WHERE id = ?")->execute([$session['id']]);
            Logger::auth($session['user_type'], $session['user_id'], 'TOKEN_EXPIRED', ['reason' => '24h inactivity']);
            Response::error('Token expired due to 24 hours of inactivity.', 'TOKEN_EXPIRED', 401);
        }

        // Verify JWT signature & expiry
        $decoded = Token::verify($token);
        if (!$decoded) {
            $db->prepare("UPDATE auth_sessions SET is_blacklisted = 1 WHERE id = ?")->execute([$session['id']]);
            Response::error('Invalid or expired authentication token.', 'INVALID_TOKEN', 401);
        }

        if ($allowedType && $decoded->userType !== $allowedType) {
            Response::error('Forbidden: Invalid account type for this resource.', 'FORBIDDEN', 403);
        }

        // Sliding window: update last_active_at
        $db->prepare("UPDATE auth_sessions SET last_active_at = NOW() WHERE id = ?")->execute([$session['id']]);

        return [
            'user' => $decoded,
            'token' => $token,
            'session' => $session
        ];
    }
}
