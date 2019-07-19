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