import {
	Typography,
	Box,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material'

import { ChangeEvent, useState } from 'react'
import { CryptoOrderStatus } from 'src/models/crypto_order'


interface Filters {
	status?: CryptoOrderStatus
}

function PageHeader() {

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
						Thông Báo
					</Typography>
					<Typography variant="subtitle2">
						Thông báo từ Quản Trị Viên
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
