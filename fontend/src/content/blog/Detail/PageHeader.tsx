import { Typography, Button, Grid } from '@mui/material';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  useTheme,
  CardHeader
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { CryptoOrder, CryptoOrderStatus } from 'src/models/crypto_order';

interface Filters {
  status?: CryptoOrderStatus;
}

function PageHeader() {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
  
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const statusOptions = [
    {
      id: 'day',
      name: 'Ngày Đăng'
    },
    {
      id: 'like',
      name: 'Lượt Thích'
    },
    {
      id: 'comment',
      name: 'Bình Luận'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'day') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  }

  return (
    <>
        <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
      <Typography variant="h3" component="h3" gutterBottom>
        Chi Tiết
      </Typography>
      <Typography variant="subtitle2">
        {user.name}, Thông báo từ Quản Trị Viên
      </Typography>

      </Grid>
      <Grid item>
      <Box width={150}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sắp Xếp</InputLabel>
            <Select
              value={filters.status || 'day'}
              onChange={handleStatusChange}
              label="Sắp Xếp"
              autoWidth
            >
              {statusOptions.map((statusOption) => (
                <MenuItem key={statusOption.id} value={statusOption.id}>
                  {statusOption.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
    </>
  );
}

export default PageHeader;
