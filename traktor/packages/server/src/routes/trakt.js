const router = require('express').Router();
const createError = require('http-errors');
const httpProxy = require('http-proxy');
const { nanoid } = require('nanoid');

const { db } = require('../clients');

const proxy = httpProxy.createProxyServer();

const ALLOWED_URLS = {
  '/sync/ratings': 'ratings',
  '/sync/recommendations': 'recommendations',
  '/sync/watchlist': 'watchlist',
};

async function logActivity(proxyRes, req) {
  if (
    req.method !== 'POST' ||
    proxyRes.statusCode !== 201 ||
    !Object.keys(ALLOWED_URLS).includes(req.url)
  ) {
    return;
  }

  const log = {
    type: ALLOWED_URLS[req.url],
    userUuid: req.user.uuid,
    uuid: nanoid(40),
  };

  if (req.body.movies && req.body.movies[0]) {
    log.entity = 'movies';
    log.slug = req.body.movies[0].ids.slug;
  } else if (req.body.shows && req.body.shows[0]) {
    log.entity = 'shows';
    log.slug = req.body.shows[0].ids.slug;
  } else {
    // log error
    return;
  }

  if (log.type === 'ratings') {
    log.payload = JSON.stringify({
      rating: req.body[log.entity][0].rating,
    });
  }

  await db('userActivityLogs').insert(log);
}

proxy.on('proxyRes', logActivity);

proxy.on('proxyReq', function (proxyReq, req) {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
});

//@TODO: implement refresh action in case access token expired.
router.use('/trakt', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next(createError(401));
  }
  proxy.web(
    req,
    res,
    {
      changeOrigin: true,
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
        'trakt-api-key': process.env.TRAKT_TV_CLIENT_ID,
      },
      secure: false,
      target: 'https://api.trakt.tv',
    },
    function (e) {
      console.log(e);
      next(e);
    },
  );
});

module.exports = router;
