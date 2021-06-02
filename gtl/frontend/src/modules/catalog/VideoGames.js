import {
  Table as MuiTable,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
} from '@material-ui/core';
import { Helmet } from 'react-helmet';

import { useVideoGames } from '../../hooks/queries/useVideoGames';

const VideoGames = () => {
  const query = useVideoGames();
  const videoGames = query.data || [];

  return (
    <>
      <Helmet>
        <title>Video games | Catalog</title>
      </Helmet>
      <MuiTableContainer>
        <MuiTable size='small'>
          <MuiTableHead>
            <MuiTableRow>
              <MuiTableCell>ID</MuiTableCell>
              <MuiTableCell>Title</MuiTableCell>
              <MuiTableCell>Developer</MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {videoGames.map(({ _id, developer, title }) => (
              <MuiTableRow hover key={_id}>
                <MuiTableCell>{_id}</MuiTableCell>
                <MuiTableCell>{title}</MuiTableCell>
                <MuiTableCell>{developer}</MuiTableCell>
              </MuiTableRow>
            ))}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
    </>
  );
};

export { VideoGames };
