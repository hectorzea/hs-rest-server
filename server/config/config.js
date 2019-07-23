process.env.PORT = process.env.PORT || 3000;

//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//base de datos
let DatabaseURL;
DatabaseURL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/hs_database' : 'mongodb+srv://hectorzea:dtW3YP1cnf0f2Fpe@cluster0-7xou3.mongodb.net/hs_database'
process.env.DATABASEURL = DatabaseURL;