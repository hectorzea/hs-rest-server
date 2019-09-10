// puerto
process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//expiry token
process.env.EXPIRY_TOKEN = '1h'

//authentication seed
process.env.AUTH_TOKEN_SEED = process.env.AUTH_TOKEN_SEED || 'dev-seed'

//GOOGLE-SIGN-IN CLIENT ID 
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '68188424499-a2kvnhonbe12o1hhfiun006ij9gbbf4b.apps.googleusercontent.com'; 

//base de datos
let DatabaseURL;
DatabaseURL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/hs_database' : process.env.remoteURL
process.env.DATABASEURL = DatabaseURL;
