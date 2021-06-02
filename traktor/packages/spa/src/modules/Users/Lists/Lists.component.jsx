import {
  Box as MuiBox,
  Button as MuiButton,
  Grid as MuiGrid,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import List from '../../../components/Lists/List/List.component';
import TileGroup from '../../../components/tiles/TileGroup/TileGroup.component';
import { selectLists } from '../../../redux/modules/users/lists/lists.selectors';
import { fetchLists } from '../../../redux/modules/users/lists/lists.slice';
import { getUserSlug } from '../../../utils';

function Lists() {
  const { userSlug } = useParams();
  const dispatch = useDispatch();
  const lists = useSelector(selectLists);
  useEffect(() => {
    dispatch(fetchLists({ userSlug }));
  }, [dispatch, userSlug]);

  return (
    <MuiBox p={2}>
      {/* TODO: Add empty design component */}
      {!lists.length && 'No lists found.'}
      {userSlug === getUserSlug() && (
        <MuiBox mb={2} textAlign='right'>
          <MuiButton
            color='secondary'
            component={Link}
            to='?addList'
            variant='outlined'
          >
            Add list
          </MuiButton>
        </MuiBox>
      )}
      {lists.map((list) => (
        <MuiGrid container item key={list.ids.slug} spacing={2}>
          <MuiGrid item>
            <MuiBox width={368}>
              <TileGroup items={list.items.slice(0, 5)} />
            </MuiBox>
          </MuiGrid>
          <MuiGrid item xs>
            <List
              description={list.description}
              listSlug={list.ids.slug}
              name={list.name}
              privacy={list.privacy}
              username={list.user.username}
              userSlug={list.user.ids.slug}
            />
          </MuiGrid>
        </MuiGrid>
      ))}
    </MuiBox>
  );
}

export default Lists;
