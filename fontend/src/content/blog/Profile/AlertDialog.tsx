
import { AlertColor } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import userSocket from 'src/api/socket/userSocket'

interface Type {
	open: boolean
	text: string
	type: AlertColor
}


interface Props {
	id: number
	open: boolean
	close: React.Dispatch<React.SetStateAction<boolean>>
	remove: React.Dispatch<React.SetStateAction<boolean>>
	noti: React.Dispatch<React.SetStateAction<Type>>
}

export default function AlertDialog(props: Props) {

	const handleClose = () => {
		props.close(false)
	}

	const handRemove = () => {
		userSocket.removeFriend(props.id).then(() => {
			props.remove(false)
			props.close(false)
			props.noti({
				open: true,
				text: "Xóa Bạn Bè Thành Công",
				type: "success"
			})
		}).catch(() => {
			props.noti({
				open: true,
				type: "error",
				text: 'Có Lỗi Xảy Ra'
			})
		})
	}
	
	return (
		<div>
			<Dialog
				open={props.open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle color="error">Xóa Bạn Bè?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Các bài viết được chia sẽ với bạn bè sẽ không được hiển thị. Không thông báo gì đến người dùng về việc xóa bạn bè.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handRemove} color='error' variant='contained'>
						Đồng Ý
					</Button>
					<Button onClick={handleClose} autoFocus>Hủy</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
