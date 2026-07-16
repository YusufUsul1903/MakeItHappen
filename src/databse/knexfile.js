export default {
    client: 'sqlite3',

    connection: {
        filename: './src/database/database.sqlite'
    },

    useNullAsDefault: true,

    migrations: {
        directory: './src/database/migrations'
    }
};