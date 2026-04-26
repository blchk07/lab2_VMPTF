const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

function readDb() {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

function getNextId(items) {
  return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

module.exports = { readDb, writeDb, getNextId };
