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