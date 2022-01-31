import { Box, Button, Paper, Typography } from '@mui/material';
import type { Spot as TSpot } from 'parkingad-helpers/types';
import { useCallback, memo } from 'react';

type SpotProps = TSpot & {
  onReserve: (spot: TSpot) => void;
};

const Spot = memo(({ onReserve, ...spot }: SpotProps) => {
  const { current, max, name } = spot;
  const handleReserve = useCallback(() => {
    onReserve(spot);
  }, [onReserve, spot]);

  return (
    <Paper
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        padding: 2,
      }}
    >
      <Typography
        sx={{
          flex: 1,
        }}
        variant='h6'
      >
        {name}
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Typography
          sx={{
            marginRight: 2,
          }}
          variant='caption'
        >
          {Number.parseInt(max, 10) - Number.parseInt(current, 10)} left
        </Typography>
        <Button onClick={handleReserve} variant='outlined'>
          Reserve
        </Button>
      </Box>
    </Paper>
  );
});

export { Spot };
