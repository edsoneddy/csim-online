import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { formatBytes, formatDate } from './formatters';

const GroupFilesTable = ({ files }) => {
  return (
    <Box
      sx={{ p: 0, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}
    >
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 480 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 1.5,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 1.5,
                }}
              >
                Size
              </TableCell>
              <TableCell
                sx={{
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 1.5,
                }}
              >
                Last Modified
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, idx) => (
              <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InsertDriveFileIcon fontSize="small" sx={{ color: 'primary.light' }} />
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {file.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    color: 'text.secondary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {formatBytes(file.size)}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'text.secondary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {formatDate(file.date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupFilesTable;
