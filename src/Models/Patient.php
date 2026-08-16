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

namespace App\Models;

use Config\Database;

class Patient {
    public static function findByEmail(string $email): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM patients WHERE email = ? LIMIT 1");
        $stmt->execute([strtolower($email)]);
        return $stmt->fetch() ?: null;
    }

    public static function findByPhone(string $phone): ?array {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM patients WHERE phone = ? LIMIT 1");
        $stmt->execute([$phone]);
        return $stmt->fetch() ?: null;
    }

    public static function findByIdSafe(string $id): ?array {
        $db = Database::getInstance();
        // Never return password, otp, or health record data
        $stmt = $db->prepare("SELECT id, karevo_id, full_name, email, phone, created_at FROM patients WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function updateOtp(string $id, string $otp, string $expiresAt) {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE patients SET otp_code = ?, otp_expires_at = ? WHERE id = ?");
        return $stmt->execute([$otp, $expiresAt, $id]);
    }

    public static function clearOtp(string $id) {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE patients SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
