const db = require('../db');

async function buildMultipleQueries(queries) {
  const [rows] = await db.promise().query(queries.join(';'));
  // mysql2 wraps result of multiple statements in [] for each statement
  // in case queries contains only single query (e.g. when fetching single entity)
  // we are wrapping result in additional array to standardize returned shape
  if (queries.length === 1) {
    return [rows];
  }
  return rows;
}

module.exports = {
  buildMultipleQueries,
};
