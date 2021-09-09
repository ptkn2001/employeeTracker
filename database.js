const mysql = require('mysql2');

class EmployeeTrackerDatabase {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = mysql.createConnection(this.connectionString);
    }

    GetAllDepartments() {
        const queryString = `SELECT * FROM department`;
        return new Promise((resolve, reject) => {
            this.db.query(queryString, (err, results) => {
                if (results) {
                    resolve(results);
                } else {
                    reject(err);
                }
            })
        });
    }

    GetAllRoles() {
        const queryString = `select r.id as role_id, r.title, r.salary, d.name as department
        from role r 
        join department d on r.department_id = d.id`;
        return new Promise((resolve, reject) => {
            this.db.query(queryString, (err, results) => {
                if (results) {
                    resolve(results);
                } else {
                    reject(err);
                }
            })
        });
    }

    GetAllEmployees() {
        const queryString = `select e.id as employee_id, e.first_name, e.last_name, r.title, r.salary, d.name as department
        from employee e 
        join role r on e.role_id = r.id 
        join department d on r.department_id = d.id`;
        return new Promise((resolve, reject) => {
            this.db.query(queryString, (err, results) => {
                if (results) {
                    resolve(results);
                } else {
                    reject(err);
                }
            })
        });
    }
}

module.exports = EmployeeTrackerDatabase;