import { type ChangeEventHandler, useCallback, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import { Chakra } from './variants/chakra/chakra';
import { Mui } from './variants/mui/mui';
import { URL } from './variants/url/url';
import { Vanilla } from './variants/vanilla/vanilla';

type TVariant = 'chakra' | 'mui' | 'url' | 'vanilla';

const App = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = useState<TVariant>('vanilla');

  const handleVariantChange = useCallback<
    ChangeEventHandler<HTMLSelectElement>
  >(
    (event) => {
      setVariant(event.target.value as TVariant);
      navigate(`/${event.target.value}`);
    },
    [navigate]
  );

  return (
    <>
      <label htmlFor='variant'>Variant:</label>
      <select id='variant' onChange={handleVariantChange} value={variant}>
        <option value='vanilla'>Vanilla</option>
        <option value='mui'>MUI</option>
        <option value='chakra'>Chakra</option>
        <option value='url'>URL</option>
      </select>
      <div>
        <Routes>
          <Route element={<Navigate replace to='vanilla' />} path='' />
          <Route element={<Vanilla />} path='vanilla' />
          <Route element={<Mui />} path='mui' />
          <Route element={<Chakra />} path='chakra' />
          <Route element={<URL />} path='url' />
        </Routes>
      </div>
    </>
  );
};

const Providers = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export { Providers as App };
