import {
  Collapse as MuiCollapse,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import useStyles from './CollapsingListItem.styles';

function CollapsingListItem({ children, listItemTextProps, ...props }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    setOpen(!open);
  }

  function renderChildren() {
    return React.Children.map(children, function (child) {
      return React.cloneElement(child, {
        classes: { gutters: classes.nestedListItemGutters },
      });
    });
  }

  return (
    <>
      <MuiListItem {...props} onClick={handleClick}>
        <MuiListItemText {...listItemTextProps} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </MuiListItem>
      <MuiCollapse in={open}>
        <MuiList disablePadding>{renderChildren()}</MuiList>
      </MuiCollapse>
    </>
  );
}

CollapsingListItem.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CollapsingListItem;
