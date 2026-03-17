
const { DataSource } = require('typeorm');
const { User, UserRole } = require('./src/users/entities/user.entity');

async function fixAdmin() {
    const AppDataSource = new DataSource({
        type: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'sa',
        password: 'Password123', // Assuming this from previous context or standard dev env
        database: 'RentACarDB',
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
