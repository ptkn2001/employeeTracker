const mysql = require('mysql2');

class EmployeeTrackerDatabase {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = mysql.createConnection(this.connectionString);
    }

    GetAllDepartments() {
        const queryString = `SELECT * FROM department`;
        return this.ExecuteQuery(queryString, [])
    }

    GetAllRoles() {
        const queryString = `SELECT r.id as role_id, r.title, r.salary, d.name as department
        FROM role r 
        JOIN department d on r.department_id = d.id`;
        return this.ExecuteQuery(queryString, [])
    }

    GetAllEmployees() {
        const queryString = `SELECT e.id as employee_id, e.first_name, e.last_name, r.title, r.salary, e2.first_name as manager_first_name, e2.last_name as manager_last_name, d.name as department
        FROM employee e 
        JOIN role r on e.role_id = r.id 
        JOIN department d on r.department_id = d.id
        LEFT JOIN employee e2 on e.manager_id = e2.id`;
        return this.ExecuteQuery(queryString, [])
    }

    async AddDepartment(departmentName) {
        const query = `SELECT COUNT(id) as count FROM department WHERE name = ?`
        const result = await this.ExecuteQuery(query, [departmentName]);
        if (result[0].count) {
            return new Promise((resolve, reject) => {
                throw new Error(`Department ${departmentName} is already exist`);
            });
        }

        const queryString = `INSERT INTO department (name) VALUES (?)`;
        return this.ExecuteQuery(queryString, departmentName);
    }

    async AddRole(roleName, salary, departmentName) {
        const roleNameQuery = `SELECT COUNT(id) as count FROM role WHERE title = ?`;
        const roleResult = await this.ExecuteQuery(roleNameQuery, [roleName]);
        if (roleResult[0].count) {
            return new Promise((resolve, reject) => {
                throw new Error(`Role ${roleName} is already exist`);
            });
        }

        const departmentNameQuery = `SELECT id FROM department WHERE name = ?`;
        const departmentResult = await this.ExecuteQuery(departmentNameQuery, [departmentName]);
        if (!departmentResult) {
            return new Promise((resolve, reject) => {
                throw new Error(`Department ${departmentName} does not exist.  Please add department and try again`);
            });
        } else {
            const queryString = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            return this.ExecuteQuery(queryString, [roleName, salary, departmentResult[0].id]);
        }
    }

    async AddEmployee(employeeFirstName, employeeLastName, roleName, managerFirstName, managerLastName) {
        const employeeQuery = `SELECT COUNT(id) as count FROM employee WHERE first_name = ? AND last_name = ?`;
        const employeeResult = await this.ExecuteQuery(employeeQuery, [employeeFirstName, employeeLastName]);
        if (employeeResult[0].count) {
            return new Promise((resolve, reject) => {
                throw new Error(`Employee with the name of ${employeeFirstName} ${employeeLastName} is already exist`);
            });
        }

        let managerId = null;
        if (managerFirstName && managerLastName) {
            const managerQuery = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
            const managerResult = await this.ExecuteQuery(managerQuery, [managerFirstName, managerLastName]);
            if (!managerResult) {
                return new Promise((resolve, reject) => {
                    throw new Error(`Manager with the name of ${managerFirstName} ${managerLastName} does not exist`);
                });
            } else {
                managerId = managerResult[0].id;
            }
        }

        const roleQuery = `SELECT id FROM role WHERE title = ?`;
        const roleResult = await this.ExecuteQuery(roleQuery, [roleName]);
        if (!roleResult) {
            return new Promise((resolve, reject) => {
                throw new Error(`Role ${roleName} does not exist.  Please add Role and try again`);
            });
        } else {
            let queryString;

            if (managerId) {
                queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                return this.ExecuteQuery(queryString, [employeeFirstName, employeeLastName, roleResult[0].id, managerId]);

            } else {
                queryString = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
                return this.ExecuteQuery(queryString, [employeeFirstName, employeeLastName, roleResult[0].id]);
            }
        }
    }

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