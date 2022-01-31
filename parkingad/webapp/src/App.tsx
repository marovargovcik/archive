import { LoadingButton } from '@mui/lab';
import { Box, CircularProgress, Grid, TextField } from '@mui/material';
import type { Spot as TSpot } from 'parkingad-helpers/types';
import type { ChangeEvent } from 'react';
import { useEffect, useCallback, useMemo, useState } from 'react';

import { PostPaymentScreen } from './components/PostPaymentScreen';

import { SelectedSpot } from '@/components/SelectedSpot';
import { Spot } from '@/components/Spot';
import { useAds } from '@/hooks/useAds';
import { useSpots } from '@/hooks/useSpots';

const App = () => {
  const { data: advertisements, refetch: refetchAdvertisements } = useAds();
  const { data: spots, loading, refetch } = useSpots();
  const [postPaymentScreen, setPostPaymentScreen] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<TSpot | null>(null);

  const filteredSpots = useMemo(
    () =>
      spots.filter(({ name }) =>
        name.toLowerCase().startsWith(filter.toLowerCase())
      ),
    [filter, spots]
  );

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    []
  );

  const handleSpotReserve = useCallback(
    (spot: TSpot) => setSelectedSpot(spot),
    []
  );

  const handleSelectedSpotClose = useCallback(() => setSelectedSpot(null), []);

  const handlePostPaymentScreenClose = useCallback(
    () => setPostPaymentScreen(false),
    []
  );

  useEffect(() => {
    if (window.location.pathname === '/payment/thank-you') {
      setPostPaymentScreen(true);
    }
  }, []);

  useEffect(() => {
    setInterval(() => refetchAdvertisements(), 120_000);
  }, [refetchAdvertisements]);

  return (
    <Box padding={2} paddingBottom='80px' position='relative'>
      {loading && (
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            left: 0,
            minHeight: '100vh',
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1,
          }}
        >
          <CircularProgress
            sx={{
              height: '96px',
              width: '96px',
            }}
          />
        </Box>
      )}

      <Grid
        alignItems='center'
        container
        justifyContent='space-between'
        spacing={2}
      >
        <Grid item xs='auto'>
          <TextField
            label='Filter parking spots'
            onChange={handleFilterChange}
            size='small'
            sx={{
              marginBottom: 2,
            }}
            value={filter}
          />
        </Grid>
        <Grid container item spacing={2} xs='auto'>
          <LoadingButton loading={loading} onClick={refetch} variant='outlined'>
            Refresh
          </LoadingButton>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredSpots.map((spot) => (
          <Grid
            item
            key={spot.name}
            sx={{
              filter: loading ? 'blur(1px)' : 'unset',
            }}
            xs={12}
          >
            <Spot {...spot} onReserve={handleSpotReserve} />
          </Grid>
        ))}
      </Grid>

      {postPaymentScreen && (
        <PostPaymentScreen onClose={handlePostPaymentScreenClose} />
      )}

      {selectedSpot && (
        <SelectedSpot {...selectedSpot} onClose={handleSelectedSpotClose} />
      )}

      <Box
        dangerouslySetInnerHTML={{ __html: advertisements }}
        sx={{
          borderRadius: 1,
          bottom: 0,
          left: 0,
          overflow: 'hidden',
          position: 'fixed',
          width: '100%',
        }}
      />
    </Box>
  );
};

export default App;
