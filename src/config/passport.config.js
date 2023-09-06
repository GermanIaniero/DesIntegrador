import passport from "passport";
//import local from 'passport-local'
import UserModel from "../models/user.model.js"
import GitHubStrategy from 'passport-github2'
//import { extractCookie, generateToken, createHash, isValidPassword } from "../utils.js";
import { extractCookie, generateToken } from "../utils.js";
import passportJWT from 'passport-jwt'
import passportGoogle from 'passport-google-oauth20'

const JWTStrategy = passportJWT.Strategy // La estrategia de JWT
const JWTextract = passportJWT.ExtractJwt // La funcion de extraccion


/*const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies['coderCookie'] : null

    console.log('COOKIE EXTRACTOR: ', token)
    return token
} */


const initializePassport = () => {

    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: JWTextract.fromExtractors([extractCookie]),
                secretOrKey: 'secretForJWT'
            },
            async (jwt_payload, done) => {

                    console.log( { jwt_payload } )
                    return done(null, jwt_payload)
                
                }
            )
    )



    /*
        App ID: 377939
    
    Client ID: Iv1.d73b35cdba36e500
    
    secret 33805847d0d2ff9e2ededbca26d8cfb8f876a485
    
    * google */



    var GoogleStrategy = passportGoogle.Strategy;

    const GOOGLE_CLIENT_ID = '609516804216-3nioo3vq0d1vmtaq6o8itqnsusugu0om.apps.googleusercontent.com'
    const GOOGLE_CLIENT_SECRET = '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'



    passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/callback-google"
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            const email = profile.emails[0].value
            const name = profile.displayName

            const user = await UserModel.findOne({ email })
            if (user) {
                console.log('Already exits')
                return done(null, user)
            }

            const result = await UserModel.create({ email, name, password: '' });

            return done(null, result)

        }

    ));

    

    /*locall 
    const LocalStrategy = local.Strategy */




    // register Es el nomber para Registrar con Local
    /*passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, age, social, role } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email: username,
                    password: createHash(password),
                    social,
                    role
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to register ' + e)
            }
        }
    )) */

    // login Es el nomber para IniciarSesion con Local
    /*passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done('Error login ' + e)
            }
        }
    )) 

   */





    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.Iv1.d73b35cdba36e500',
            clientSecret: '33805847d0d2ff9e2ededbca26d8cfb8f876a485',
            callbackURL: 'http://localhost:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try {
                const email = profile._json.email
                console.log({email})
                const user = await UserModel.findOne({ email }).lean().exec()
                if (user) {
                    console.log('User already exits ' + email)
                   // return done(null, user)
                }else {
                    console.log(`User doesn't exits. So register them`)

                    const newUser = {
                        first_name: profile._json.name,
                        last_name,
                        age,
                        email: profile._json.email,
                        password: '',
                        social: 'github',
                        role: 'usuario'
                }        
   
                const result = await UserModel.create(newUser)
                console.log(result)
                
            } 
            const token = generateToken(user)
                user.token = token

                return done(null, user)

            } catch (e) {
                return done('Error to login iwth gitrhub' + e) 
            }
            
        }
    ))

    // register Es el nomber para Registrar con Local
    /*passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, age, social, role } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits')
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password),
                    social,
                    role
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('Error to register ' + e)
            }
        }
    ))

    // login Es el nomber para IniciarSesion con Local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('User doesnt exist')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.error('Password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done('Error login ' + e)
            }
        }
    ))

   */

    passport.serializeUser(async (user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        return  user
    })

}

export default initializePassport