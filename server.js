/////////////////////////////////////////////////////////////////////////////////////////////////
//This is the entry point of the program.  It asks a series of questions and then pass the info
//to the answer.js module to process.
/////////////////////////////////////////////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const answer = require('./modules/answer')

const questions = () => {
    inquirer
        .prompt([{
            type: 'list',
            message: 'What would you like to do?',
            name: 'wantToKnow',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'quit'
            ],
        }, ])
        .then((inquiringMinds) => {
            getAnswerTo(inquiringMinds.wantToKnow);
        })
}

const getAnswerTo = (whatChaWantToDo) => {
    switch (whatChaWantToDo) {
        case 'view all departments':
            answer.viewDepartments();
            break;
        case 'view all roles':
            answer.viewRoles();
            break;
        case 'view all employees':
            answer.viewEmployees();
            break;
        case 'add a department':
            answer.addADepartment();
            break;
        case 'add a role':
            answer.addRole();
            break;
        case 'add an employee':
            answer.addEmployee();
            break;
        case 'update an employee role':
            answer.updateEmployeeRole();
            break;
        case 'quit':
            //Destroy the sql connection and end the program.
            answer.employeeTrackerDatabase.db.destroy();
            break;
        default:
            break;
    }
}

questions();