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

namespace Config;
use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $dbname = $_ENV['DB_NAME'] ?? 'karevo_kid';
        $user = $_ENV['DB_USER'] ?? 'root';
        $pass = $_ENV['DB_PASS'] ?? '';
        $port = $_ENV['DB_PORT'] ?? '3306';

        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";echo $dsn;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        try {
            $this->conn = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success'=>false,'message'=>'Database connection failed','error'=>'DB_ERROR']);
            exit;
        }
    }

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            self::$instance = (new self())->conn;
        }
        return self::$instance;
    }
}
