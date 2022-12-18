# Employee Tracker

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  ## Walkthrough Video
  [//]: <> (Add video here)

  ## Description
  This project helps to keep track of employees from either adding/removing employees, creating new roles, to creating departments in company  and updating  current employee roles.
  
  ## Table of Contents
  * [User Story](#user-story)
  * [Acceptance Criteria](#acceptance-criteria)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)
  * [Contact Information](#questions)
  
  ## User Story

  ```md
  AS A business owner
  I WANT to be able to view and manage the departments, roles, and employees in my company
  SO THAT I can organize and plan my business
  ```

  ## Acceptance Criteria

  ```md
  GIVEN a command-line application that accepts user input
  WHEN I start the application
  THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
  WHEN I choose to view all departments
  THEN I am presented with a formatted table showing department names and department ids
  WHEN I choose to view all roles
  THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
  WHEN I choose to view all employees
  THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
  WHEN I choose to add a department
  THEN I am prompted to enter the name of the department and that department is added to the database
  WHEN I choose to add a role
  THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
  WHEN I choose to add an employee
  THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
  WHEN I choose to update an employee role
  THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
  ```

  ## Installation
  Run the command inside the terminal ```npm i ```, then inside the terminal the command ```mysql -u root -p```. Process to put in your password for your MySQL account. Afterwards run in MySQL ```source db/schema.sql;```. Next run the command in MySQL ```source db/seed.sql```, then quit out of MySQL. Finally, run in the terminal ```node server.js```.
  
  ## Usage
  Making a managing employee tracker system user friendly with the instructions provided above.

  ## License
  This project is under the the MIT license.

  ## Questions
  * [Github](https://github.com/Ricky22M)
  * I am reachable at rmedina@outlook.com for any additonal questions you may have.