DROP DATABASE IF EXISTS "jobly";
CREATE DATABASE "jobly";
\c "jobly";

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees integer NOT NULL,
  description text NOT NULL,
  logo_url text NOT NULL
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float NOT NULL,
  company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
  date_posted timestamp with time zone NOT NULL
);

INSERT INTO 
companies (handle, name, num_employees, description, logo_url)
VALUES ("amazon","Amazon", 3000000, "Online market place and AWS", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o");


DROP DATABASE IF EXISTS "jobly-test";
CREATE DATABASE "jobly-test";
\c "jobly-test";

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees integer NOT NULL,
  description text NOT NULL,
  logo_url text NOT NULL
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float NOT NULL,
  company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
  date_posted timestamp with time zone 
);

INSERT INTO 
companies (handle, name, num_employees, description, logo_url)
VALUES ("amazon","Amazon", 3000000, "Online market place and AWS", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o");
-- INSERT INTO 
-- companies 
-- (handle, name, num_employees, description, logo_url)
-- VALUES ("apple", "Apple", 10000, "Hip computers and stuff", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o");

-- INSERT INTO 
-- jobs
-- (title, salary, equity, equity, company_handle)
-- VALUES ("Junior Backend Developer", 90000, 0.01, "amazon");

-- INSERT INTO 
-- jobs
-- (title, salary, equity, equity, company_handle)
-- VALUES ("Senior Backend Developer", 190000, 0.05, "amazon");


-- INSERT INTO 
-- jobs
-- (title, salary, equity, equity, company_handle)
-- VALUES ("Fullstack Developer", 300000,  0.07, "apple");


-- INSERT INTO 
-- jobs
-- (title, salary, equity, equity, company_handle)
-- VALUES ("Administrative assistant", 70000,  0.001, "apple");




        

       

        
       