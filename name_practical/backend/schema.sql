CREATE DATABASE IF NOT EXISTS car_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_rental;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reservation_rental;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS sessions;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE user (
  userId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  gender ENUM('male','female') NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_role (role),
  INDEX idx_user_username (username)
) ENGINE=InnoDB;

CREATE TABLE vehicle (
  vehicleId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(40) NOT NULL UNIQUE,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  year INT NOT NULL,
  vehicle_type VARCHAR(60) NOT NULL,
  purchase_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('available','rented','maintenance') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vehicle_status (status)
) ENGINE=InnoDB;

CREATE TABLE customer (
  customerId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId BIGINT UNSIGNED NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  national_ID VARCHAR(40) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  email VARCHAR(160) NULL,
  address TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer_user FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE,
  INDEX idx_customer_name (full_name)
) ENGINE=InnoDB;

CREATE TABLE reservation_rental (
  reserveId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customerId BIGINT UNSIGNED NOT NULL,
  vehicleId BIGINT UNSIGNED NOT NULL,
  reservation_Date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reservation_status ENUM('pending','confirmed','active','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservation_customer FOREIGN KEY (customerId) REFERENCES customer(customerId) ON DELETE CASCADE,
  CONSTRAINT fk_reservation_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicle(vehicleId) ON DELETE RESTRICT,
  INDEX idx_reservation_status (reservation_status),
  INDEX idx_reservation_dates (start_date, end_date)
) ENGINE=InnoDB;

CREATE TABLE sessions (
  session_id VARCHAR(128) NOT NULL PRIMARY KEY,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT NULL
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  audit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES user(userId) ON DELETE SET NULL,
  INDEX idx_audit_actor (actor_user_id),
  INDEX idx_audit_entity (entity, entity_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;
