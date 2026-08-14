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
namespace App\Utils;

use Config\Database;

class Logger {
    public static function auth(string $userType, ?string $userId, string $action, array $metadata = []) {
        $db = Database::getInstance();
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

        $stmt = $db->prepare("INSERT INTO auth_logs (user_id, user_type, action, ip_address, user_agent, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $userId,
            $userType,
            $action,
            $ip,
            $ua,
            json_encode($metadata)
        ]);

        // File log as backup
        $logLine = sprintf("[%s] %s - %s - %s - IP:%s - %s\n",
            date('Y-m-d H:i:s'), strtoupper($userType), $action, $userId ?? 'guest', $ip, json_encode($metadata)
        );
        file_put_contents(__DIR__ . '/../../logs/auth.log', $logLine, FILE_APPEND);
    }
}
