import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Fragment, useEffect, useState, SyntheticEvent, useReducer } from 'react'
import { Alert, Avatar, Button, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { red } from '@mui/material/colors'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { authActions, selecIsBand, selecIsReason, selectIsReq } from 'src/features/auth/authSlice'
import { formatISO9075 } from 'date-fns'
import socket from 'src/models/socket'

let check = false

export default function SimpleSnackbar() {
	const [open, setOpen] = useState(false)

	const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}
	const dispatch = useAppDispatch()


	const handleCloseBand = (event: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpenBand(false)
	}



	const requestLogout = useAppSelector(selectIsReq)
	const band = useAppSelector(selecIsBand)
	const reason = useAppSelector(selecIsReason)

	const [openBand, setOpenBand] = useState(band !== false)

	useEffect(() => {
		setOpenBand(band !== false)
	}, [band])

	useEffect(() => {
		if (!check) {
			socket.on('server_band_account', (data) => {
				dispatch(authActions.setReason(data.reason))
				if (data.time === -1) {
					dispatch(authActions.setBand(true))
				} else {
					dispatch(authActions.setBand(data.time))
				}
			})
			socket.on('server_open_band_account', () => {
				dispatch(authActions.setBand(false))
			})
			check = true
		}
	}, [])

	const action = (
		<Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	)

	useEffect(() => {
		if (requestLogout) setOpen(true)

	}, [requestLogout])

	//Lời mời kết bạn
	const AddFriend = () => {
		return (
			<Grid container >
				<Grid item md={12}>

					<b>Hhehe&nbsp;</b>
					<label>vửa gửi lời mời kết bạn</label>
				</Grid>
				<Grid item container>
					<Grid item>
						<Button size="small" variant="contained" >
							Chấp Nhận
						</Button>
					</Grid>
					<Grid item>
						<Button size="small" color="error">Xóa</Button>
					</Grid>
				</Grid>
			</Grid>
		)
	}

	const Content = () => {
		return (

			<Alert icon={false} severity="warning">
				<CardHeader sx={{ p: 0 }}
					avatar={
						<Link to="{props.data.url_user}">
							<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" />
						</Link>
					}

					title={AddFriend()}
				/>

				<IconButton
					size="small"
					aria-label="close"
					color="inherit"
					onClick={handleClose}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			</Alert>


		)
	}


	const timeBand = () => {
		if (band === true) {
			return "Tài Khoản Bị Khóa Vĩnh Viễn"
		}
		if (band !== false) {
			return "Tài Khoản Bị Khóa Đến: " + formatISO9075(band)
		}
	}

	return (
		<div>
			{/* <Snackbar
				open={open}
				autoHideDuration={4000}
				onClose={handleClose}
				action={action}
			>
				{Content()}
			</Snackbar> */}

			<Dialog
				open={open}
				// onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{/* <DialogTitle id="alert-dialog-title"> */}
				<Alert icon={false} color="error">Đăng Nhập Hết Hạn</Alert>
				{/* </DialogTitle> */}
				<Button onClick={handleClose} color='error'>OK</Button>
			</Dialog>

			<Dialog
				open={openBand}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" color="red">
					{timeBand()}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Lí do : {reason}
					</DialogContentText>
				</DialogContent>

			</Dialog>

		</div>
	);
}
function dispatch(arg0: any) {
	throw new Error('Function not implemented.')
}

