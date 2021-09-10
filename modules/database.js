/////////////////////////////////////////////////////////////////////////////////////////////////
//This module handles all the database CRUD operations then pass the results to the answer.js
//module to display the results.
/////////////////////////////////////////////////////////////////////////////////////////////////
const mysql = require('mysql2');

class EmployeeTrackerDatabase {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = mysql.createConnection(this.connectionString);
    }

    ///This method returns all the records in the department table.
    GetAllDepartments() {
        const queryString = `SELECT * FROM department`;
        return this.ExecuteQuery(queryString, [])
    }

    ///This method returns all the records in the role table.
    ///Some of the data come from the department table using join.
    GetAllRoles() {
        const queryString = `SELECT r.id as role_id, r.title, r.salary, d.name as department
        FROM role r 
        JOIN department d on r.department_id = d.id`;
        return this.ExecuteQuery(queryString, [])
    }

    ///This method returns all records in the employee table.
    ///Some of the data come from the role and department tables using join.
    GetAllEmployees() {
        const queryString = `SELECT e.id as employee_id, e.first_name, e.last_name, r.title, r.salary, e2.first_name as manager_first_name, e2.last_name as manager_last_name, d.name as department
        FROM employee e 
        JOIN role r on e.role_id = r.id 
        JOIN department d on r.department_id = d.id
        LEFT JOIN employee e2 on e.manager_id = e2.id`;
        return this.ExecuteQuery(queryString, [])
    }

    ///This method adds a new record to the department table.
    async AddDepartment(departmentName) {
        //If the department is already exist in the database, we return the custom error message to the caller.
        const result = await this.GetDepartmentByName(departmentName);
        if (result && result.length) {
            return new Promise((resolve, reject) => {
                throw new Error(`Department ${departmentName} is already exist`);
            });
        }

        //Execute the query and return the results.
        const queryString = `INSERT INTO department (name) VALUES (?)`;
        return this.ExecuteQuery(queryString, departmentName);
    }

    ///This method adds a new role entry in the role table.
    async AddRole(roleName, salary, departmentName) {
        //First we want to make sure that the role is not already existed in the database.
        const roleResult = await this.GetRoleByTitle(roleName);
        if (roleResult && roleResult.length) {
            return new Promise((resolve, reject) => {
                throw new Error(`Role ${roleName} is already exist`);
            });
        }

        //Then we make sure that the department name provided is a valid department.
        const departmentResult = await this.GetDepartmentByName(departmentName);
        if (!departmentResult || !departmentResult.length) {
            return new Promise((resolve, reject) => {
                throw new Error(`Department ${departmentName} does not exist. Please add department and try again`);
            });
        }

        //Execute the query and return the results.
        const queryString = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        return this.ExecuteQuery(queryString, [roleName, salary, departmentResult[0].id]);
    }

    ///This method adds a new employee entry in the employee table.
    async AddEmployee(employeeFirstName, employeeLastName, roleName, managerFirstName, managerLastName) {
        //First we want to make sure that the employee we try to add is not already existed in the database.
        const employeeResult = await this.GetEmployeeByFirstNameAndLastName(employeeFirstName, employeeLastName);
        if (employeeResult && employeeResult.length) {
            return new Promise((resolve, reject) => {
                throw new Error(`Employee with the name of ${employeeFirstName} ${employeeLastName} is already exist`);
            });
        }

        //If the manager is provided, we check to make sure that the manager is exist in the database.
        //If exist, we store the manager id in a variable to be used later.
        let managerId;
        if (managerFirstName && managerLastName) {
            const managerResult = await this.GetEmployeeByFirstNameAndLastName(managerFirstName, managerLastName);
            if (!managerResult || !managerResult.length) {
                return new Promise((resolve, reject) => {
                    throw new Error(`Manager with the name of ${managerFirstName} ${managerLastName} does not exist`);
                });
            } else {
                managerId = managerResult[0].id;
            }
        }

        //We check to make sure that the role provided is a valid role in the database.
        const roleResult = await this.GetRoleByTitle(roleName);
        if (!roleResult || !roleResult.length) {
            return new Promise((resolve, reject) => {
                throw new Error(`Role ${roleName} does not exist.  Please add Role and try again`);
            });
        } else {
            let queryString;

            //if the manager is provided, we insert that, else we just leave it blank. 
            //Execute the query and return the results.
            if (managerId) {
                queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                return this.ExecuteQuery(queryString, [employeeFirstName, employeeLastName, roleResult[0].id, managerId]);

            } else {
                queryString = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
                return this.ExecuteQuery(queryString, [employeeFirstName, employeeLastName, roleResult[0].id]);
            }
        }
    }

    ///This method updates the employee with a new role.
    async UpdateEmployeeRole(firstName, lastName, roleName) {
        //First we make sure that the new role is valid.
        const roleResult = await this.GetRoleByTitle(roleName);
        if (!roleResult || !roleResult.length) {
            return new Promise((resolve, reject) => {
                throw new Error(`Role ${roleName} does not exist.  Please add Role and try again`);
            });
        }

        //Execute the query and return the results.
        const queryString = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;
        return this.ExecuteQuery(queryString, [roleResult[0].id, firstName, lastName]);
    }

    ///Helper method to get the employee record by employee first name and last name.
    GetEmployeeByFirstNameAndLastName(firstName, lastName) {
        const query = `SELECT * FROM employee WHERE first_name = ? AND last_name = ?`
        return this.ExecuteQuery(query, [firstName, lastName]);
    }

    ///Helper method to get the role record by title.
    GetRoleByTitle(title) {
        const query = `SELECT * FROM role WHERE title = ?`
        return this.ExecuteQuery(query, [title]);
    }

    ///Helper method to get the department record by department name.
    GetDepartmentByName(departmentName) {
        const query = `SELECT * FROM department WHERE name = ?`
        return this.ExecuteQuery(query, [departmentName]);
    }

    ///Helper method to do the actual database query using mySql2. Returns a promise.
    ExecuteQuery(queryString, params) {
        return new Promise((resolve, reject) => {
            this.db.query(queryString, params, (err, results) => {
                if (results) {
                    resolve(results);
                } else {
                    reject(err);
                }
            })
        })
    }
}

module.exports = EmployeeTrackerDatabase;