const {prompt} = require('inquirer');
const { inherits } = require('util');
const db = require("./db");
const welcome = require('asciiart-logo');
require("console.table");


start_screen();

function start_screen() {
    const textToRender = 'Welcome to the employee manager database,' +
                        ' Please follow the prompts below to add, delete, modify '+
                        ' employee information. If you have trouble running the process '+
                        ' Reach out to francoiskieran89@gmail.com. ';
    const welcome_text = welcome({name: 'Welcome to the Employee Database Manager', font:'Electronic', logoColor: 'bold-green', textColor:'green',
                        lineChars: 10,
                        padding: 2,
                        margin: 3,}).
                        center(textToRender).render()

    console.log(welcome_text); 

    loadPrompts();
}


function loadPrompts() {
    prompt([
        {
            type: 'list', 
            name: 'choice', 
            message:'Please select an action',
            choices: [
                {
                    name: 'View All Departments',
                    value: 'VIEW_DEPARTMENTS'
                }, 
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'Add a New Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Remove a Department',
                    value: 'REMOVE_DEPARTMENT'
                },
                {
                    name: 'Add New Employee Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'View Employee by Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'View Employee By Manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER'
                },
                {
                    name: 'Add Employee to Database',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee from Database',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Update a Manager for an Employee',
                    value: 'UPDATE_EMPLOYEE_MANAGER'
                },
                {
                    name: 'View Department Budget',
                    value: 'VIEW_BUDGET'
                },
                {
                    name: 'Exit Application',
                    value: 'QUIT'
                }
                
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        switch(choice) {
            case "VIEW_DEPARTMENTS":
            viewDepartments();
            break;
            case "VIEW_ROLES":
            viewRoles();
            break;
            case "VIEW_EMPLOYEES":
            viewEmployees();
            break;
            case "ADD_DEPARTMENT":
            addDepartment();
            break;
            case "REMOVE_DEPARTMENT":
            removeDepartment();
            break;
            case "ADD_ROLE":
            addRole();
            break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            viewEmployeeByDepartment();
            break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
            viewEmployeeByManager();
            break;
            case "ADD_EMPLOYEE":
            addEmployee();
            break;
            case "REMOVE_EMPLOYEE":
            removeEmployee();
            break;
            case "UPDATE_EMPLOYEE_ROLE":
            updateEmployeeRole();
            break;
            case "UPDATE_EMPLOYEE_MANAGER":
            updateEmployeeManager();
            break;
            case "VIEW_BUDGET":
            viewBudget();
            break;
            default:
                quit(); 
            
        }
    })
};

function viewEmployees() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
    })
    .then(() => loadPrompts());
    
}

function viewDepartments() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => loadPrompts());
    
}

function viewRoles() {
    db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
    })
    .then(() => loadPrompts());
    
}

function viewBudget() {
    db.viewDepartmentBudgets()
    .then(([rows]) => {
        let budgets = rows;
        console.log("\n");
        console.table(budgets);
    })
    .then(() => loadPrompts());
    
}

function addDepartment() {
    prompt([
        {
            name:'name',
            message:'Please provide a name for the department'
        }
    ])
    .then(res =>{
        let name = res;
        db.createDepartment(name)
        .then(() => console.log(`${name} has been added to your organizational database`))
        .then(() => loadPrompts());
    })
}

function removeDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentForRemoval = departments.map(({id, name}) => ({
            name: name,
            value:  id
        }));

    prompt([
        {
            type: 'list',
            name:'departmentID',
            message:'Please provide a name for the department to remove, This removes employees and roles associated with this department',
            choices: departmentForRemoval
        }])
    .then(res => db.removeDepartment(res.departmentID))
        .then(() => console.log(`You have successfully removed a department from your organization`))
        .then(() => loadPrompts())
    });
}

function addRole() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const department_choice = departments.map(({id, name}) => ({
            name:name,
            value:id
        }));

    prompt([
        {
            name:'title',
            message:'Provide the title of the new role',
        },
        {
            name:'salary',
            message:'Provide the salary of the new role',
        },
        {
            type: 'list', 
            name:'department_id',
            message:'Which department does this new role belong to',
            choices: department_choice
        },
    ])
    .then(role => {
        db.createRole(role)
        .then(() => console.log(`You have successfully ${role.title} to the database`))
        .then(() => loadPrompts());
        })
    })
}

function viewEmployeeByDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoice = departments.map(({id, name}) => ({
            name:name,
            value:id
        }));
 
    prompt([
        {
            type: 'list', 
            name:'departmentID',
            message:'Which department would you like to view the employees for?',
            choices: departmentChoice
        },
    ])
    .then(res => db.findEmployeesByDepartment(res.departmentID))
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadPrompts())
    });
}

function viewEmployeeByManager() {
    db.findAllEmployees()
    .then(([rows]) => {
        let managers = rows;
        const managerChoice = managers.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value:id
        }));
 
    prompt([
        {
            type: 'list', 
            name:'managerID',
            message:'Which manager would you like to view the employees for?',
            choices: managerChoice
        },
    ])
    .then(res =>
        db.findEmployeeByManager(res.managerID))
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            if (employees.length === 0 ) {
                console.log("This manager does not have any direct employees");
            }
            console.table(employees);
        })
        .then(() => loadPrompts())
    });
}


function addEmployee() {
    prompt([
        {
            name:'first_name',
            message:'What is the Employees first name?',
        },
        {
            name:'last_name',
            message:'What is the Employees last name?',
        }
    ])
    .then(res => {
        let firstname = res.first_name;
        let lastname = res.last_name;

        db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoice = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

        prompt({
            type:'list',
            name:'roleID',
            message: 'What is the employees role',
            choices: roleChoice
        })
        .then(res => {
            let roleId = res.roleID;
            db.findAllEmployees()
            .then(([rows]) => {
                let employees =rows;
                const managerChoice = employees.map(({id, first_name, last_name}) => ({
                    name: `${first_name} ${last_name}`,
                    value:id
                }));

            managerChoice.unshift({name: "None", value: null});
            prompt({
                type:'list',
                name:'managerID',
                message: 'Who is the employee manager?',
                choices: managerChoice
            })
            .then( res => {
                let employee = {
                    manager_id: res.managerID,
                    role_id: roleId,
                    first_name: firstname,
                    last_name: lastname
                }

                db.createEmployee(employee);
            })
            .then(() => console.log(
                `Added ${firstname} ${lastname} to the database`
            ))
            .then(() => loadPrompts())
            })
        })
    })
  })
}

function removeEmployee() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoice = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt( [
            {
                type:'list', 
                name:'employeeID',
                message: 'Which employee would you like to remove?',
                choices: employeeChoice
            }
        ])
        .then(res => db.removeEmployee(res.employeeID))
        .then(() => console.log('Removed employee from the database'))
        .then(() => loadPrompts())
    })
}

function updateEmployeeRole() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoice = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type:'list',
                name:'employeeID',
                message:'Which employees role would you like to update?',
                choices: employeeChoice
            }
        ])
        .then(res => {
            let employeeid = res.employeeID;
            db.findAllRoles()
            .then(([rows]) => {
                let roles =rows;
                const roleChoice = roles.map(({id, title}) => ({
                    name: title, 
                    value: id
                }));
                
                prompt([
                    {
                        type: 'list',
                        name:'roleID',
                        message: 'Which Role would you like to assign to the employee?',
                        choices: roleChoice
                    }
                ])
                .then(res => db.updateRole(employeeid, res.roleID))
                .then(() => console.log('Updated the role for the employee'))
                .then(() => loadPrompts())
            });
        });
    })
}

function updateEmployeeManager() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoice = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type:'list',
                name:'employeeID',
                message:'Which employees role would you like to update?',
                choices: employeeChoice
            }
        ])
        .then(res => {
            let employeeid = res.employeeID;
            db.findAllManagers(employeeid)
            .then(([rows]) => {
                let managers =rows;
                const managerChoice = managers.map(({id, first_name, last_name}) => ({
                    name: `${first_name} ${last_name}`, 
                    value: id
                }));
                
                prompt([
                    {
                        type: 'list',
                        name:'managerID',
                        message: 'Which manager would you liek to set for this employee?',
                        choices: managerChoice
                    }
                ])
                .then(res => db.updateManager(employeeid, res.managerID))
                .then(() => console.log('Updated Manager'))
                .then(() => loadPrompts())
            });
        });
    })
}

function viewBudget() {
    db.viewDepartmentBudgets()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => loadPrompts());
}


function quit() {
    console.log("Have A Great day");
    process.exit();
}