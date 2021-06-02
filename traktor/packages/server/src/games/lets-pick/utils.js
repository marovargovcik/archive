const Joi = require('joi');

const ERRORS = {
  INVALID_VOTE_ACTION: 'INVALID_VOTE_ACTION',
  ITEMS_VALIDATION_ERROR: 'ITEMS_VALIDATION_ERROR',
  NOT_ENOUGH_USERS_IN_ROOM: 'NOT_ENOUGH_USERS_IN_ROOM',
  ROOM_ALREADY_EXISTS: 'ROOM_ALREADY_EXISTS',
  ROOM_ALREADY_STARTED: 'ROOM_ALREADY_STARTED',
  ROOM_DOES_NOT_EXIST: 'ROOM_DOES_NOT_EXIST',
  ROOM_NOT_STARTED: 'ROOM_NOT_STARTED',
  USER_ALREADY_IN_ROOM: 'USER_ALREADY_IN_ROOM',
  USER_NOT_IN_ROOM: 'USER_NOT_IN_ROOM',
  USER_NOT_PERMITTED: 'USER_NOT_PERMITTED',
};

const MESSAGES = {
  ROOM_DISBANDED_OWNER_LEFT: 'ROOM_DISBANDED_OWNER_LEFT',
  ROOM_DISBANDED_USER_LEFT: 'ROOM_DISBANDED_USER_LEFT',
};

const entitySchema = Joi.object({
  ids: Joi.object({
    slug: Joi.string().required(),
  }).unknown(true),
  title: Joi.string().required(),
}).unknown(true);

const schema = Joi.array()
  .min(2)
  .max(10)
  .items(
    Joi.object({
      movie: entitySchema.when('type', {
        is: 'movie',
        otherwise: Joi.forbidden(),
        then: Joi.required(),
      }),
      score: Joi.number(),
      show: entitySchema.when('type', {
        is: 'show',
        otherwise: Joi.forbidden(),
        then: Joi.required(),
      }),
      type: Joi.string().required().valid('movie', 'show'),
    }),
  );

function validateItems(items) {
  const { error } = schema.validate(items);
  if (error) {
    throw Error(error.toString());
  }
}

module.exports = {
  ERRORS,
  MESSAGES,
  validateItems,
};
