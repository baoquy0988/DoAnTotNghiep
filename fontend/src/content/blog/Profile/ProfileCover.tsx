import {
	Box,
	Typography,
	Card,
	Avatar,
	CardMedia,
	Button,
	Grid,
	List,
	ListItem,
	Alert,
	AlertColor,
	Snackbar,
	SlideProps,
	Slide,

} from '@mui/material'
import { styled } from '@mui/material/styles'

import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import GitHubIcon from '@mui/icons-material/GitHub'

import { Info } from 'src/models/Profile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Popover from '@mui/material/Popover'
import { useEffect, useState } from 'react'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import BlockIcon from '@mui/icons-material/Block'
import FilterPost from './FilterPost'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PauseIcon from '@mui/icons-material/Pause'
import userSocket from 'src/api/socket/userSocket'
import AlertDialog from './AlertDialog'
import socket from 'src/models/socket'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import EmailIcon from '@mui/icons-material/Email'
const AvatarWrapper = styled(Card)(
	({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
)


const CardCover = styled(Card)(
	({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
)

const CardCoverAction = styled(Box)(
	({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
)

interface Props {
	data: Info
	invitation: boolean
	setInvitation: React.Dispatch<React.SetStateAction<boolean>>

	accept: boolean
	setAccept: React.Dispatch<React.SetStateAction<boolean>>

	friend: boolean
	setFriend: React.Dispatch<React.SetStateAction<boolean>>

}

interface Type {
	open: boolean
	text: string
	type: AlertColor
}
type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionRight(props: TransitionProps) {
	return <Slide {...props} direction="up" />;
}

const ProfileCover = (props: Props) => {
	const user = props.data
	const [removeFr, setRemoveFr] = useState(false)

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	const handleCloseSnack = (Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setSnack({ ...snack, open: false })
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}


	const [snack, setSnack] = useState<Type>(
		{
			open: false,
			text: "",
			type: "success"
		}
	)

	const serverError = () => {
		setSnack({
			open: true,
			type: "error",
			text: 'Có Lỗi Xảy Ra'
		})
	}
	//Gửi lời mời kết bạn
	function onClickAddFriend() {
		userSocket.sendAddFriend(user.id).then(() => {
			props.setInvitation(true)
			props.setFriend(false)
			setSnack({
				open: true,
				type: "success",
				text: 'Gửi Lời Mời Kết Bạn Thành Công'
			})
		}).catch(() => {
			serverError()
		})
	}

	useEffect(() => {
		if (user.id !== -1) {
			socket.off('receive_accept_add_friend')
			socket.on('receive_accept_add_friend', (user_id) => {
				if (user_id === user_id) {
					props.setAccept(false)
					props.setInvitation(false)
					props.setFriend(true)
					setSnack({
						open: true,
						type: "success",
						text: `${user.name} vừa chấp nhận kết bạn`
					})
				}
			})

			socket.off('receive_add_friend')
			socket.on('receive_add_friend', (user_id) => {
				if (user_id === user_id) {
					props.setAccept(true)

					setSnack({
						open: true,
						type: "success",
						text: `${user.name} vừa gửi lời mời kết bạn`
					})
				}
			})

			socket.off('receive_undo_add_friend')
			socket.on('receive_undo_add_friend', (user_id) => {
				if (user_id === user_id) {
					props.setAccept(false)
					setSnack({
						open: false,
						type: "success",
						text: ''
					})
				}
			})

			socket.off('receive_remove_friend')
			socket.on('receive_remove_friend', (user_id) => {
				if (user_id === user_id) {
					props.setAccept(false)
					props.setFriend(false)
					props.setInvitation(false)
					setSnack({
						open: false,
						type: "success",
						text: ''
					})
				}
			})
		}
	}, [user.id])

	//Chấp nhận kết bạn
	function onClickOKAddFriend() {
		userSocket.acceptAddFriend(user.id).then(() => {
			props.setAccept(false)
			props.setInvitation(false)
			props.setFriend(true)
			setSnack({
				open: true,
				type: "success",
				text: 'Chấp Nhận Kết Bạn Thành Công'
			})
		}).catch(() => {
			serverError()
		})
	}

	//Hoàn tác gửi lời mời kết bạn
	function onClickCancelAddFriend() {
		userSocket.undoAddFriend(user.id).then(() => {
			props.setInvitation(false)
			props.setFriend(false)
			setSnack({
				open: true,
				type: "warning",
				text: 'Hoàn Tác'
			})
		}).catch(() => {
			serverError()
		})
	}

	const DivFriend = () => {

		if (props.friend) {
			return (
				<Button sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
					onClick={() => setRemoveFr(true)}
					size="small"
					color='inherit'
					variant="contained"
					startIcon={<HowToRegIcon />}

				>
					Bạn Bè
				</Button>
			)
		}
		else if (props.accept) {
			return (
				<Button sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
					size="small"
					color='success'
					variant="contained"
					onClick={onClickOKAddFriend}
				>
					Xác Nhận
				</Button>
			)
		}
		else if (props.invitation) {
			return (
				<Button sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
					onClick={onClickCancelAddFriend}
					size="small"
					color='error'
					variant="contained"
					startIcon={<PauseIcon />}

				>
					Đã Gửi Lời Mời
				</Button>
			)
		}
		else {
			return (
				<Button sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
					size="small"
					color='primary'
					variant="contained"
					onClick={onClickAddFriend}
					startIcon={<PersonAddIcon />}
				>
					Thêm bạn bè
				</Button>
			)
		}
	}

	const Accpet = () => {
		if (props.accept) {
			return (
				<Grid item md={5} xs={12} container alignItems="center" justifyContent="flex-end">
					<Grid item>
						<Alert icon={false} severity="success" >
							{user.name} đã gửi lời mời kết bạn
						</Alert >
					</Grid>
					<Grid item>
						<Button sx={{ mr: 1 }}
							size="small"
							color='success'
							variant="contained"
							onClick={onClickOKAddFriend}
						>
							Chấp Nhận
						</Button>
					</Grid>
					<Grid item>
						<Button
							size="small"
							color='inherit'
							variant="outlined"
						>
							Xóa
						</Button>
					</Grid>
				</Grid>
			)
		}
		else return (<></>)
	}

	return (
		<>
			<CardCover>
				<CardMedia image={user.image} />

				<CardCoverAction>
					{DivFriend()}

					<Button sx={{ mt: { xs: 2, md: 0 } }}
						size="small"
						variant="contained"
						startIcon={<VisibilityIcon />}
					>
						Theo dõi
					</Button>

					<Button sx={{ minWidth: '10px' }}
						size="small"
						color='inherit'
						startIcon={<MoreVertIcon sx={{ mr: 0 }} />}
						onClick={handleClick}
					/>
				</CardCoverAction>

			</CardCover>
			<AvatarWrapper>
				<Avatar variant="rounded" alt={user.name} src={user.image} />


			</AvatarWrapper>

			<Box pt={2} pl={2} mb={2}>
				<Box>
					<Grid
						container
						direction="row"
						justifyContent="space-between"
						alignItems="flex-start"
					>
						<Grid item md={7} xs={12}>
							<Typography gutterBottom variant="h2">
								{user.name}
							</Typography>
{/* 
							<Typography gutterBottom variant="h6" >
								{user.name}
							</Typography> */}


							<Typography variant="subtitle2">
								{user.description}
								<br />
								<br />
								{user.description}
							</Typography>
						</Grid>
						{Accpet()}
					</Grid>
				</Box>
				<Box
					display={{ xs: 'block', md: 'flex' }}
					paddingTop={1}
					alignItems="center"
					justifyContent="space-between"
				>
					<Box>
						<Button size="small" variant="contained" startIcon={<FacebookIcon />}>
							Facebook
						</Button>
						<Button size="small" color='error' sx={{ mx: 1 }}
							variant="contained" startIcon={<YouTubeIcon />}>
							YouTube
						</Button>

						<Button size="small" color='inherit'
							variant="contained" startIcon={<GitHubIcon />}>
							GitHub
						</Button>
					</Box>
					<Box >
						{/* Lọc bài viết */}
						<FilterPost />
					</Box>
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}

						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<List>
							<ListItem disablePadding>
								<Button
									size="small"
									color="inherit"
									startIcon={<BlockIcon />}
								>
									Chặn
								</Button>

							</ListItem>
							<Button
								size="small"
								color="inherit"
								startIcon={<ReportGmailerrorredIcon />}
							>
								Báo Cáo
							</Button>

						</List>
					</Popover>

				</Box>
			</Box>
			<Snackbar
				open={snack.open}
				onClose={handleCloseSnack}
				autoHideDuration={5000}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				TransitionComponent={TransitionRight}
			>

				<Alert color={snack.type}>
					{snack.text}
				</Alert>
			</Snackbar>

			<AlertDialog open={removeFr} close={setRemoveFr}
				remove={props.setFriend} noti={setSnack} id={user.id} />
		</>
	)
}

export default ProfileCover
