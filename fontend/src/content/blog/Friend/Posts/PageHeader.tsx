import {
	Typography,
	Box,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	styled
} from '@mui/material'

import { ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom';
import { CryptoOrderStatus } from 'src/models/crypto_order'

const CountFriend = styled(Link)(
	() => `
	color: #888888;
    text-decoration: none;`
)

function PageHeader(props: { count: number }) {
	return (
		<>
			<Grid container justifyContent="space-between" alignItems="center">
				<Grid item>
					<Typography variant="h3" component="h3" gutterBottom>
						Bài Viết
					</Typography>
					<Typography variant="subtitle2">
						Tất Cả Bài Viết Của Bạn Bè
					</Typography>

				</Grid>
				<Grid item>
					<Box width={150} textAlign='end'>
						<CountFriend to="../list">
							{props.count} bạn bè
						</CountFriend>
					</Box>
				</Grid>
			</Grid>
		</>
	);
}

export default PageHeader;
