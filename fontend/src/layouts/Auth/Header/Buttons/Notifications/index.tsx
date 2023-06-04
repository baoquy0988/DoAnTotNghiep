import {
	alpha,
	Badge,
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	Popover,
	Tooltip,
	Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone'
import { styled } from '@mui/material/styles'
import { formatDistance, subDays } from 'date-fns'
import socket from 'src/models/socket'
import { Link } from 'react-router-dom'

const NotificationsBadge = styled(Badge)(
	({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
)

interface Noti {
	user_name: string
	title: string
	url: string
	like: boolean
	time: string
}

let numberTemp = 0

function HeaderNotifications() {
	const ref = useRef<any>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	const handleOpen = (): void => {
		numberTemp = 0
		setNumber(numberTemp)
		setOpen(true);
	}

	const handleClose = (): void => {
		setOpen(false);
	}

	const [noti, setNoti] = useState<Noti[]>([])
	//Số lượng thông báo
	const [number, setNumber] = useState(numberTemp)

	useEffect(() => {
		//Nhận thông báo từ server khi có người like bài viết
		socket.on('notifications_like_your_post', (data) => {
			let arr: Noti[] = noti

			//Nhấn like nhiều lần thì chỉ tính 1 lần
			const temp: Noti = {
				title: data.title,
				user_name: `${data.user_name} đã like bài viết của bạn`,
				like: data.like,
				url: data.url,
				time: data.time
			}

			const index = arr.findIndex((item) =>
				(item.title == temp.title
					&& item.url == temp.url
					&& item.user_name == temp.user_name))
			if(index !== -1) return 
			arr.push(temp)
			setNoti(arr.reverse())
			numberTemp += 1
			setNumber(numberTemp)
		})
	}, [])

	useEffect(()=>{
		socket.on('notifications_comment_your_post', (data) => {
			let arr: Noti[] = noti

			const temp: Noti = {
				title: data.title,
				user_name: `${data.name_comment} đã bình luận bài viết của bạn`,
				like: false,
				url: data.url,
				time: data.time
			}
			arr.push(temp)
			setNoti(arr.reverse())
			numberTemp += 1
			setNumber(numberTemp)
		})
	},[])
	return (
		<>
			<Tooltip arrow title="Notifications">
				<IconButton color="primary" ref={ref} onClick={handleOpen}>
					<NotificationsBadge
						badgeContent={number}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}}
					>
						<NotificationsActiveTwoToneIcon />
					</NotificationsBadge>
				</IconButton>
			</Tooltip>
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
				<Box
					sx={{ p: 2 }}
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h5">Thông Báo</Typography>
				</Box>
				<Divider />
				<List sx={{ p: 0 }}>
					{noti.map((value, index) => {
						return (
							<Link to={value.url} key={index} style={{ textDecoration: 'none', color: 'black' }}>
								<ListItem
									sx={{ p: 2, pt: 1, pb: 1, minWidth: 350, display: { xs: 'block', sm: 'flex' } }}
								>
									<Box flex="1">
										<Box display="flex" justifyContent="space-between">
											<Typography sx={{ fontWeight: 'bold' }}>
												{value.title}
											</Typography>
											<Typography variant="caption" sx={{ textTransform: 'none' }}>
												{/* {formatDistance(subDays(new Date(), 3), new Date(), {
													addSuffix: true
												})} */}
												{value.time}
											</Typography>


										</Box>
										<Typography
											component="span"
											variant="body2"
											color="text.secondary"
										>
											{' '}
											{value.user_name}
										</Typography>
									</Box>
								</ListItem>
							</Link>
						)
					})}

				</List>
			</Popover>
		</>
	);
}

export default HeaderNotifications;
