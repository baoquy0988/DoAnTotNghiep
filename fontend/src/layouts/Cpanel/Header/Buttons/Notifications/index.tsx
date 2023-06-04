import {
	alpha,
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	Grid,
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
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { notiActions, selectNoti, selectNumberNoti } from 'src/features/notiSlice'
import Noti, { Notification, Type } from 'src/models/Noti'
import userSocket from 'src/api/socket/userSocket'
import ReceieComment from './ReceieComment'
import ReceiveReplyComment from './ReceiveReplyComment'
import AcceptFriend from './AcceptFriend'
import SuccessAddFriend from './SuccessAddFriend'
import ReceiveSuccessAddFriend from './ReceiveSuccessAddFriend'
import ReceieLikePost from './ReceieLikePost'

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
let receive = false

function HeaderNotifications() {
	const ref = useRef<any>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	const data: Notification[] = useAppSelector(selectNoti)

	const number: number = useAppSelector(selectNumberNoti)
	const navagate = useNavigate()

	const dispatch = useAppDispatch()

	const handleOpen = (): void => {
		dispatch(notiActions.seen())
		setOpen(true)
	}

	const handleClose = (): void => {
		setOpen(false)
	}

	//Nhận thông báo phản hồi bình luận
	useEffect(() => {
		if (!receive) {
			socket.on('notifications_comment_your_post', (data) => {
				//Thông báo việc có người bình luận
				const notification: Notification = data
				notification.type = Type.comment
				notification.watched = false
				dispatch(notiActions.reviceNoti(notification))
			})

			socket.on('notifications_reply_comment', (data) => {
				const notification: Notification = data
				notification.type = Type.reply_comment
				notification.watched = false
				dispatch(notiActions.reviceNoti(notification))

			})

			//Nhận thông báo từ server khi có người like bài viết
			socket.on('notifications_like_your_post', (data) => {
				const notification: Notification = data
				notification.type = Type.like
				notification.watched = false
				notification.number = 0
				notification.list_like = []

				dispatch(notiActions.reviceNoti(notification))
			})


			//Nhận thông báo đã được chấp nhận kết bạn
			socket.on('receive_noti_accept_add_friend', (data) => {
				const notification: Notification = data
				notification.type = Type.success_add_friend
				notification.watched = false
				dispatch(notiActions.reviceNoti(notification))
			})

			//Nhận thông báo lời mời kết bạn
			socket.on('receive_noti_add_friend', (data) => {
				const notification: Notification = data
				notification.type = Type.friend_request
				notification.watched = false
				dispatch(notiActions.reviceNoti(notification))
			})


			receive = true
		}

	}, [])

	const contentNotification = () => {
		return data.map((value, index) => {
			if (value.type === "friend_request")
				return (<AcceptFriend data={value} watched={value.watched} index={index} key={index} />)
			if (value.type === "accept_friend")
				return (<SuccessAddFriend date={value.time}
					user_name={value.user_name} user_url={value.url_user} key={index} />)
			if (value.type === "comment")
				return (<ReceieComment data={value} index={index} watched={value.watched} key={index} />)
			if (value.type === "reply_comment")
				return (<ReceiveReplyComment data={value} index={index} watched={value.watched} key={index} />)
			if (value.type === "success_add_friend")
				return (<ReceiveSuccessAddFriend data={value} index={index} watched={value.watched} key={index}/>)
			if (value.type === "like")
				return (<ReceieLikePost data={value} index={index} watched={value.watched} key={index}/>)

		})
	}

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
					{contentNotification()}
				</List>


			</Popover>
		</>
	)
}

export default HeaderNotifications
