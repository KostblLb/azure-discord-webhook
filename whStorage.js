var { Pool } = require('pg');
console.log(process.env.DATABASE_URL);
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

module.exports = {
    async get(hash) {
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM webhooks WHERE hash='${hash}'`);
            client.release();
            return result.rows[0];
          } catch (err) {
            console.error(err);
            throw err;
          }
    },
    async set(hash, id, token) {
        try {
            const client = await pool.connect();
            await client.query(`INSERT INTO webhooks (hash, id, token) VALUES('${hash}', ${id}, '${token}')`);
            client.release();
            return hash;
          } catch (err) {
            console.error(err);
            throw err;
          }
    },
    async delete(hash) {
        try {
            const client = await pool.connect();
            const result = await client.query(`DELETE FROM webhooks WHERE hash='${hash}'`);
            console.log(result);
            client.release();
          } catch (err) {
            console.error(err);
            throw err;
          }
    }
}