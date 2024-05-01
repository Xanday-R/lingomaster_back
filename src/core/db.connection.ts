import {knex} from 'knex';

export const knexManager = knex({
    client: 'mysql',
    connection: {
        host: 'btmp1xyk8i5s2tdv1lk6-mysql.services.clever-cloud.com',
        user: 'ueifl8zc5pg5ssjz',
        password: 'IzrywsJVEnGPLLRWFKMb',
        database: 'btmp1xyk8i5s2tdv1lk6'
    }
})