import sqlite3 from 'sqlite3';
export let db = new sqlite3.Database('./backend/db/rent-a-dev');