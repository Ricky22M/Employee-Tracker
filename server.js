// require NPM packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const express = require('express');

require('dotenv').config();

const PORT = process.env.PORT || 3001

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Used to connect with database using SQL
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employees_db',
    },
);

db.connect((err) => {
    if (err) throw err;
    console.log('Connection to database has been confirmed');
    askUser();
});

// Questions given to the user

askUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            // change name to choice
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role', 
            ],
        },
    ]).then((userChoices) => {
        const { choices } = userChoices;
        if (choices === 'View All Departments') {
            allDepartments();
        } else if (choices === 'View All Roles') {
            allRoles();
        } else if (choices === 'View All Employees') {
            allEmployess();
        } else if (choices === 'Add Department') {
            createDepartment();
        } else if (choices === 'Add Role') {
            createRole();
        } else if (choices === 'Add Employee') {
            createEmployee();
        } else if (choices === 'Update Employee Role') {
            updateRole();
        }
    });
}

// The choice 'View All Departments' leads to the 'allDepartments' function
allDepartments = () => {
    const runAllDepartmentsSql = `SELECT department.id AS id,
                                  department.name AS department
                                  FROM department`
    db.query(runAllDepartmentsSql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        askUser();
    });
}

// The choice 'View All Roles' leads to the 'allRoles' function
allRoles = () => {
    const runAllRolesSql = `SELECT role.id,
                            role.title,
                            department.name AS department,
                            role.salary,
                            FROM role
                            INNER JOIN department
                            ON role.department_id = department.id`
    db.query(runAllRolesSql, (err, result) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    });
}

// The choice 'View All Employees' leads to the 'allEmployees' function
allEmployess = () => {
    const runEmployeesSql = `SELECT employee.id, 
                                    employee.first_name, 
                                    employee.last_name, 
                                    role.title,
                                    department.name AS department, 
                                    role.salary, 
                                    CONCAT (manager.first_name, ' ', manager.last_name) AS manager 
                                FROM employee 
                                    LEFT JOIN role ON employee.role_id = role.id
                                    LEFT JOIN department ON role.department_id = department.id 
                                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(runEmployeesSql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    });
}

// The choice 'Add Department' leads to the 'createDepartment' function
createDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What will be the name of this new department?',
        },
    ]).then(userChoice => {
        const runNewDepartmentSql = `INSERT INTO department (name) VALUES (?)`;
        db.query(runNewDepartmentSql, userChoice.newDepartment, (err, result) => {
            if (err) throw err;
            console.log('Created ' + userChoice.newDepartment + ' to the database');

            askUser();
        });
    });
}

// The choice 'Add Role' leads to the 'createRole' function
createRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the new role that you will be creating?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary amount this role will make?',
        },
    ]).then(userChoice => {
        const salaryForRole = [userChoice.role, userChoice.salary];

        const runNewRoleSql = `SELECT name, id FROM department`;
        db.query(runNewRoleSql, (err,data) => {
            if (err) throw err;

            const department = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department will this role be associated with?',
                    choices: department,
                },
            ]).then(userChoiceDepartment => {
                salaryForRole.push(userChoiceDepartment.department);

                const runPositionSql = `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`;
                db.query(runPositionSql, salaryForRole, (err, result) => {
                    if (err) throw err;
                    console.log('Created ' + userChoice.role + ' to the database');

                    askUser();
                });
            });
        });
    });
}

// The choice 'Add Employee' leads to the 'newEmployee' function
createEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of this new employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of this new employee?',
        },
    ]).then(userChoice => {
        const fullName = [userChoice.firstName, userChoice.lastName];
        const runNewEmployeeSql = `SELECT role.id, role.title FROM role`;

        db.query(runNewEmployeeSql, (err, data) => {
            if (err) throw err;

            let setRole = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: `what is the employee's role?`,
                    choices: setRole,
                },
            ]).then(roleChoice => {
                const newRole = roleChoice.role;
                fullName.push(newRole);

                const runManagerSql = `SELECT * FROM employee`;
                db.query(runManagerSql ,(err, data) => {
                    if (err) throw err;

                    let managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: `Who is the employee's manager?`,
                            choices: managers,
                        },
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        fullName.push(manager);

                        const runNewEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                        db.query(runNewEmployeeSql, fullName, (err, result) => {
                            if (err) throw err;

                            console.log('Successfully added ' + userChoice.firstName + ' ' + userChoice.lastName + ' to the database');

                            askUser();
                        });
                    });
                });
            });
        });
    });
}

// The choice 'Update Employee Role' leads to the 'updateRole' function
updateRole = () => {
    const runUpdateSql = `SELECT * FROM employee`;

    db.query(runUpdateSql, (err, data) =>{
        if (err) throw err;

        const workForce = data.map(({ id, first_name, last_name, }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'nameUpdate',
                message: 'Which employee would you like to update the role for?',
                choices: workForce,
            },
        ]).then(employeeUpdate => {
            const employee = employeeUpdate.nameUpdate;
            const newParams = [];
            newParams.push(employee);

            const runRoleSql = `SELECT * FROM role`;
            datab.query(runRoleSql, (err, data) => {
                if (err) throw err;

                const setRole = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateEmployeeRole',
                        message: `what role will this employee have?`,
                        choices: setRole,
                    },
                ]).then(updateNewRole => {
                    const newRole = updateNewRole.updateEmployeeRole;
                    newParams.push(newRole);

                    let newEmployee = newParams[0];
                    newParams[0] = newRole;
                    newParams[1] = newEmployee;

                    const runUpdateRoleSql = `UPDATE employee 
                                              SET role_id = ? 
                                              WHERE id = ?`;
                    db.query(runUpdateRoleSql, newParams, (err, result) => {
                        if (err) throw err;
                        console.log(`Successfully updated role`);
                        
                        askUser();
                    });
                });
            });
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});