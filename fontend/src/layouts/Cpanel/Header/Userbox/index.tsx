import { useEffect, useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';

import {
	Alert,
	Avatar,
	Box,
	Button,
	Divider,
	ExtendList,
	Hidden,
	lighten,
	List,
	ListItem,
	ListItemText,
	ListTypeMap,
	Popover,
	Snackbar,
	Typography
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout'
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';

import { useAppSelector, useAppDispatch } from "src/app/hooks"
import { selecIsUser, selectIsLogin } from "src/features/auth/authSlice";
import { authActions } from "src/features/auth/authSlice"

const UserBoxButton = styled(Button)(
	({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
	({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
	({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
	({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
	({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
	const user = useAppSelector(selecIsUser)
	const login = useAppSelector(selectIsLogin)
	const dispatch = useAppDispatch()

	//Thông báo
	const [openNoti, setOpenNoti] = useState(false)
	const ref = useRef<any>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	const handleOpen = (): void => {
		setOpen(true);
	};

	const handleClose = (): void => {
		setOpen(false);
	}
	function logout() {
		dispatch(authActions.logout())
		localStorage.removeItem('token')
		setOpenNoti(true)
	}

	const handleCloseLogout = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return
        setOpenNoti(false)
    }

	return (
		<>
			<UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
				<Avatar variant="rounded" src={user.image} />
				<Hidden mdDown>
					<UserBoxText>
						<UserBoxLabel variant="body1">{login === true ? user.name : "Khách"}</UserBoxLabel>
						<UserBoxDescription variant="body2">
							Tùy chọn
						</UserBoxDescription>
					</UserBoxText>
				</Hidden>
				<Hidden smDown>
					<ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
				</Hidden>
			</UserBoxButton>
			<Popover
				anchorEl={ref.current}
				onClose={handleClose}
				open={isOpen}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
			>
				<MenuUserBox sx={{ minWidth: 210 }} display="flex">
					<Avatar variant="rounded" src={user.image} />
					<UserBoxText>
						<UserBoxLabel variant="body1"> {login === true ? user.name : "Khách"}</UserBoxLabel>
						<UserBoxDescription variant="body2">
							Tùy chọn
						</UserBoxDescription>
					</UserBoxText>
				</MenuUserBox>
				<Divider sx={{ mb: 0 }} />
				<List sx={{ p: 1 }} component="nav">
					<ListItem button to={login === true ? "/user/details" : "/auth/login"} component={NavLink}>
						<AccountBoxTwoToneIcon fontSize="small" />
						<ListItemText primary={login === true ? "Thông Tin" : "Đăng Nhập"} />
					</ListItem>
					<ListItem
						button
						to={login === true ? "/user/settings" : "/auth/register"}
						component={NavLink}
					>
						<AccountTreeTwoToneIcon fontSize="small" />
						<ListItemText primary={login === true ? "Cài đặt" : "Đăng Kí"} />
					</ListItem>
				</List>
				<Divider />
				<Box sx={{ m: 1 }} display={login === true ? "block" : "none"}>
					<Button color="primary" fullWidth onClick={logout}>
						<LogoutIcon sx={{ mr: 1 }} />
						Đăng Xuất
					</Button>
				</Box>
			</Popover>


			<Snackbar
				open={openNoti}
				autoHideDuration={4000}
				onClose={handleCloseLogout}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert severity='success'>Đăng Xuất Thành Công</Alert>
			</Snackbar>
		</>
	);
}

export default HeaderUserbox;
