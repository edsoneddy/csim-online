import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { formatBytes, formatDate } from './formatters';

const GroupFilesTable = ({ files }) => {
  return (
    <Box sx={{ p: 0, borderTop: '1px solid #2D3748', bgcolor: '#0F1419' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#8892B0', borderBottom: '1px solid #2D3748', py: 1.5 }}>
              Name
            </TableCell>
            <TableCell sx={{ color: '#8892B0', borderBottom: '1px solid #2D3748', py: 1.5 }}>
              Size
            </TableCell>
            <TableCell sx={{ color: '#8892B0', borderBottom: '1px solid #2D3748', py: 1.5 }}>
              Last Modified
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, idx) => (
            <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ borderBottom: '1px solid #2D3748', py: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InsertDriveFileIcon fontSize="small" sx={{ color: '#4da8da' }} />
                  <Typography variant="body2" sx={{ color: '#F0F4F8' }}>
                    {file.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ color: '#8892B0', borderBottom: '1px solid #2D3748' }}>
                {formatBytes(file.size)}
              </TableCell>
              <TableCell sx={{ color: '#8892B0', borderBottom: '1px solid #2D3748' }}>
                {formatDate(file.date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default GroupFilesTable;
