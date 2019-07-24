process.env.PORT = process.env.PORT || 3000;

//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//base de datos
let DatabaseURL;
DatabaseURL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/hs_database' : process.env.remoteURL
process.env.DATABASEURL = DatabaseURL;