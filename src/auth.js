import passport from 'passport';
import passportLocal from 'passport-local';
import { findUser, findUserId } from './server/db/user-db.js';

const { Strategy } = passportLocal;

// Passport Configuration
// Create a new LocalStrategy object to handle authentication using username and
// password credentials from the client. The LocalStrategy object is used to
// authenticate a user using a username and password.
const strategy = new Strategy({usernameField: 'email'}, async (email, password, done) => {
  if (!await findUser(email, password)) {
    await new Promise((r) => setTimeout(r, 2000)); // two second delay
    return done(null, false, { message: 'Wrong username or password' });
  }
  // success!
  let id = await findUserId(email, password);
  // should create a user object here, associated with a unique identifier
  return done(null, id);
});

// Configure passport to use the LocalStrategy object.
// The LocalStrategy object is used to authenticate a user using a username and
// password. There are other strategies available, but this is the simplest.
await passport.use(strategy);

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, uid);
});

export default {
  configure: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },

  authenticate: (domain, where) => {
    return passport.authenticate(domain, where);
  },
};
  