const createError = require('http-errors');
const { getUserBySlug } = require('./users');
const { db } = require('../clients');

//@TODO: Can this be done in a single query?
async function getFollowers(slug) {
  const user = await getUserBySlug(slug, true);
  return db('userFollowers')
    .where({ userUuid: user.uuid })
    .innerJoin('users', 'users.uuid', 'userFollowers.followerUuid')
    .select('users.uuid', 'users.slug');
}

//@TODO: Can this be done in a single query?
async function getFollowing(slug) {
  const user = await getUserBySlug(slug, true);
  return db('userFollowers')
    .where({ followerUuid: user.uuid })
    .innerJoin('users', 'users.uuid', 'userFollowers.userUuid')
    .select('users.uuid', 'users.slug');
}

async function getRecord({ followerUuid, userUuid }, throwIfNotFound = false) {
  const record = db('userFollowers')
    .where({
      followerUuid,
      userUuid,
    })
    .first();
  if (throwIfNotFound && !record) {
    throw createError(404, 'User followers record not found');
  }
  return record;
}

async function unfollow({ followerUuid, slug }) {
  const user = await getUserBySlug(slug, true);
  await db('userFollowers')
    .where({
      followerUuid,
      userUuid: user.uuid,
    })
    .delete();
}

async function follow({ followerUuid, slug }) {
  const user = await getUserBySlug(slug, true);
  const result = await getRecord({ followerUuid, userUuid: user.uuid });
  if (!result) {
    await db('userFollowers').insert({
      followerUuid,
      userUuid: user.uuid,
    });
  }
}

module.exports = {
  follow,
  getFollowers,
  getFollowing,
  getRecord,
  unfollow,
};
