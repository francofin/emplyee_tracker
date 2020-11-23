const connection = require("./connection");

class DB {
    constructor(connection) {
        this.connection = connection;
    }
    
    findAllEmployees() {
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department_id LEFT JOIN employee manager ON manager.id = employee.manager_id;`
        );  
    }

    findAllManagers(employeeID) {
        return this.connection.promise().query(
            `SELECT id, first_name, last_name FROM employee where id != ?;`,
            employeeID
        );
    }

    createEmployee(employee) {
        return this.connection.promise().query(
            `INSERT into employee SET ?;`,
            employee);
    }

    removeEmployee(employeeID) {
        return this.connection.promise().query(
            `DELETE FROM employee WHERE id = ?;`,
            employeeID);
    }

    updateRole(employeeID, roleID) {
        return this.connection.promise().query(
            `UPDATE employee SET role_id = ? WHERE id = ?;`,
            [roleID, employeeID]);
    }

    updateManager(employeeID, managerID) {
        return this.connection.promise().query(
            `UPDATE employee SET manager_id = ? WHERE id = ?;`,
            [managerID, employeeID]);
    }

    findAllRoles() {
        return this.connection.promise().query(
           " SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;",
           );
    }

    createRole(role) {
        return this.connection.promise().query(
            `INSERT INTO role set ?;`,
            role);
    }

    removeRole(roleID) {
        return this.connection.promise().query(
            `DELETE FROM role WHERE id = ?;`,
            roleID);
    }

    findAllDepartments() {
        return this.connection.promise().query(
            `SELECT department.id, department.name AS department FROM department; `,
            );
    }

    viewDepartmentBudgets() {
        return this.connection.promise().query(
            `SELECT department.id, department.name, SUM(role.salary) AS Department_Budget 
            FROM employee LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department on role.department_id = department.id
            GROUP BY department.id, department.name;`,
            );
    }

    createDepartment(department) {
        return this.connection.promise().query(
            `INSERT INTO department SET ?;`,
            department);
    }

    removeDepartment(departmentID) {
        return this.connection.promise().query(
            `DELETE FROM department WHERE id = ?;`,
            departmentID);
    }

    findEmployeesByDepartment(departmentID) {
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title
            FROM employee LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id WHERE department.id =?;`,
            departmentID);
    }

    findEmployeeByManager(managerID) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
            managerID);
    }
}

module.exports = new DB(connection);