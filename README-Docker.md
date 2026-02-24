# Docker Setup for Chiang Rai Health Dashboard

## การติดตั้งและรันด้วย Docker Compose

### ข้อกำหนดเบื้องต้น
- Docker และ Docker Compose ติดตั้งแล้ว
- Port 3000, 5000, 3306 ว่าง

### การรันระบบ

1. **Clone repository**
```bash
git clone https://github.com/James-CPE/sap-cr-2026.git
cd sap-cr-2026
```

2. **รันด้วย Docker Compose**
```bash
docker-compose up -d
```

3. **รอให้ระบบเริ่มทำงาน** (ประมาณ 2-3 นาที)
```bash
docker-compose logs -f
```

### การเข้าถึงระบบ

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306
  - Host: localhost
  - Port: 3306
  - Database: chiang_rai_health
  - Username: health_user
  - Password: health_pass

### การจัดการ Docker

**ดูสถานะ containers**
```bash
docker-compose ps
```

**ดู logs**
```bash
docker-compose logs [service-name]
```

**หยุดระบบ**
```bash
docker-compose down
```

**ลบข้อมูล MySQL**
```bash
docker-compose down -v
```

### โครงสร้าง Docker

- **MySQL 8.0**: ฐานข้อมูลหลัก
- **Node.js 18 Alpine**: Backend API
- **Nginx Alpine**: Frontend web server
- **Network**: Bridge network สำหรับการสื่อสารระหว่าง containers

### Environment Variables

- **MySQL**:
  - `MYSQL_ROOT_PASSWORD`: admin123
  - `MYSQL_DATABASE`: chiang_rai_health
  - `MYSQL_USER`: health_user
  - `MYSQL_PASSWORD`: health_pass

- **Backend**:
  - `DB_HOST`: mysql
  - `DB_NAME`: chiang_rai_health
  - `JWT_SECRET`: your_jwt_secret_key_change_in_production
  - `PORT`: 5000

- **Frontend**:
  - `VITE_API_URL`: http://localhost:5000

### การแก้ไขปัญหา

**หาก frontend ไม่โหลด**
```bash
docker-compose restart frontend
```

**หาก backend ไม่ตอบสนอง**
```bash
docker-compose restart backend
```

**หาก database ไม่เชื่อมต่อ**
```bash
docker-compose restart mysql
```

### การอัปเดต

**อัปเดต code**
```bash
git pull
docker-compose up -d --build
```

### ข้อมูลเริ่มต้น

- **Admin User**: admin / password
- **Database Schema**: ถูกสร้างอัตโนมัติเมื่อรันครั้งแรก
- **Sample Data**: ไม่มีข้อมูลตัวอย่าง (ต้องเพิ่มเอง)
