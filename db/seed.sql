-- We are using the same database we created in the schema.sql file
-- We will USE the 'employee_db' database 
USE employees_db;

-- We INSERT INTO the table 'department' by passing name through
INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

-- We INSERT INTO the table 'role' by passing through the title, department_id, salary
INSERT INTO role (title, department_id, salary)
VALUES
('Sales Lead', 1, '100000'),
('Salesperson', 1, '80000'),
('Lead Engineer', 2, '150000'),
('Software Engineer', 2, '120000'),
('Account Manager', 3, '160000'),
('Accountant', 3, '125000'),
('Legal Team Lead', 4, '250000'),
('Lawyer', 4, '190000');

-- We INSERT INTO the table 'employee' by passing through the first name, last name, role id, and manager id
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, NULL),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, NULL),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, NULL),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, NULL),
('Tom', 'Allen', 8, 7);