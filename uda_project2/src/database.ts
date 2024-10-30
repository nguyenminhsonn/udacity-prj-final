import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    PS_HOST,
    PS_DB,
    PS_DB_TEST,
    PS_USER,
    PS_USER_TEST,
    PS_PASSWORD,
    ENVIRONMENT,
} = process.env

const client = new Pool({
    host: PS_HOST,
    database: ENVIRONMENT === 'test' ? PS_DB_TEST : PS_DB,
    user: ENVIRONMENT === 'test' ? PS_USER_TEST : PS_USER,
    password: PS_PASSWORD
})
 
export const query = (text: string, params?: any[]) => client.query(text, params);
export const closeConnection = () => client.end();
export default client;