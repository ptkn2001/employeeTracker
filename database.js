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
        const queryString = `select r.id as role_id, r.title, r.salary, d.name as department
        from role r 
        join department d on r.department_id = d.id`;

        return this.ExecuteQuery(queryString, [])
    }

    GetAllEmployees() {
        const queryString = `select e.id as employee_id, e.first_name, e.last_name, r.title, r.salary, e2.first_name as manager_first_name, e2.last_name as manager_last_name, d.name as department
        from employee e 
        join role r on e.role_id = r.id 
        join department d on r.department_id = d.id
        left join employee e2 on e.manager_id = e2.id;`;

        return this.ExecuteQuery(queryString, [])
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