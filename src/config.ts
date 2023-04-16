import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { readIntEnv, readStringEnv } from './utils/readEnv'

require('dotenv').config()

type ServerConfig = {
  postgres: PostgresConnectionOptions
}

const config: ServerConfig = {
  postgres: {
    type: 'postgres',
    host: readStringEnv('POSTGRESQL_HOST'),
    port: readIntEnv('POSTGRESQL_PORT'),
    username: readStringEnv('POSTGRESQL_USERNAME'),
    password: readStringEnv('POSTGRESQL_PASSWORD'),
    database: readStringEnv('POSTGRESQL_DATABASE'),
    entities: [__dirname + '/entity/*.{ts,js}'],
    synchronize: false,
  },
}
export default config
