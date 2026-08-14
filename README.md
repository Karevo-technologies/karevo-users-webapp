# K-ID by Karevo - Auth Backend (PHP)

**Author:** Wisdom Aso-Ukpai  
**Team:** KAREVO  
**Email:** wisdom.aso.ukpai@karevo.demo  
**Demo GitHub:** @wisdom__aso

### Requirements Met
- POST /api/org/login
- POST /api/org/logout
- GET /api/org/me
- POST /api/patient/login (phone+OTP or email+password)
- POST /api/patient/otp/send (helper)
- POST /api/patient/logout
- GET /api/patient/me
- All routes except login require valid token
- 24h inactivity expiry via auth_sessions.last_active_at
- All auth actions logged with timestamp to DB + logs/auth.log
- Never returns password or health records

### Setup
1. `composer install`
2. Copy `.env.example` to `.env` and fill DB + JWT_SECRET
3. Import `database.sql`
4. Point Apache/Nginx to this folder
5. Ensure `logs/` is writable

Demo Login:
- Org: admin@luth.karevo.demo / password123
- Patient Email: patient@test.karevo.demo / password123
- Patient Phone: +2348000000001 + OTP via /api/patient/otp/send

Headers: `Authorization: Bearer <token>`
