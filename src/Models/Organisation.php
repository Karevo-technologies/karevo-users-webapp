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
namespace App\Models;

use Config\Database;

class Organisation {
    public static function findByEmail(string $email): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM organisations WHERE email = ? LIMIT 1");
        $stmt->execute([strtolower($email)]);
        return $stmt->fetch() ?: null;
    }

    public static function findById(string $id): ?array {
        $db = Database::getInstance();
        // Never return password
        $stmt = $db->prepare("SELECT id, org_code, name, email, verified, created_at FROM organisations WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }
}
