import PropTypes from 'prop-types'
import {
	Box,
	Typography,
	Card,
	Tooltip,
	Avatar,
	CardMedia,
	Button,
	IconButton,
	Grid
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone'
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import GitHubIcon from '@mui/icons-material/GitHub'
import ShareIcon from '@mui/icons-material/Share'
import Label from 'src/components/Label'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { useEffect, useRef, useState } from 'react'
import { authActions } from "src/features/auth/authSlice"
import { useAppDispatch } from 'src/app/hooks'
const Input = styled('input')({
	display: 'none'
})

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

const ButtonUploadWrapper = styled(Box)(
	({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
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

const ProfileCover = ({ user }) => {
	const uploadInputRef = useRef(null);
	const [temp, setTemp] = useState('')
	const [show, setShow] = useState(false)
	const dispatch = useAppDispatch()
	useEffect(() => {
		setTemp(user.image)
	}, [user])

	const status = () => {
		if (user.status === true)
			return (
				<Label color="success">
					<CheckIcon fontSize="small" />
					<b>Đã xác nhận</b>
				</Label>
			)
		else return (
			<Label color="error">
				<ClearIcon fontSize="small" />
				<b>Chưa xác nhận</b>
			</Label>
		)
	}
	function getBase64(file, cb) {
		try {

			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				cb(reader.result)
			}

		} catch (error) {

		}
	}

	function onChangeImage(event) {
		getBase64(event.target.files[0], (result) => {
			setTemp(result)
			setShow(true)
		})
	}
	function Success() {
		dispatch(authActions.editAvatar(temp))
		setShow(false)
	}

	return (
		<>
			<Box display="flex" mb={3}>
				<Tooltip arrow placement="top" title="Go back">
					<IconButton color="primary" sx={{ p: 2, mr: 2 }}>
						<ArrowBackTwoToneIcon />
					</IconButton>
				</Tooltip>
				<Grid container justifyContent="space-between" alignItems="center">
					<Grid item>
						<Typography variant="h3" component="h3" gutterBottom>
							Thông tin của {user.name}
						</Typography>
						<Typography variant="subtitle2">
							{user.email}
						</Typography>
					</Grid>


					<Grid item>
						{status()}
					</Grid>
				</Grid>
			</Box>
			<CardCover>
				<CardMedia image={user.image} />
				<CardCoverAction>
					<Input accept="image/*" id="change-cover" multiple type="file" />
					<label htmlFor="change-cover" >
						<Button onClick={() => { console.log(uploadInputRef.current) }}
							startIcon={<UploadTwoToneIcon />}
							variant="contained"
							component="span"
						>Thay đổi</Button>
					</label>
				</CardCoverAction>
			</CardCover>
			<AvatarWrapper>
				<Avatar variant="rounded" alt={user.name} src={temp} />
				<ButtonUploadWrapper>
					<Input onChange={(e) => onChangeImage(e)}
						accept="image/*"
						id="icon-button-file"
						name="icon-button-file"
						type="file"
					/>
					<label htmlFor="icon-button-file">
						<IconButton component="span" color="primary">
							<UploadTwoToneIcon />
						</IconButton>
					</label>
				</ButtonUploadWrapper>


			</AvatarWrapper>

			<Box py={2} pl={2} mb={3}>
				{show ?
					<Button variant='contained' color='error' sx={{ mb: 1 }} fullWidth
						onClick={() => Success()}>
						Lưu Thay Đổi
					</Button>
					: <></>}
				<Typography gutterBottom variant="h4">
					{user.name}
				</Typography>
				<Typography variant="subtitle2">{user.description}
					<br />
					<br />
					{user.description}
				</Typography>

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
					<Button
						sx={{ mt: { xs: 2, md: 0 } }}
						size="small"
						variant="text"
						endIcon={<ShareIcon />}
					>
						Liên kết
					</Button>
				</Box>
			</Box>
		</>
	)
}

ProfileCover.propTypes = {
	user: PropTypes.object.isRequired
}

export default ProfileCover
