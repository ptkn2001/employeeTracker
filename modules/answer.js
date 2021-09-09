const inquirer = require('inquirer');
const EmployeeTrackerDatabase = require('./database');
const employeeTrackerDatabase = new EmployeeTrackerDatabase(`mysql://root:Letmein1@localhost/employeeTracker_db`);

const viewDepartments = () => {
    employeeTrackerDatabase.GetAllDepartments()
        .then((results) => console.table(results))
        .catch((err) => console.error(err));
}

const viewRoles = () => {
    employeeTrackerDatabase.GetAllRoles()
        .then((results) => console.table(results))
        .catch((err) => console.error(err));
}

const viewEmployees = () => {
    employeeTrackerDatabase.GetAllEmployees()
        .then((results) => console.table(results))
        .catch((err) => console.error(err));
}

const addADepartment = async() => {
    await inquirer
        .prompt([{
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department',
        }, ])
        .then((department) => {
            if (!department.name) {
                console.info('Department name can not be blank');
                return;
            }
            employeeTrackerDatabase.AddDepartment(department.name)
                .then((results) => {
                    console.log(`Department ${department.name} added successfully`)
                })
                .catch((err) => console.error(err.message));
        });
}

const addRole = async() => {
    await inquirer
        .prompt([{
                type: 'input',
                name: 'role',
                message: 'Enter role name',
            },
            {
                type: 'input',
                name: 'department',
                message: 'Enter department name',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role',
            },
        ])
        .then((roleInfo) => {
            if (!(roleInfo.role && roleInfo.department && roleInfo.salary)) {
                console.info('Role name, department name, or salary can not be blank.');
                return;
            }
            employeeTrackerDatabase.AddRole(roleInfo.role, roleInfo.salary, roleInfo.department)
                .then((results) => {
                    console.log(`Role ${roleInfo.role} added successfully`)
                })
                .catch((err) => console.error(err.message));
        });
}

const addEmployee = async() => {
    await inquirer
        .prompt([{
                type: 'input',
                name: 'employeeFirstName',
                message: 'Enter Employee first name',
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Enter employee last name',
            },
            {
                type: 'input',
                name: 'role',
                message: 'Enter the role for this employee',
            },
            {
                type: 'input',
                name: 'managerFirstName',
                message: 'Enter manager first name. Leave blank if no manager.',
            },
            {
                type: 'input',
                name: 'managerLastName',
                message: 'Enter manager last name. Leave blank if no manager.',
            },
        ])
        .then((employeeInfo) => {
            if (!(employeeInfo.employeeFirstName && employeeInfo.employeeLastName && employeeInfo.role)) {
                console.info(`Employee first name, last name, or role can not be blank`);
                return;
            }
            employeeTrackerDatabase.AddEmployee(employeeInfo.employeeFirstName, employeeInfo.employeeLastName,
                    employeeInfo.role, employeeInfo.managerFirstName, employeeInfo.managerLastName)
                .then((results) => {
                    console.log(`Employee ${employeeInfo.employeeFirstName} ${employeeInfo.employeeLastName} added successfully`)
                })
                .catch((err) => console.error(err.message));
        });
}

const updateEmployeeRole = async() => {

}

module.exports = { viewDepartments, viewRoles, viewEmployees, addADepartment, addRole, addEmployee, updateEmployeeRole, employeeTrackerDatabase };