import { Box as MuiBox, Grid as MuiGrid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import { renderTileBasedOnType } from '../../../utils';
import useStyles from './TileGroup.styles';

function TileGroup({ items }) {
  const classes = useStyles();
  const rootRef = useRef();
  const [width, setWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(items.length - 1);

  function handleResize() {
    setWidth(rootRef.current.clientWidth);
  }

  useEffect(() => {
    if (rootRef.current) {
      setWidth(rootRef.current.clientWidth);
      window.addEventListener('resize', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [rootRef]);

  function handleItemHover(index) {
    return function () {
      setHoveredIndex(index);
    };
  }

  function handleMouseLeave() {
    setHoveredIndex(items.length - 1);
  }

  return (
    <MuiGrid
      container
      direction='row-reverse'
      onMouseLeave={handleMouseLeave}
      ref={rootRef}
      title={width}
    >
      {items.map((item, index) => (
        <MuiBox
          className={classes.item}
          display='inline-block'
          key={index}
          onMouseOver={handleItemHover(index)}
          overflow='hidden'
          width={index === hoveredIndex ? '52%' : '12%'}
        >
          {renderTileBasedOnType(item, MuiBox, { width: width * 0.52 + 'px' })}
        </MuiBox>
      ))}
    </MuiGrid>
  );
}

TileGroup.propTypes = {
  items: PropTypes.array.isRequired,
};

export default TileGroup;
