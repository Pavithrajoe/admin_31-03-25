import pool from "../lib/db.js";

export const createTable = async () => {
  const createCompany = `CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      company_id INTEGER UNIQUE NOT NULL,
      company_name VARCHAR(50) NOT NULL,
      c_logo VARCHAR(100),
      favicon VARCHAR(100),
      contact_email VARCHAR(150),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;


  const createRoles = `CREATE TABLE  IF NOT EXISTS roles(

  role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role_name VARCHAR(255) UNIQUE NOT NULL
);`;

  const createUser = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL,
    role INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    company_id INTEGER, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_company
    FOREIGN KEY (company_id) 
    REFERENCES companies(id) 
    ON DELETE SET NULL,
    CONSTRAINT fk_role
    FOREIGN KEY (role) 
    REFERENCES roles(role_id)
);`;

  const CreateInkli_Products = `CREATE TABLE IF NOT EXISTS latest_from_company (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id  INTEGER,
    content TEXT,
    image VARCHAR(255),
    gif VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_userid
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);
`;
// Altering the user table 

// Rename user_id to created_by
const modify_userid=`ALTER TABLE latest_from_company
RENAME COLUMN user_id TO created_by;`;

// Add recently_updated_by column and set it as a foreign key
const add_updated_by =`ALTER TABLE latest_from_company
ADD COLUMN recently_updated_by INTEGER,
ADD CONSTRAINT fk_recently_updated_by
FOREIGN KEY (recently_updated_by)
REFERENCES users(id)
ON DELETE SET NULL;`;



const CreateEmail=`CREATE TABLE IF NOT EXISTS smtp_settings (
             id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
             company_id INTEGER, 
             smtp_host VARCHAR(255),
             smtp_port INTEGER,
             smtp_server VARCHAR(255),
             smtp_name  VARCHAR(255),
             smtp_email VARCHAR(255),
             smtp_password VARCHAR(255),
             CONSTRAINT fk_company
             FOREIGN KEY (company_id) 
             REFERENCES companies(id) 
             ON DELETE SET NULL);`;
            // creating blog table 
            const Createblog=` CREATE TABLE IF NOT EXISTS blog (
              id SERIAL PRIMARY KEY,
              user_id INT NOT NULL,
              blog_content JSONB NOT NULL,
              active BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW(),
          
              CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
          );`;
          // createing subscriber table
          const CreateSubscriber=`CREATE TABLE IF NOT EXISTS Subscriber_Management (
    id SERIAL PRIMARY KEY,
    subscriber_email VARCHAR(255) UNIQUE NOT NULL,
    company_id INT,
    subscription_date TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL ON UPDATE CASCADE
);`;





  try {
    // Create companies table first
    await pool.query(createCompany);
    console.log("Company table created successfully");
    // create roles table
    await pool.query(createRoles);
    console.log("roles table created successfully");
    // Create users table after companies table
    await pool.query(createUser);
    console.log("User table created successfully");
    //creating latest_from_company table 
    await pool.query(CreateInkli_Products);
    console.log("latest_from_company table created successfully");
    // creating smpt_settings table 
    await pool.query(CreateEmail);
    console.log("smpt_settings table crated successfully");
  await pool.query(Createblog);
  console.log("Blog table creaeted successfully");
  await pool.query(CreateSubscriber);
  console.log("subscriber table crated successfully");

  await pool.query(modify_userid);
  console.log("user alter table to  created_by ");
  await pool.query(add_updated_by );
  console.log("updated_by field added");
  } catch (err) {
    console.error("Error in creating table:", err);
  }
};

createTable();
