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
return [
    'secret' => $_ENV['JWT_SECRET'] ?? 'change_this_secret_in_production_32char',
    'issuer' => $_ENV['JWT_ISSUER'] ?? 'karevo-k-id',
    'expiry' => (int)($_ENV['JWT_EXPIRY'] ?? 86400), // 24h
    'algo' => 'HS256'
];
