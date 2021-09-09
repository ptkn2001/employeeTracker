const inquirer = require('inquirer');
const EmployeeTrackerDatabase = require('./database');

const employeeTrackerDatabase = new EmployeeTrackerDatabase(`mysql://root:Letmein1@localhost/employeeTracker_db`);

inquirer
    .prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'wantToKnow',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees'
        ],
    }, ])
    .then((inquiringMinds) => {
        getAnswerTo(inquiringMinds.wantToKnow)
    });

const getAnswerTo = (whatChaWantToDo) => {
    switch (whatChaWantToDo) {
        case 'view all departments':
            employeeTrackerDatabase.GetAllDepartments()
                .then((results) => console.table(results))
                .catch((err) => console.error(err));
            break;
        case 'view all roles':
            employeeTrackerDatabase.GetAllRoles()
                .then((results) => console.table(results))
                .catch((err) => console.error(err));
            break;
        case 'view all employees':
            employeeTrackerDatabase.GetAllEmployees()
                .then((results) => console.table(results))
                .catch((err) => console.error(err));
            break;
        default:
            break;
    }
}