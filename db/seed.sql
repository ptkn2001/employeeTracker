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
       

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jane", "Smith", 1),
       ("John", "Doe", 2),
       ("Bill", "Moe", 3),
       ("John", "Wang", 4),
       ("Peter", "Pan", 5),
       ("Mickey", "Mouse", 6),
       ("Snow", "White", 7);