import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'jwt_auth',
  entities: [User, Session],
  migrations: ['src/database/migrations/*.ts'],
});

export default AppDataSource;
