const { db } = require('../clients');

async function getFeed(uuid) {
  return db('userActivityLogs as uA')
    .innerJoin('userFollowers as uF', 'uF.userUuid', 'uA.userUuid')
    .innerJoin('users as u', 'u.uuid', 'uF.userUuid')
    .where({ 'uF.followerUuid': uuid })
    .orderBy('uA.createdAt', 'desc')
    .select(
      'u.slug as userSlug',
      'uA.uuid',
      'uA.type',
      'uA.createdAt',
      'uA.entity',
      'uA.slug',
      'uA.payload',
    );
}

module.exports = {
  getFeed,
};
