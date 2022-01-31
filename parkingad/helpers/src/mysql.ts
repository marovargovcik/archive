import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  database: process.env.MYSQL_DATABASE as string,
  host: process.env.MYSQL_HOST as string,
  password: process.env.MYSQL_PASSWORD as string,
  port: Number.parseInt(process.env.MYSQL_PORT as string, 10) as number,
  user: process.env.MYSQL_USERNAME as string,
});

export { pool as mysql };
