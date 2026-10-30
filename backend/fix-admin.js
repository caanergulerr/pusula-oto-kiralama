
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { DataSource } = require('typeorm');
const { User, UserRole } = require('./src/users/entities/user.entity');

async function fixAdmin() {
    const AppDataSource = new DataSource({
        type: 'mssql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '1433'),
        username: process.env.DB_USER || 'sa',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'RentACarDB',
        entities: ['src/**/entities/*.entity.ts'],
        synchronize: false,
        extra: {
            trustServerCertificate: true,
        },
    });

    try {
        await AppDataSource.initialize();
        console.log("Database connected.");

        // We can execute raw SQL if Entity setup is complex in script
        await AppDataSource.query(`
            UPDATE users 
            SET role = 'ADMIN' 
            WHERE email = 'admin@rentacar.com'
        `);

        console.log("User 'admin@rentacar.com' updated to ADMIN role successfully.");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

fixAdmin();
