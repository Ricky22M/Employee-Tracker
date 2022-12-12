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

