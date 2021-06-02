import {
  Box as MuiBox,
  Divider as MuiDivider,
  Drawer as MuiDrawer,
  Grid as MuiGrid,
  List as MuiList,
  Typography as MuiTypography,
} from '@material-ui/core';
import React from 'react';
import { Outlet } from 'react-router-dom';

import Notifications from '../Notifications/Notifications.component';
import useStyles from './Layout.styles';
import { renderListItems } from './Layout.utils';

function Layout() {
  const classes = useStyles();

  return (
    <MuiGrid>
      <MuiDrawer
        anchor='left'
        classes={{
          paper: classes.drawerPaper,
        }}
        color=''
        variant='permanent'
      >
        <MuiBox px={2} py={1}>
          <MuiTypography variant='h6'>Traktor</MuiTypography>
          <MuiTypography variant='caption'>v0.1</MuiTypography>
        </MuiBox>
        <MuiDivider />
        <MuiList disablePadding>{renderListItems()}</MuiList>
      </MuiDrawer>
      <MuiBox ml={32}>
        <Notifications />
        <Outlet />
      </MuiBox>
    </MuiGrid>
  );
}

export default Layout;
