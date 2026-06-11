require('dotenv').config(); // Cargar tus secretos
const { Pool } = require('pg');

// Configuración de la conexión (usando la URL de Railway)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necesario para Railway
    }
});

// El código SQL que intentabas pegar
const sqlQuery = `
    -- Borrar tablas viejas si existen (para empezar limpio)
    DROP TABLE IF EXISTS interacciones;
    DROP TABLE IF EXISTS usuarios;

    -- Crear Tabla de Usuarios
    CREATE TABLE usuarios (
        telefono VARCHAR(20) PRIMARY KEY,
        nombre VARCHAR(100),
        nivel VARCHAR(50) DEFAULT 'Explorador',
        puntos INTEGER DEFAULT 0,
        etapa_actual VARCHAR(50) DEFAULT 'menu',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Crear Tabla de Interacciones
    CREATE TABLE interacciones (
        id SERIAL PRIMARY KEY,
        telefono VARCHAR(20) REFERENCES usuarios(telefono),
        mensaje_usuario TEXT,
        respuesta_bot TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

async function construirBaseDeDatos() {
    try {
        console.log("⏳ Conectando a Railway...");
        await pool.query(sqlQuery);
        console.log("✅ ¡ÉXITO! Las tablas 'usuarios' e 'interacciones' han sido creadas.");
    } catch (error) {
        console.error("❌ Error creando tablas:", error);
    } finally {
        await pool.end(); // Cerrar la conexión
    }
}

construirBaseDeDatos();