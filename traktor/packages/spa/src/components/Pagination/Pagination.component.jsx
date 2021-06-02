import {
  IconButton as MuiIconButton,
  Tooltip as MuiTooltip,
  Typography as MuiTypography,
} from '@material-ui/core';
import {
  ChevronLeft as PreviousPageIcon,
  ChevronRight as NextPageIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

import useStyles from './Pagination.styles';

function Pagination({
  disabled = false,
  hasNextPage,
  hasPreviousPage,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
  page,
  pagesTotal,
  variant = 'wrapped',
}) {
  const isWrapped = variant === 'wrapped';
  const classes = useStyles({ isWrapped });
  const [
    firstPageDisabled,
    previousPageDisabled,
    nextPageDisabled,
    lastPageDisabled,
  ] = [
    disabled || page === 1,
    disabled || !hasPreviousPage,
    disabled || !hasNextPage,
    disabled || page === pagesTotal,
  ];

  return (
    <div className={classes.root}>
      <MuiTooltip title='Go to first page'>
        <span>
          <MuiIconButton
            disabled={firstPageDisabled}
            onClick={onFirstPage}
            size='small'
          >
            <FirstPageIcon />
          </MuiIconButton>
        </span>
      </MuiTooltip>

      <MuiTooltip title='Go to previous page'>
        <span>
          <MuiIconButton
            disabled={previousPageDisabled}
            onClick={onPreviousPage}
            size='small'
          >
            <PreviousPageIcon />
          </MuiIconButton>
        </span>
      </MuiTooltip>

      <MuiTypography variant='caption'>
        Page {page} of {pagesTotal}
      </MuiTypography>

      <MuiTooltip title='Go to next page'>
        <span>
          <MuiIconButton
            disabled={nextPageDisabled}
            onClick={onNextPage}
            size='small'
          >
            <NextPageIcon />
          </MuiIconButton>
        </span>
      </MuiTooltip>

      <MuiTooltip title='Go to last page'>
        <span>
          <MuiIconButton
            disabled={lastPageDisabled}
            onClick={onLastPage}
            size='small'
          >
            <LastPageIcon />
          </MuiIconButton>
        </span>
      </MuiTooltip>
    </div>
  );
}

Pagination.propTypes = {
  disabled: PropTypes.bool,
  hasNextPage: PropTypes.bool.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
  onFirstPage: PropTypes.func.isRequired,
  onLastPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pagesTotal: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['inlined', 'wrapped']),
};

export default Pagination;
