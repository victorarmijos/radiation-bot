// db.js — Conexión a Supabase / PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Requerido por Supabase
  max: 10,              // Max conexiones simultáneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test de conexión al iniciar el servidor
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a Supabase:', err.message);
  } else {
    console.log('✅ Conectado a Supabase PostgreSQL');
    release();
  }
});

module.exports = pool;
