import React from 'react';

import Comment from './Comment/Comment.component';

function renderComment(item) {
  const props = {
    comment: item.comment,
    createdAt: item.created_at,
    id: item.id,
    review: item.review,
    spoiler: item.spoiler,
    username: item.user.username,
    userRating: item.user_rating,
    userSlug: item.user.ids.slug,
  };
  const { id } = props;
  return <Comment key={id} {...props} />;
}

const DEFAULT_SORT_OPTION = 'highest';

const SORT_OPTIONS = [
  ['highest', 'Highest'],
  ['newest', 'Newest'],
  ['likes', 'Likes'],
];

export { DEFAULT_SORT_OPTION, renderComment, SORT_OPTIONS };
