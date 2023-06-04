import {
	Grid,
	Typography,
	CardContent,
	Card,
	Box,
	Divider,
	Button,
	Snackbar,
	Alert
} from '@mui/material'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import Text from 'src/components/Text'
import Label from 'src/components/Label'
import { useState } from 'react'
import EditMail from './EditMail'

function EditProfileTab({ user }) {
	const [open, setOpen] = useState(false)
	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setOpen(false)
	}

	const status = () => {
		if (user.status === true)
			return (
				<Label color="success">
					<b>Đã xác nhận</b>
				</Label>
			)
		else return (
			<Label color="error">
				<b>Chưa xác nhận</b>
			</Label>
		)
	}
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Card>
					<Box
						p={3}
						display="flex"
						alignItems="center"
						justifyContent="space-between"
					>
						<Box>
							<Typography variant="h4" gutterBottom>
								Thông tin cá nhân
							</Typography>
							<Typography variant="subtitle2">
								Quản lý thông tin chi tiết cá nhân của bạn
							</Typography>
						</Box>
						<Button variant="text" startIcon={<EditTwoToneIcon />}>
							Chỉnh sửa
						</Button>
					</Box>
					<Divider />
					<CardContent sx={{ p: 4 }}>
						<Typography variant="subtitle2">
							<Grid container spacing={0}>
								<Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
									<Box pr={3} pb={2}>
										Tên hiển thị:
									</Box>
								</Grid>
								<Grid item xs={12} sm={8} md={9}>
									<Text color="black">
										<b>{user.name}</b>
									</Text>
								</Grid>
								<Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
									<Box pr={3} pb={2}>
										Ngày sinh:
									</Box>
								</Grid>
								<Grid item xs={12} sm={8} md={9}>
									<Text color="black">
										<b>19/07/2001</b>
									</Text>
								</Grid>
								<Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
									<Box pr={3} pb={2}>
										Tỉnh / Thành phố:
									</Box>
								</Grid>
								<Grid item xs={12} sm={8} md={9}>
									<Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
										<Text color="black">
											Thừa Thiên Huế
										</Text>
									</Box>
								</Grid>
							</Grid>
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12}>
				<Card>
					<Box
						p={3}
						display="flex"
						alignItems="center"
						justifyContent="space-between"
					>
						<Box>
							<Typography variant="h4" gutterBottom>
								Trạng thái
							</Typography>
							<Typography variant="subtitle2">
								Quản lí địa chỉ email của bạn
							</Typography>
						</Box>
						<EditMail success={setOpen} />
					</Box>
					<Divider />
					<CardContent sx={{ p: 4 }}>
						<Typography variant="subtitle2">
							<Grid container spacing={0}>
								<Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
									<Box pr={3} pb={2}>
										Trạng thái:
									</Box>
								</Grid>
								<Grid item xs={12} sm={8} md={9}>
									{status()}
								</Grid>
								<Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
									<Box pr={3} pb={2}>
										Email:
									</Box>
								</Grid>
								<Grid item xs={12} sm={8} md={9}>
									<Text color="black">
										<b>{user.email}</b>
									</Text>
								</Grid>
							</Grid>
						</Typography>
					</CardContent>
				</Card>
			</Grid>


			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert icon={false} color="success">Thay đổi email thành công</Alert>
			</Snackbar>

		</Grid >
	);
}

export default EditProfileTab;
