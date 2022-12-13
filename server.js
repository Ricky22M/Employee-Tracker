// require NPM packages

const express = require('express');

const mysql2 = require('mysql2');

const inquirer = require('inquirer');

// Setting PORT for server
const PORT = process.env.PORT || 3001;

// Using express
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json);

// Used to connect with database using SQL
const db = mysql2.creeateConnect(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_Password,
        database: 'employees_db'
    }
);

db.connect((err) => {
    if (err) throw err;
    else{
        questions();
    }
});

// Questions given to the user

questions = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            options: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }
    ]).then((userChoice) => {
        const { options } = userChoice;
        // 
        if (options === 'View All Employees') {
            allEmployess();
        } else if (options === 'Add Employee') {
            newEmployee();
        } else if (options === 'Update Employee Role') {
            updateRole();
        } else if (options === 'View All Roles') {
            allRoles();
        } else if (options === 'Add Role') {
            newRole();
        } else if (options === 'View All Departments') {
            allDepartments();
        } else {
            newDepartment();
        }
    });
}

// The option 'View All Employees' leads to the 'allEmployees' function
allEmployess = () => {
    const runSql = `SELECT employee.id, employee.firstName, employee.lastName, role.title,
                department.name AS department, role.salary, CONCAT (manager.first, ' ', 
                manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = department.id
                LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    })
}

// The option 'Add Employee' leads to the 'newEmployee' function
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of this new employee?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of this new employee?'
        }
    ]).then(userChoice => {
        //
        const fullName = [userChoice.firstName, userChoice.lastName];
        const employeeRole = `SELECT role.id, role.title FROM role`;

        db.query(employeeRole, (err, data) => {
            if (err) throw err;

            let setRole = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: `what is the employee's role?`,
                    options: setRole
                }
            ]).then(roleChoice => {
                const newRole = roleChoice.role;
                fullName.push(newRole);

                const runManagerSql = `SELECT * FROM employee`;
                db.query(runManagerSql ,(err, data) => {
                    if (err) throw err;

                    let managers = data.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: `Who is the employee's manager?`,
                            options: managers
                        }
                    ]).then(managerAnswer => {
                        const manager = managerChoice;
                        fullName.push(manager);

                        const runSql = `INSERT INTO employee (firstName, LastName, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        db.query(sql, fullName, (err, result) => {
                            if (err) throw err;

                            console.log('Successfully added ' + userChoice.firstName + ' ' + userChoice.lastName + ' to the database');

                            questions();
                        });
                    });
                });
            });
        });
    });
}