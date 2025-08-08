import pkg from 'pg';
const { Pool } = pkg;

// Create a new connection pool
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
//   max: 10,              // Optional: max connections in pool (default 10)
//   idleTimeoutMillis: 30000, // Optional: close idle clients after 30 seconds
// });

// No need to manually connect here, pool manages connections automatically


// ADDED FOR EXTERNAL DEPLOYMENT
// TO BE ADDED TO .ENV FILE ?? DATABASE_URL, DATABASE_HOST, ...
// IN CASE .ENV FILE INDEX.JS TO BE ADDED: 
//      import dotenv from 'dotenv';
//      dotenv.config();

const pool = new Pool({
    // uncomment for deployment
//   user: process.env.DATABASE_USER,
//   host: process.env.DATABASE_HOST,
//   database: process.env.DATABASE_DATABASE,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DATABASE_PORT,
//   ssl: {
//     rejectUnauthorized: false
//   }

    // uncomment for development
  user: 'postgres.slipxykygueybdeveqtx',
  host: 'aws-0-eu-west-3.pooler.supabase.com',
  database: 'postgres',
  password: '1Jason2Rosita4',
  port: 5432,
  max: 10,              // Optional: max connections in pool (default 10)
  idleTimeoutMillis: 30000, // Optional: close idle clients after 30 seconds

});
console.log ("imprimo pool: ", pool)

export default pool;



// https://node-postgres.com