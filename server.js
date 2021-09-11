/////////////////////////////////////////////////////////////////////////////////////////////////
//This is the entry point of the program.  It asks a series of questions and then pass the info
//to the answer.js module to process.
/////////////////////////////////////////////////////////////////////////////////////////////////
const inquirer = require('inquirer');
const answer = require('./modules/answer')

const questions = async() => {
    await inquirer
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
                'update an employee role'
            ],
        }, ])
        .then(async(inquiringMinds) => {
            await getAnswerTo(inquiringMinds.wantToKnow);
            wrapUp();
        })
}

const getAnswerTo = async(whatChaWantToDo) => {
    switch (whatChaWantToDo) {
        case 'view all departments':
            await answer.viewDepartments();
            break;
        case 'view all roles':
            await answer.viewRoles();
            break;
        case 'view all employees':
            await answer.viewEmployees();
            break;
        case 'add a department':
            await answer.addADepartment();
            break;
        case 'add a role':
            await answer.addRole();
            break;
        case 'add an employee':
            await answer.addEmployee();
            break;
        case 'update an employee role':
            await answer.updateEmployeeRole();
            break;
        default:
            break;
    }
}

const wrapUp = async() => {
    inquirer
        .prompt([{
            type: 'list',
            message: 'Do you want to continue?',
            name: 'userResponse',
            choices: [
                'yes',
                'no'
            ],
        }, ])
        .then(async(response) => {
            if (response.userResponse == 'yes') {
                questions();
            } else {
                answer.employeeTrackerDatabase.db.destroy();
            }
        })
}

questions();