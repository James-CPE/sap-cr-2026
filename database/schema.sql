CREATE DATABASE IF NOT EXISTS chiang_rai_health;
USE chiang_rai_health;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'data_entry', 'viewer') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE health_facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type ENUM('hospital', 'clinic', 'health_center', 'sub_health_center') NOT NULL,
  district VARCHAR(100) NOT NULL,
  subdistrict VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  beds_total INT DEFAULT 0,
  beds_available INT DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE medical_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  license_number VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  hire_date DATE,
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES health_facilities(id)
);

CREATE TABLE equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  serial_number VARCHAR(100),
  purchase_date DATE,
  warranty_expiry DATE,
  status ENUM('operational', 'maintenance', 'out_of_order') DEFAULT 'operational',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES health_facilities(id)
);

CREATE TABLE patient_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT,
  date DATE NOT NULL,
  outpatients INT DEFAULT 0,
  inpatients INT DEFAULT 0,
  emergency_cases INT DEFAULT 0,
  surgeries INT DEFAULT 0,
  births INT DEFAULT 0,
  deaths INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES health_facilities(id),
  UNIQUE KEY unique_facility_date (facility_id, date)
);

CREATE TABLE budget_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT,
  fiscal_year INT NOT NULL,
  quarter INT NOT NULL,
  allocated_budget DECIMAL(15, 2) NOT NULL,
  spent_budget DECIMAL(15, 2) DEFAULT 0,
  remaining_budget DECIMAL(15, 2) GENERATED ALWAYS AS (allocated_budget - spent_budget) STORED,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES health_facilities(id)
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id INT,
  old_data JSON,
  new_data JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@chiangrai.health.go.th', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
