# ระบบบันทึกข้อมูลและแสดงผลหน้า Dashboard สุขภาพจังหวัดเชียงราย

ระบบนี้พัฒนาขึ้นเพื่อบันทึกและแสดงผลข้อมูลการพัฒนาระบบบริการสุขภาพจังหวัดเชียงราย โดยใช้ React สำหรับ Frontend และ MySQL สำหรับฐานข้อมูล

## โครงสร้างระบบ

### Frontend (React)
- React 18 กับ JavaScript
- Tailwind CSS สำหรับการออกแบบ
- Chart.js สำหรับการแสดงกราฟ
- React Router สำหรับการนำทาง

### Backend (Node.js + Express)
- Express.js สำหรับ RESTful API
- MySQL สำหรับฐานข้อมูล
- JWT สำหรับการยืนยันตัวตน
- bcryptjs สำหรับการเข้ารหัสรหัสผ่าน

## ฟีเจอร์หลัก

### หน้า Dashboard
- แสดงภาพรวมของระบบสุขภาพจังหวัดเชียงราย
- สถิติสถานพยาบาล บุคลากร และเตียง
- กราฟการกระจายสถานพยาบาล
- ตารางสรุปข้อมูลตามอำเภอ

### จัดการสถานพยาบาล
- เพิ่ม แก้ไข ลบ ข้อมูลสถานพยาบาล
- ค้นหาและกรองข้อมูล
- แสดงข้อมูลบุคลากรและอุปกรณ์

### สถิติข้อมูลผู้ป่วย
- แสดงกราฟแนวโน้มผู้ป่วย
- กรองข้อมูลตามสถานพยาบาลและช่วงเวลา
- สถิติรวมของผู้ป่วยนอก ผู้ป่วยใน ฉุกเฉิน ฯลฯ

## การติดตั้ง

### 1. ติดตั้งฐานข้อมูล MySQL
```bash
# สร้างฐานข้อมูลและตาราง
mysql -u root -p < database/schema.sql
```

### 2. ติดตั้ง Backend
```bash
cd backend
npm install
npm run dev
```

### 3. ติดตั้ง Frontend
```bash
cd frontend
npm install
npm run dev
```

## การตั้งค่า

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chiang_rai_health
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

### การเข้าถึงระบบ
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## โครงสร้างฐานข้อมูล

ระบบประกอบด้วยตารางหลัก:
- `users` - ข้อมูลผู้ใช้
- `health_facilities` - ข้อมูลสถานพยาบาล
- `medical_staff` - ข้อมูลบุคลากรทางการแพทย์
- `equipment` - ข้อมูลอุปกรณ์การแพทย์
- `patient_statistics` - สถิติข้อมูลผู้ป่วย
- `budget_tracking` - ติดตามงบประมาณ
- `audit_logs` - บันทึกการเปลี่ยนแปลงข้อมูล

## ผู้ใช้งานเริ่มต้น

ชื่อผู้ใช้: `admin`
รหัสผ่าน: `password`
บทบาท: `admin`

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิก

### Facilities
- `GET /api/facilities` - ดึงข้อมูลสถานพยาบาลทั้งหมด
- `GET /api/facilities/:id` - ดึงข้อมูลสถานพยาบาลตาม ID
- `POST /api/facilities` - เพิ่มสถานพยาบาลใหม่
- `PUT /api/facilities/:id` - แก้ไขข้อมูลสถานพยาบาล
- `DELETE /api/facilities/:id` - ลบสถานพยาบาล

### Statistics
- `GET /api/statistics/overview` - ข้อมูลภาพรวม
- `GET /api/statistics/patient-stats` - สถิติผู้ป่วย
- `GET /api/statistics/facility-distribution` - การกระจายสถานพยาบาล
- `GET /api/statistics/district-summary` - สรุปตามอำเภอ

## การพัฒนาต่อ

ระบบนี้สามารถพัฒนาต่อได้โดย:
- เพิ่มระบบยืนยันตัวตนที่สมบูรณ์
- เพิ่มการส่งออกข้อมูลเป็น PDF/Excel
- เพิ่มระบบแจ้งเตือน
- เพิ่มการแสดงผลแผนที่ (GIS)
- เพิ่มระบบรายงานขั้นสูง
