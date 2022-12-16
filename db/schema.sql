DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8, 2) NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);