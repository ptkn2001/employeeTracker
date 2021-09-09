INSERT INTO department (name)
VALUES ("Engineering"),
       ("Sales"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineering Manager", 200000.00, 1),
       ("Software Engineer", 100000.00, 1),
       ("Senior Software Engineer", 150000.00, 1),
       ("Sales Manager", 180000.00, 2),
       ("Sales Associate", 80000.00, 2),
       ("Marketing Manager", 300000.00, 3),
       ("Marketing Associate", 250000.00, 3);
       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Smith", 1, NULL),
       ("John", "Doe", 2, 1),
       ("Bill", "Moe", 3, 1),
       ("John", "Wang", 4, NULL),
       ("Peter", "Pan", 5, 4),
       ("Mickey", "Mouse", 6, NULL),
       ("Snow", "White", 7, 6);