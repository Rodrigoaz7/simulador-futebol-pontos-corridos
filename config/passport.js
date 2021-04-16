const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcrypt');
const env = require('dotenv');
env.config({ path: './env/simulador.env' });

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username', passwordField: 'password'},(username, password,done)=> {
            try {
                const usernameLocal = process.env.LOGIN.toUpperCase();
                const passwordLocal = process.env.PASSWORD;
                const id = process.env.ID;
                
                if (usernameLocal != username.toUpperCase()) {
                    return done(null,false,{message:'Conta de Administrador Inválida'});
                }
    
                if (passwordLocal != password) {
                    return done(null,false,{message:'Senha Inválida'});
                }
    
                return done(null,id); 
            } catch (error) {
                return done(null,false,{message:'Dados de Login Local Não Existem Ou São Inválidos'});
            }      
        })
    );
    passport.serializeUser(function(id, done) {
        done(null,id);
    })
    passport.deserializeUser(function(id, done){
        done(null,id);
    })
}