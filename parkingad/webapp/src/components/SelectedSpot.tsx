import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Rating,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type { Place as TPlace, Spot as TSpot } from 'parkingad-helpers/types';
import { memo, useState } from 'react';

import { usePlaces } from '@/hooks/usePlaces';
import { API } from '@/utils/constants';

type SelectedSpotProps = TSpot & {
  onClose: () => void;
};

const Place = memo((place: TPlace) => {
  let image = '';
  if (place.type.includes('accomodation')) {
    image =
      'https://www.baglionihotels.com/wp-content/themes/baglioni-hotels-new/images/schema/baglioni-hotel-london.jpg';
  } else if (place.type.includes('bar')) {
    image =
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80';
  } else if (place.type.includes('pub')) {
    image =
      'https://live-production.wcms.abc-cdn.net.au/0109f592f4609b822cbf9a63833310ef?impolicy=wcms_crop_resize&cropH=1997&cropW=3000&xPos=0&yPos=0&width=862&height=575';
  } else {
    image =
      'https://media.istockphoto.com/photos/varied-food-carbohydrates-protein-vegetables-fruits-dairy-legumes-on-picture-id1218254547?b=1&k=20&m=1218254547&s=170667a&w=0&h=mOEC7x7qU5NC78mCULs-jAPeLkxy8opOvIbGSnwmAyw=';
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={place.name} />
      <CardMedia alt='place' component='img' height='194' image={image} />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Typography
            sx={{
              marginRight: 0.4,
            }}
            variant='subtitle1'
          >
            {place.rating}
          </Typography>
          <Rating readOnly size='small' value={place.rating} />
        </Box>
        <Typography color='textSecondary' variant='caption'>
          {place.address}
        </Typography>
        <Typography
          color='textSecondary'
          sx={{
            marginBottom: 0.5,
          }}
          variant='caption'
        >
          {place.openingHours}
        </Typography>
        <Grid container spacing={0.4}>
          {place.categories.map((category) => (
            <Grid item key={category}>
              <Chip label={category} size='small' variant='outlined' />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
});

type FormProps = {
  parking: TSpot['name'];
};

const Form = memo(({ parking }: FormProps) => {
  return (
    <Grid
      action={`${API}/payments`}
      component='form'
      container
      method='POST'
      spacing={2}
      sx={{ marginBottom: 2, paddingTop: 1 }}
    >
      <input name='item' required type='hidden' value={parking} />
      <Grid item>
        <TextField label='First name' name='firstName' required size='small' />
      </Grid>

      <Grid item>
        <TextField label='Last name' name='lastName' required size='small' />
      </Grid>

      <Grid item>
        <TextField label='Email' name='email' required size='small' />
      </Grid>

      <Grid item>
        <Button type='submit' variant='outlined'>
          To payment
        </Button>
      </Grid>
    </Grid>
  );
});

const SelectedSpot = memo(({ name, onClose }: SelectedSpotProps) => {
  const { data: places } = usePlaces(name);
  const [selectedPlaceType, setSelectedPlaceType] = useState<
    'accomodation' | 'all' | 'bar' | 'pub' | 'restaurant'
  >('all');

  const filteredPlaces = places.filter(
    ({ type }) =>
      selectedPlaceType === 'all' || type.includes(selectedPlaceType)
  );

  const handleSelectedPlaceTypeChange = (
    _: unknown,
    selectedPlaceType: 'accomodation' | 'all' | 'bar' | 'pub' | 'restaurant'
  ) => {
    if (selectedPlaceType === null) {
      return;
    }

    setSelectedPlaceType(selectedPlaceType);
  };

  return (
    <Dialog fullWidth maxWidth='xl' onClose={onClose} open>
      <DialogTitle>{name}</DialogTitle>
      <DialogContent>
        <Form parking={name} />
        <Box
          sx={{
            marginBottom: 2,
            textAlign: 'right',
          }}
        >
          <ToggleButtonGroup
            exclusive
            onChange={handleSelectedPlaceTypeChange}
            size='small'
            value={selectedPlaceType}
          >
            <ToggleButton value='all'>All</ToggleButton>
            <ToggleButton value='accomodation'>Accomodation</ToggleButton>
            <ToggleButton value='bar'>Bar</ToggleButton>
            <ToggleButton value='pub'>Pub</ToggleButton>
            <ToggleButton value='restaurant'>Restaurant</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={1}>
          {filteredPlaces.map((place) => (
            <Grid item key={place.name} xs={3}>
              <Place {...place} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export { SelectedSpot };
