import { useState, ChangeEvent, useEffect } from 'react'
import {
	Box,
	Typography,
	Card,
	Grid,
	ListItem,
	List,
	ListItemText,
	Divider,
	Switch
} from '@mui/material'
import userSocket from 'src/api/socket/userSocket'
import SettingsUser from 'src/models/SettingsUser'

function NotificationsTab(props: { login: boolean }) {

	const [data, setData] = useState<SettingsUser>({
		p_posts: 0,
		p_email: 0
	})

	const [state, setState] = useState({
		checkedA: true,
		checkedB: true,
		checkedC: false,
		checkedD: false,
		checkedE: false
	})
	//CheckC hiển thị bài viết cho người khác xem

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.name === 'checkedC') {
			const status = userSocket.privateShowPost(event.target.checked)
		}
		setState({
			...state,
			[event.target.name]: event.target.checked
		})
		// setData()
	}


	useEffect(() => {
		if (props.login) {
			const action = userSocket.getSettingsUser()
			action.then((res) => {

				setState({
					...state,
					['checkedC']: res.p_posts === 1
				})

				setData(res)
			}).catch((err) => {

			})
		}
	}, [props.login])

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Box pb={2}>
					<Typography variant="h3">Ẩn thông tin</Typography>
					<Typography variant="subtitle2">
						Tắt để ẩn thông tin tài khoản khỏi người khác
					</Typography>
				</Box>
				<Card>
					<List>
						<ListItem sx={{ p: 3 }}>
							<ListItemText
								primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
								secondaryTypographyProps={{
									variant: 'subtitle2',
									lineHeight: 1
								}}
								primary="Email"
								secondary="Hiển thị thông tin email của bạn"
							/>
							<Switch
								color="primary"
								checked={state.checkedA}
								onChange={handleChange}
								name="checkedA"
							/>
						</ListItem>
						<Divider component="li" />
						<ListItem sx={{ p: 3 }}>
							<ListItemText
								primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
								secondaryTypographyProps={{
									variant: 'subtitle2',
									lineHeight: 1
								}}
								primary="Đánh giá"
								secondary="Hiển thị tổng số lượng bài viết, bình luận của bạn"
							/>
							<Switch
								color="primary"
								checked={state.checkedB}
								onChange={handleChange}
								name="checkedB"
							/>
						</ListItem>
						<Divider component="li" />
						<ListItem sx={{ p: 3 }}>
							<ListItemText
								primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
								secondaryTypographyProps={{
									variant: 'subtitle2',
									lineHeight: 1
								}}
								primary="Bài viết"
								secondary="Hiển thị tất cả bài viết của bạn "
							/>
							<Switch
								color="primary"
								checked={state.checkedC}
								onChange={handleChange}
								name="checkedC"
							/>
						</ListItem>
					</List>
				</Card>
			</Grid>
		</Grid>
	)
}

export default NotificationsTab
