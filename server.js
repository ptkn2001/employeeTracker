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
                'update an employee role'
            ],
        }, ])
        .then((inquiringMinds) => {
            getAnswerTo(inquiringMinds.wantToKnow);
        })
}

const getAnswerTo = async(whatChaWantToDo) => {
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
            await answer.addEmployee();
            break;
        case 'update an employee role':
            answer.updateEmployeeRole();
            break;
        default:
            break;
    }
}

questions();