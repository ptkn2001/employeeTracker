/////////////////////////////////////////////////////////////////////////////////////////////////
//This module handles logic for user's input validation and asking additional questions if needed
//and then making the calls to the database.js module which does the database CRUD operarions.
//The results/errors then be displayed in the console.
/////////////////////////////////////////////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const EmployeeTrackerDatabase = require('./database');
const employeeTrackerDatabase = new EmployeeTrackerDatabase(`mysql://root:Letmein1@localhost/employeeTracker_db`);

///This method gets all department records and print the results.
const viewDepartments = () => {
    employeeTrackerDatabase.GetAllDepartments()
        .then((results) => console.table(results))
        .catch((err) => console.error(err));
}

///This method gets all the role records and print the results.
const viewRoles = () => {
    employeeTrackerDatabase.GetAllRoles()
        .then((results) => console.table(results))
        .catch((err) => console.error(err));
}

///This method gets all the employee records and print the results.
const viewEmployees = () => {
    employeeTrackerDatabase.GetAllEmployees()
        .then((results) => console.table(results))
        .catch((err) => console.error(err));
}

///This method add a new department entry to the department table.
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

//This method adds a new role entry to the role table.
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

///This method adds a new employee entry to the employee table.
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

///This method updates an employee with a new role.
const updateEmployeeRole = async() => {
    //First we get all the employees with their current role.
    const query = `SELECT e.first_name, e.last_name, r.title FROM employee e JOIN role r on e.role_id = r.id`
    const results = await employeeTrackerDatabase.ExecuteQuery(query, []);

    //Then convert to an array that we can use to for users to select to be updated using inquire list.
    const employees = results.map((employee) => {
        return `${employee.first_name} ${employee.last_name}: ${employee.title}`;
    })

    inquirer
        .prompt([{
                type: 'list',
                message: 'Select an employee to update role for',
                name: 'employeeName',
                choices: employees,
            },
            {
                type: 'input',
                name: 'roleName',
                message: 'Enter new role title',
            },
        ])
        .then((employeeRoleInfo) => {
            if (!(employeeRoleInfo.roleName)) {
                console.info('Role name can not be blank.');
                return;
            }

            //We split the choice that the users selected to get the employee first name and last name.
            const employeeName = employeeRoleInfo.employeeName.split(':');
            const employeeFirstNameLastName = employeeName[0].split(' ');

            //We call the UpdateEmployeeRole method in the database.js module to update the employee with new role.
            employeeTrackerDatabase.UpdateEmployeeRole(employeeFirstNameLastName[0], employeeFirstNameLastName[1], employeeRoleInfo.roleName)
                .then((results) => {
                    console.log(`Employee ${employeeRoleInfo.employeeName} now has a new ${employeeRoleInfo.roleName} role`)
                })
                .catch((err) => console.error(err.message));
        });

}

module.exports = { viewDepartments, viewRoles, viewEmployees, addADepartment, addRole, addEmployee, updateEmployeeRole, employeeTrackerDatabase };