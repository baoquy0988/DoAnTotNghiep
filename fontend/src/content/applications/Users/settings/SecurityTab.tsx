import { useState, MouseEvent, ChangeEvent, useEffect } from 'react';
import {
	Box,
	Typography,
	Card,
	Grid,
	ListItem,
	List,
	ListItemText,
	Divider,
	Button,
	ListItemAvatar,
	Avatar,
	Switch,
	CardHeader,
	Tooltip,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableContainer,
	useTheme,
	styled,
	Alert,
	AlertProps,
	AlertColor,
} from '@mui/material';

import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format, subHours, subWeeks, subDays } from 'date-fns';
import Label from 'src/components/Label';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AuthSocket from 'src/api/socket/authSocket';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress'
import EditPass from './EditPassword';

const AvatarWrapper = styled(Avatar)(
	({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function SecurityTab({ user }) {
	const theme = useTheme();

	const [page, setPage] = useState(2);
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [open, setOpen] = useState(false)

	const [time, setTime] = useState(6000 * 6000)
	const [type, setType] = useState<AlertColor>("info")
	const [text, setText] = useState("Đang gửi tin nhắn xác thực qua mail")

	//Thời gian gửi tin nhắn xác thực
	const [request, setRequest] = useState(-1)

	const [openSnack, setOpenSnack] = useState(false)


	const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {

		setOpenSnack(false)
	};


	useEffect(() => {
		if (request > -1) {
			setTimeout(() => {
				setRequest(request - 1)
			}, 1000)
		}
	}, [request])


	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	};
	const handleChangePage = (
		event: MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage)
	};

	const handleChangeRowsPerPage = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const logs = [
		{
			id: 1,
			browser: ' Safari/537.36',
			ipaddress: '3.70.73.142',
			location: 'United States',
			date: subDays(new Date(), 2).getTime()
		},
		{
			id: 2,
			browser: 'Chrome/36.0.1985.67',
			ipaddress: '138.13.136.179',
			location: 'China',
			date: subDays(new Date(), 6).getTime()
		},
		{
			id: 3,
			browser: 'Googlebot/2.1',
			ipaddress: '119.229.170.253',
			location: 'China',
			date: subHours(new Date(), 15).getTime()
		},
		{
			id: 4,
			browser: 'AppleWebKit/535.1',
			ipaddress: '206.8.99.49',
			location: 'Philippines',
			date: subDays(new Date(), 4).getTime()
		},
		{
			id: 5,
			browser: 'Mozilla/5.0',
			ipaddress: '235.40.59.85',
			location: 'China',
			date: subWeeks(new Date(), 3).getTime()
		}
	]

	function onClickRequestEmail() {

		setOpen(true)
		setTime(6000 * 6000)
		setType("info")
		setText("Đang gửi tin nhắn xác thực qua mail")

		const status = AuthSocket.request()
		status.then((res) => {
			if (res === -1) {
				setTime(4000)
				setType('success')
				setText("Kiểm tra email để kích hoạt")
				setRequest(60)
			} else {
				setTime(4000)
				setType('warning')
				setText(`Vui lòng đợi ${res} giây`)
				setRequest(res)
			}

		}).catch(() => {
			setTime(4000)
			setType('error')
			setText("Lỗi gửi tin nhắn xác thực")
		})

	}

	const status = () => {
		if (user.status === true)
			return (
				<Label color="success">
					<b>Đã xác nhận</b>
				</Label>
			)
		else if (request <= 0)
			return (
				<Button color="error" size="large" variant="contained"
					onClick={() => onClickRequestEmail()}>
					Kích hoạt
				</Button>
			)
		else return (
			<Button color="error" size="large" variant="contained" disabled
				onClick={() => onClickRequestEmail()}>
				{request}
			</Button>
		)
	}
	return (
		<Grid container spacing={3}>
			<Snackbar
				open={open}
				autoHideDuration={time}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

			>
				<Alert color={type} severity={type}>
					<Grid container alignItems='center'>
						<Grid item pr={2}>
							{text}
						</Grid>
						<Grid item>
							{type === "info" ? <CircularProgress size={20} /> : <></>}
						</Grid>
					</Grid>
				</Alert>
			</Snackbar>

			<Snackbar
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				open={openSnack}
				autoHideDuration={6000}
				onClose={handleCloseSnack}
			>
				<Alert icon={false} color="success">Thay Đổi Mật Khẩu Thành Công</Alert>
			</Snackbar>

			<Grid item xs={12}>
				<Box pb={2}>
					<Typography variant="h3">Tài khoản</Typography>
					<Typography variant="subtitle2">
						Thông tin mạng xã hội liên kết - mật khẩu
					</Typography>
				</Box>
				<Card>
					<List>
						<ListItem sx={{ p: 3 }}>
							<ListItemAvatar sx={{ pr: 2 }}>
								<AvatarWrapper src="/static/images/logo/google.svg" />
							</ListItemAvatar>
							<ListItemText
								primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
								secondaryTypographyProps={{
									variant: 'subtitle2',
									lineHeight: 1
								}}
								primary="Email"
								secondary="Tài khoản email được thêm vào tài khoản"
							/>
							{status()}
						</ListItem>

						<ListItem sx={{ p: 3 }}>
							<ListItemText
								primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
								secondaryTypographyProps={{
									variant: 'subtitle2',
									lineHeight: 1
								}}
								primary="Đổi mật khẩu"
								secondary="Bạn có thể thay đổi mật khẩu ở đây"
							/>
							<EditPass success={setOpenSnack} />
						</ListItem>
					</List>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Card>
					<CardHeader
						subheaderTypographyProps={{}}
						titleTypographyProps={{}}
						title="Đăng nhập"
						subheader="Lịch sử đăng nhập của tài khoản"
					/>
					<Divider />
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Browser</TableCell>
									<TableCell>IP Address</TableCell>
									<TableCell>Location</TableCell>
									<TableCell>Date/Time</TableCell>
									<TableCell align="right">Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{logs.map((log) => (
									<TableRow key={log.id} hover>
										<TableCell>{log.browser}</TableCell>
										<TableCell>{log.ipaddress}</TableCell>
										<TableCell>{log.location}</TableCell>
										<TableCell>
											{format(log.date, 'dd MMMM, yyyy - h:mm:ss a')}
										</TableCell>
										<TableCell align="right">
											<Tooltip placement="top" title="Delete" arrow>
												<IconButton
													sx={{
														'&:hover': {
															background: theme.colors.error.lighter
														},
														color: theme.palette.error.main
													}}
													color="inherit"
													size="small"
												>
													<DeleteTwoToneIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Box p={2}>
						<TablePagination
							component="div"
							count={100}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Box>
				</Card>
			</Grid>


		</Grid>
	);
}

export default SecurityTab;
