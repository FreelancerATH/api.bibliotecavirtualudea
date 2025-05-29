import 'dotenv/config';
import { get } from 'env-var'

export const envs = {
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  DB_HOST: get('DB_HOST').required(),
  DB_USERNAME: get('DB_USERNAME').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  DATABASE_NAME: get('DATABASE').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),

}