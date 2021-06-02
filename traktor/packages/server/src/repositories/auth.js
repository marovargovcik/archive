const _ = require('connect-ensure-login');
const OAuth2Strategy = require('passport-oauth2').Strategy;

const {
  createOrUpdateUser,
  getUserByUuid,
  getUserDetails,
} = require('./users');

const Strategy = new OAuth2Strategy(
  {
    authorizationURL: 'https://trakt.tv/oauth/authorize',
    callbackURL: process.env.TRAKT_TV_CALLBACK_URL,
    clientID: process.env.TRAKT_TV_CLIENT_ID,
    clientSecret: process.env.TRAKT_TV_CLIENT_SECRET,
    tokenURL: 'https://api.trakt.tv/oauth/token',
  },
  async function (accessToken, refreshToken, profile, done) {
    const { slug, uuid } = await getUserDetails(accessToken);
    await createOrUpdateUser({ refreshToken, slug, uuid });
    done(null, {
      accessToken,
      slug,
      uuid,
    });
  },
);

async function deserializeUser({ accessToken, uuid }, done) {
  const user = await getUserByUuid(uuid);
  done(null, {
    ...user,
    accessToken,
  });
}

function serializeUser({ accessToken, uuid }, done) {
  done(null, { accessToken, uuid });
}

const ensureLoggedIn = _.ensureLoggedIn('/auth/login');

module.exports = {
  deserializeUser,
  ensureLoggedIn,
  serializeUser,
  Strategy,
};
