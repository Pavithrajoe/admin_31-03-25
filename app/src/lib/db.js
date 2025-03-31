import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const {Pool}=pkg;

const pool=new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
});
console.log("DB_PASS:", typeof process.env.DB_PASS, process.env.DB_PASS); 
export default pool;