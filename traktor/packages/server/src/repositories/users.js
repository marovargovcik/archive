const createError = require('http-errors');
const { db, trakt } = require('../clients');

async function createOrUpdateUser({ refreshToken, slug, uuid }) {
  const user = await getUserByUuid(uuid);
  if (user) {
    return updateUser({ refreshToken, slug, uuid });
  }
  await createUser({ refreshToken, slug, uuid });
  return {
    refreshToken,
    uuid,
  };
}

async function createUser({ refreshToken, slug, uuid }) {
  return db('users').insert({
    refreshToken,
    slug,
    uuid,
  });
}

async function getUserByUuid(uuid, throwIfNotFound = false) {
  const user = db('users').where({ uuid }).first();
  if (throwIfNotFound && !user) {
    throw createError(404, `User with uuid ${uuid} was not found.`);
  }
  return user;
}

async function getUserBySlug(slug, throwIfNotFound = false) {
  const user = await db('users').where({ slug }).first();
  if (throwIfNotFound && !user) {
    throw createError(404, `User with slug ${slug} was not found.`);
  }
  return user;
}

async function getUserDetails(accessToken) {
  const response = await trakt.get('/users/settings', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.user.ids;
}

async function updateUser({ refreshToken, slug, uuid }) {
  await db('users').where({ uuid }).update({ refreshToken, slug });
}

module.exports = {
  createOrUpdateUser,
  createUser,
  getUserBySlug,
  getUserByUuid,
  getUserDetails,
  updateUser,
};
