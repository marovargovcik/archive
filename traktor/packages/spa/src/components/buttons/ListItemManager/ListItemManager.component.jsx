import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  IconButton as MuiIconButton,
  LinearProgress as MuiLinearProgress,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemIcon as MuiListItemAction,
  ListItemText as MuiListItemText,
  ListSubheader as MuiListSubheader,
  Popover as MuiPopover,
  Tooltip as MuiTooltip,
} from '@material-ui/core';
import { List as ListIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  addToListAndRefetch,
  removeFromListAndRefetch,
} from '../../../redux/actions/list';
import { selectListsForManagerFactory } from '../../../redux/app/lists/lists.selectors';
import { selectLoadingFlagsReducedFactory } from '../../../redux/loading/loading.selectors';
import useStyles from './ListItemManager.styles';

function ListItemManager({ entity, size = 'default', slug }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const listsSelector = useMemo(selectListsForManagerFactory, []);
  const fetchingSelector = useMemo(selectLoadingFlagsReducedFactory, []);
  const fetching = useSelector((state) =>
    fetchingSelector(state, [
      'app/lists/fetch',
      'actions/list/add',
      'actions/list/remove',
    ]),
  );
  const lists = useSelector((state) => listsSelector(state, entity, slug));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const listedOnCount = useMemo(
    () => lists.filter(({ listed }) => Boolean(listed)).length,
    [lists],
  );

  function handleOpen(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  //@TODO: catch in case recommendation failed
  function handleClick(entity, listed, listSlug) {
    return function () {
      let fn = addToListAndRefetch;
      if (listed) {
        fn = removeFromListAndRefetch;
      }
      dispatch(fn({ entity, listSlug, slug }));
    };
  }

  let button = (
    <MuiButton
      color='secondary'
      disabled={fetching}
      fullWidth
      onClick={handleOpen}
      startIcon={<ListIcon />}
      variant={listedOnCount ? 'contained' : 'outlined'}
    >
      {listedOnCount ? `Listed on ${listedOnCount} lists` : 'Add to your lists'}
    </MuiButton>
  );

  if (size === 'small') {
    button = (
      <MuiTooltip
        title={
          listedOnCount
            ? `Listed on ${listedOnCount} lists`
            : 'Add to your lists'
        }
      >
        <MuiIconButton
          color={listedOnCount ? 'secondary' : 'inherit'}
          onClick={handleOpen}
          size='small'
        >
          <ListIcon fontSize='small' />
        </MuiIconButton>
      </MuiTooltip>
    );
  }

  return (
    <>
      {button}
      <MuiPopover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
      >
        {fetching && <MuiLinearProgress color='secondary' />}
        <MuiList
          dense
          subheader={
            <MuiListSubheader>
              Listed on {listedOnCount} of {lists.length} lists
            </MuiListSubheader>
          }
        >
          {lists.map(({ listed, name, slug }) => (
            <MuiListItem
              button
              disabled={fetching}
              key={slug}
              onClick={handleClick(entity, listed, slug)}
            >
              <MuiListItemAction
                classes={{
                  root: classes.listItemActionRoot,
                }}
              >
                <MuiCheckbox
                  checked={listed}
                  disableRipple
                  edge='start'
                  size='small'
                />
              </MuiListItemAction>
              <MuiListItemText>{name}</MuiListItemText>
            </MuiListItem>
          ))}
          <MuiListItem button component={Link} to='?addList'>
            <MuiListItemAction
              classes={{
                root: classes.listItemActionRoot,
              }}
            />
            <MuiListItemText>Add list</MuiListItemText>
          </MuiListItem>
        </MuiList>
      </MuiPopover>
    </>
  );
}

ListItemManager.propTypes = {
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  size: PropTypes.oneOf(['default', 'small']),
  slug: PropTypes.string.isRequired,
};

export default ListItemManager;
