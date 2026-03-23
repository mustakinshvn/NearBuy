import pool from '../config/db.js';

const cache = new Map();

async function loadColumnsForTable(tableName) {
  if (cache.has(tableName)) return cache.get(tableName);

  const { rows } = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1;`,
    [tableName]
  );

  const cols = new Set(rows.map((r) => r.column_name));
  cache.set(tableName, cols);
  return cols;
}

export async function getFirstExistingColumn(tableName, candidates) {
  const cols = await loadColumnsForTable(tableName);
  for (const name of candidates) {
    if (cols.has(name)) return name;
  }
  return null;
}

export async function updateOneColumnIfExists({
  tableName,
  idColumn,
  idValue,
  candidateColumns,
  value,
}) {
  const col = await getFirstExistingColumn(tableName, candidateColumns);
  if (!col) {
    return { updated: false, column: null, row: null };
  }

  const query = `UPDATE ${tableName} SET ${col} = $1 WHERE ${idColumn} = $2 RETURNING *;`;
  const { rows } = await pool.query(query, [value, idValue]);
  return { updated: true, column: col, row: rows[0] || null };
}
