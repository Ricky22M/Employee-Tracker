// require NPM packages
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

// Used to connect with database using SQL
const db = mysql2.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_Password,
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
            name: 'options',
            message: 'What would you like to do?',
            options: [
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
        const { options } = userChoices;
        // 
        if (options === 'View All Departments') {
            allDepartments();
        } else if (options === 'View All Roles') {
            allRoles();
        } else if (options === 'View All Employees') {
            allEmployess();
        } else if (options === 'Add Department') {
            createDepartment();
        } else if (options === 'Add Role') {
            createRole();
        } else if (options === 'Add Employee') {
            createEmployee();
        } else if (options === 'Update Employee Role') {
            updateRole();
        }
    });
}

// The option 'View All Departments' leads to the 'allDepartments' function
allDepartments = () => {
    const runAllDepartmentsSql = `SELECT department.id AS id,
                                  department.name AS department
                                  FROM department`
    db.query(runAllDepartmentsSql, (err, rows) => {
        if (err) throw err;
        console.log('All departments');

        askUser();
    });
}

// The option 'View All Roles' leads to the 'allRoles' function
allRoles = () => {
    const runAllRolesSql = `SELECT role.id,
                            role.title,
                            department.name AS department,
                            FROM role
                            INNER JOIN department
                            ON role.department_id = department.id`
    db.query(runAllRolesSql, (err, result) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    });
}

// The option 'View All Employees' leads to the 'allEmployees' function
allEmployess = () => {
    const runEmployeesSql = `SELECT employee.id, 
                                    employee.firstName, 
                                    employee.lastName, 
                                    role.title,
                                    department.name AS department, 
                                    role.salary, 
                                    CONCAT (manager.first, ' ', manager.last_name) AS manager 
                                FROM employee 
                                    LEFT JOIN role ON employee.role_id = department.id
                                    LEFT JOIN department ON role.department_id = department.id 
                                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(runEmployeesSql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    });
}

// The option 'Add Department' leads to the 'createDepartment' function
createDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What will be the name of this new department?',
        },
    ]).then(userChoice => {
        const runNewDepartmentSql = `INSERT INTO department (name) VALUES (?)`;
        db.query(runNewDepartmentSql, userChoice.runNewDepartment, (err, result) => {
            if (err) throw err;
            console.log('Created ' + userChoice.newDepartment + ' to the database');

            askUser();
        });
    });
}

// The option 'Add Role' leads to the 'createRole' function
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
                    option: department,
                },
            ]).then(userChoiceDepartment => {
                salaryForRole.push(userChoiceDepartment.department);

                const runPositionSql = `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?, ?)`;
                db.query(runPositionSql, salaryForRole, (err, result) => {
                    if (err) throw err;
                    console.log('Created ' + userChoice.role + ' to the database');

                    askUser();
                });
            });
        });
    });
}

// The option 'Add Employee' leads to the 'newEmployee' function
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
                    options: setRole,
                },
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
                            options: managers,
                        },
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        fullName.push(manager);

                        const runNewEmployeeSql = `INSERT INTO employee (firstName, LastName, role_id, manager_id) VALUES (?, ?, ?, ?)`;
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

// The option 'Update Employee Role' leads to the 'updateRole' function
updateRole = () => {
    const runUpdateSql = `SELECT * FROM employee`;

    db.query(runUpdateSql, (err, data) =>{
        if (err) throw err;

        const workForce = data.map(({ id, firstName, lastName, }) => ({ name: firstName + ' ' + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'nameUpdate',
                message: 'Which employee would you like to update the role for?',
                options: workForce,
            },
        ]).then(employeeUpdate => {
            const employee = employeeUpdate.nameUpdate;
            const newParams = [];
            settings.push(employee);

            const runRoleSql = `SELECT * FROM role`;
            datab.query(runRoleSql, (err, data) => {
                if (err) throw err;

                const setRole = data.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateEmployeeRole',
                        message: `what role will this employee have?`,
                        options: setRole,
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