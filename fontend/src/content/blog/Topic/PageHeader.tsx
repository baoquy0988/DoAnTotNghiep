import { Typography, Button, Grid, IconButton, Slide, AlertColor, Snackbar, Alert } from '@mui/material'
import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import CreatePost from 'src/components/CreatePost'

import { TransitionProps } from '@mui/material/transitions'
import { useAppSelector } from 'src/app/hooks'
import { selectIsLogin, selecIsUser } from 'src/features/auth/authSlice'
import { useEffect, useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { generatePath } from "react-router";
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'


const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />
})

interface Snack {
	type: AlertColor
	text: string
	open: boolean
}

function PageHeader() {

	const user = useAppSelector(selecIsUser)
	//Thông báo thêm bài viết thành công hay không
	const [show, setShow] = useState<Snack>({
		open: false,
		type: "success",
		text: ""
	})

	// const history = useHistory()

	const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setShow({ ...show, open: false })
	}


	const search = window.location.search
	const params = new URLSearchParams(search)

	const [open, setOpen] = useState(params.get('add') === 'true')
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

	const [, setSearchParams] = useSearchParams()
	useEffect(() => {
		if (open === false) setSearchParams('')
	}, [])
	const handleClickOpen = () => {
		setSearchParams({ add: 'true' })
		setOpen(true)
	}

	const handleClose = () => {
		setSearchParams('')
		setOpen(false)
		setOpen(false)
		//Kiêm tra xem có dữ liệu nhập vào không
		const dataBefore = localStorage.getItem('create-post')
		const titleBefore = localStorage.getItem('title-post')
		
		if (dataBefore.length !== 8 || titleBefore !== '') {
		setShow({
			open: true,
			text: "Đã Lưu Vào Bộ Nhớ Tạm",
			type: "success"
		})
	}
}

return (
	<>
		<Helmet>
			{open === false ?
				<title>Chủ Đề</title>
				:
				<title>Thêm Bài Viết</title>
			}

		</Helmet>

		<Grid container justifyContent="space-between" alignItems="center">
			<Grid item>
				<Typography variant="h3" component="h3" gutterBottom>
					Tất Cả Chủ Đề
				</Typography>
				<Typography variant="subtitle2">
					{user.name}! bạn có thể tìm thấy bài viết của chủ đề cụ thể
				</Typography>
			</Grid>
			<Grid item>
				<Button
					sx={{ mt: { xs: 2, md: 0 } }}
					variant="outlined"
					color='error'
					onClick={handleClickOpen}
				>
					<AddCircleOutlineIcon />
				</Button>
			</Grid>
		</Grid>
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			aria-labelledby="responsive-dialog-title"
			TransitionComponent={Transition}
		>
			<CreatePost setShow={setShow} close={handleClose} />
		</Dialog>

		<Snackbar
			open={show.open}
			autoHideDuration={3000}
			onClose={handleCloseSnack}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		>

			<Alert severity={show.type}>{show.text}</Alert>
		</Snackbar>

	</>
);
}

export default PageHeader
