const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  debugger: true,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ["dist/migrations/*.js"],
  synchronize: false,
  cli: {
    migrationsDir: "migrations",
  },
}

export default config;
