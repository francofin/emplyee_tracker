USE employees;


INSERT INTO department 
    (name)
VALUES
    ('Marketing'),
    ('Data'),
    ('Trading'),
    ('Compliance');

INSERT INTO role
    (title, salary, department_id)
VALUES  
    ('Portfolio Analyst', 70000, 1),
    ('Data Analyst', 110000, 2),
    ('Data Engineer', 110000, 2), 
    ('Developer', 110000, 2), 
    ('Traders', 110000, 3), 
    ('Market Specialist', 100000, 3), 
    ('Compliance Officer', 100000, 4), 
    ('Accountant', 100000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Mike', 'Lapey', 1, NULL),
    ('Johnny', 'Spinney', 2, 1),
    ('Allan', 'Thicke', 3, NULL),
    ('Francois', 'Jack', 4, NULL),
    ('Tom', 'Arnold', 5, NULL),
    ('Kelly', 'Sampson', 6, 2), 
    ('Ian', 'Joespeh', 7, 3),
    ('Nicole', 'Lampard', 8, NULL);