-- /**
--  * K-ID by Karevo - Authentication Module
--  * Core File - Backend Organisation & Patient Auth
--  * Author: Wisdom Aso-Ukpai 
--  * Email: developer.webdevcode@gmail.com
--  * GitHub: @wisdom__aso
--  * Team: KAREVO
--  * Project: K-ID by Karevo
--  * Date: 2026
--  */
-- K-ID by Karevo - Database Schema

CREATE DATABASE IF NOT EXISTS karevo_kid CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE karevo_kid;

CREATE TABLE IF NOT EXISTS organisations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    org_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    karevo_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    otp_code VARCHAR(255) NULL,
    otp_expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    user_type ENUM('organisation','patient') NOT NULL,
    token TEXT NOT NULL,
    last_active_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_blacklisted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token(191)),
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
);

CREATE TABLE IF NOT EXISTS auth_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NULL,
    user_type ENUM('organisation','patient') NOT NULL,
    action ENUM('LOGIN_SUCCESS','LOGIN_FAILED','LOGOUT','ME_ACCESSED','TOKEN_EXPIRED','OTP_SENT') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);

-- Demo Seed Data (Password: password123)
INSERT INTO organisations (org_code, name, email, password, verified) VALUES
('KAREVO-ORG-001', 'Lagos University Teaching Hospital', 'admin@luth.karevo.demo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'||'$2y$10$JyVD37iiQuf1uIPlSKuEWu.T5bolXmDgfX0y05AA5p7.kkVsN1zMa', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO patients (karevo_id, full_name, email, phone, password) VALUES
('KID-PAT-001', 'Wisdom Aso-Ukpai (Demo Patient)', 'developer.webdevcode@gmail.com', '+2348000000001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('KID-PAT-002', 'Test Patient', 'patient@test.karevo.demo', '+2348000000002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
