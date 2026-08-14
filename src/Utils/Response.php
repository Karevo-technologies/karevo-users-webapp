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

class Response {
    public static function success($message, $data = null, $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    public static function error($message, $errorCode, $httpCode = 400, $data = null) {
        http_response_code($httpCode);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'error' => $errorCode,
            'data' => $data
        ]);
        exit;
    }
}
