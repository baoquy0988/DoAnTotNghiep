import { ChangeEvent, useState, MouseEvent, useEffect } from 'react';
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
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
	AlertColor,
	Snackbar,
	Alert,
} from '@mui/material'

import { format, subHours, subWeeks, subDays } from 'date-fns'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import SendIcon from '@mui/icons-material/Send'
import { TablePosts, TablePostsSave } from 'src/models/Info'
import { Link } from 'react-router-dom'
import postSocket from 'src/api/socket/postSocket'
import Label from 'src/components/Label'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { loadPlugin } from 'immer/dist/internal'
import EditPost from 'src/components/EditPost'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DeleteIcon from '@mui/icons-material/Delete'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import parse from 'html-react-parser'
import View from './View';
import { PostPreview } from "src/models/PostDetail"
import SelectStatus from './SelectStatus';
import Posts from './Posts';


let selectPost = -1
let indexSelect = -1

interface Snack {
	type: AlertColor
	text: string
	open: boolean
}
interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}


interface Props {
	data: TablePosts[]
	save: TablePostsSave[]
	user_name: string
	user_image: string
}

interface Edit {
	id: number
	open: boolean
	title: string
	content: string
}
function MyPost(props: Props) {

	const [value, setValue] = useState(0);

	const [prewviewShow, setPrewviewShow] = useState(false)

	const [preview, setPreview] = useState<PostPreview>({
		name: '',
		content: '',
		date: '',
		image: '',
		user_name: ''
	})

	//True là bài viết đã đăng - false là bài viết đã lưu

	const [type, setType] = useState(true)

	function a11yProps(index: number) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		}
	}

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
		setType(newValue === 0)
	}

	//Thông báo chỉnh dửa bài viết thành công hay không
	const [show, setShow] = useState<Snack>({
		open: false,
		type: "success",
		text: ""
	})

	//Bài viết đã đăng 
	const [data, setData] = useState<TablePosts[]>([])
	//Bài viết đang lưu
	const [dataSave, setDataSave] = useState<TablePostsSave[]>([])

	const [edit, setEdit] = useState<Edit>({
		id: -1,
		open: false,
		title: '',
		content: ''
	})

	useEffect(() => {
		setData(props.data)
		setDataSave(props.save)
	}, [props.data])

	const theme = useTheme()
	//Bài Viết Được Chọn

	const [open, setOpen] = useState(false)
	const [lock, setLock] = useState(false)
	const [_deletePostSave, setDeletePostSave] = useState(false)

	//Nếu dữ liệu bị thay đổi thì render
	const handleClose = () => {
		setOpen(false)
		selectPost = -1
		indexSelect = -1
	}

	const handleCloseDelete = () => {
		setDeletePostSave(false)
		selectPost = -1
		indexSelect = -1
	}
	const handleLock = () => {
		setLock(false)
		selectPost = -1
		indexSelect = -1
	}

	const handleLockPost = (id: number, index: number, open: boolean) => {
		if (open) setOpen(true)
		else setLock(true)
		selectPost = id
		indexSelect = index
	}

	const handleCloseEdit = () => {
		setEdit({
			id: -1,
			open: false,
			title: '',
			content: ''
		})
	}

	//Thay đổi trạng thái đóng mở bài viết
	function editStatusOpen(type: boolean) {
		if (selectPost === -1) return
		if (type) {
			setOpen(false)
			const status = postSocket.lock(selectPost)
			status.then(() => {
				let temp: TablePosts[] = data
				let item: TablePosts = temp[indexSelect]
				item.status = false
				setData([])
				setData(temp)

				setShow({
					open: true,
					type: 'success',
					text: 'Đóng Bài Viết Thành Công'
				})
			})

		} else {
			setLock(false)
			const status = postSocket.open(selectPost)
			status.then(() => {
				let temp: TablePosts[] = data
				let item: TablePosts = temp[indexSelect]
				item.status = true
				setData([])
				setData(temp)
				setShow({
					open: true,
					type: 'success',
					text: 'Mở Bài Viết Thành Công'
				})
			})
		}
	}

	const dialogClosePost = () => {
		return (
			<Dialog
				open={open}

				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle color="error">Đóng Bài Viết?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Đóng Bài Viết Người Khác Và Bạn Sẽ Không Thể Bình Luận. Vẫn Có Thể Xem Nội Dung Và Tất Cả Bình
						Luận Trước Đó
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Hủy</Button>
					<Button onClick={() => editStatusOpen(true)}>OK</Button>
				</DialogActions>
			</Dialog>
		)
	}

	const dialogOpenPost = () => {
		return (
			<Dialog
				open={lock}

				keepMounted
				onClose={handleLock}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle color="green">Mở Bài Viết?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Tất Cả Người Dùng Được Phép Bình Luận Vào Bài Viết Của Bạn
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLock}>Hủy</Button>
					<Button onClick={() => editStatusOpen(false)}>OK</Button>
				</DialogActions>
			</Dialog>
		)
	}


	//Xóa bài viết đã lưu (chưa đăng)
	const dialogDeletePostSave = () => {
		return (
			<Dialog
				open={_deletePostSave}

				keepMounted
				onClose={handleCloseDelete}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle color="error">Xóa Bài Viết Đã Lưu?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Bạn Sẽ Không Thấy Bài Viết Này Trong Mục Lưu Trữ Nữa
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDelete}>Hủy</Button>
					<Button onClick={() => deletePostSave()}>OK</Button>
				</DialogActions>
			</Dialog>
		)
	}

	const editPost = (content: string, title: string, id: number, index: number) => {
		setEdit({
			content: content,
			title: title,
			open: true,
			id: id
		})
		setIndexItem(index)
	}

	const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setShow({ ...show, open: false })
	}

	//Vị trí của item cần thanh đổi
	const [indexItem, setIndexItem] = useState(-1)

	function editSuccess(id: number, title: string, content: string) {
		////Render dữ liệu khi có sự thay đổi
		data[indexItem] = {
			id: id,
			title: title,
			content: content,
			date: data[indexItem].date,
			n_comment: data[indexItem].n_comment,
			n_like: data[indexItem].n_like,
			status: data[indexItem].status,
			url: data[indexItem].url,
			share: 0
		}

		setShow({
			open: true,
			type: 'success',
			text: 'Chỉnh sửa thành công'
		})
		//Đóng bảng chỉnh sửa
		setEdit({
			id: -1,
			open: false,
			title: '',
			content: ''
		})
	}

	//Thay đổi phạm vi chia sẻ
	function editStatusShare(index: number, status: number) {
		data[index].share = status
		setShow({
			open: true,
			type: 'success',
			text: 'Thay đổi phạm vi chia sẻ thành công'
		})
	}

	function editSaveSuccess(id: number, title: string, content: string) {
		////Render dữ liệu khi có sự thay đổi
		dataSave[indexItem] = {
			id: id,
			title: title,
			content: content,
			date: data[indexItem].date
		}

		setShow({
			open: true,
			type: 'success',
			text: 'Chỉnh sửa thành công'
		})
		//Đóng bảng chỉnh sửa
		setEdit({
			id: -1,
			open: false,
			title: '',
			content: ''
		})
	}


	function previewPost(index: number) {
		const post: PostPreview = {
			name: dataSave[index].title,
			content: dataSave[index].content,
			date: 'Bây Giờ',
			image: props.user_image,
			user_name: props.user_name
		}

		setPrewviewShow(true)
		setPreview(post)
		// console.log(post)
	}

	function closePrewviewPost() {
		setPrewviewShow(false)
	}

	function showDialogDeletePostSave(id: number, index: number) {
		setDeletePostSave(true)
		selectPost = id
		indexSelect = index
	}

	function deletePostSave() {
		const action = postSocket.deletePostSave(selectPost)
		action.then(() => {
			setDeletePostSave(false)
			const temp = dataSave
			temp.splice(indexSelect, 1)
			setDataSave(temp)

			setShow({
				open: true,
				type: 'success',
				text: 'Xóa Bài Viết Thành Công'
			})
		})
	}

	const ContainerSavePost = (): JSX.Element => {
		return (
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>STT</TableCell>
						<TableCell>Tiêu đề</TableCell>
						<TableCell>Nội Dung</TableCell>
						<TableCell>Ngày Lưu</TableCell>
						<TableCell align="right">Tùy Chọn</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{dataSave.map((value, index) => (
						<TableRow key={index} hover>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{value.title}</TableCell>
							<TableCell style={{
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical', overflow: 'hidden'
							}}>{parse(value.content)}</TableCell>
							<TableCell>
								{format(value.date, 'HH:mm • dd/MM/yyyy')}
							</TableCell>

							<TableCell align="right">
								<Tooltip placement="top" title="Chỉnh sửa" arrow>
									<IconButton
										sx={{
											'&:hover': {
												background: theme.colors.success.lighter
											},
											color: theme.palette.success.main
										}}
										color="inherit"
										size="small"
										onClick={() => editPost(value.content, value.title, value.id, index)}
									>
										<EditIcon fontSize='small' />
									</IconButton>
								</Tooltip>

								<Tooltip placement='top' title="Xem trước" arrow>
									<IconButton
										sx={{
											'&:hover': {
												background: theme.colors.primary.lighter
											},
											color: theme.palette.primary.main
										}}
										color="primary"
										size="small"
										onClick={() => { previewPost(index) }}
									>
										<RemoveRedEyeIcon fontSize='small' />
									</IconButton>
								</Tooltip>

								<Tooltip placement='top' title="Xóa" arrow>
									<IconButton
										sx={{
											'&:hover': {
												background: theme.colors.error.lighter
											},
											color: theme.palette.error.main
										}}
										color="error"
										size="small"
										onClick={() => showDialogDeletePostSave(value.id, index)}
									>
										<DeleteIcon fontSize='small' />
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		)
	}


	return (
		<>
			<Snackbar
				open={show.open}
				autoHideDuration={3000}

				onClose={handleCloseSnack}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>

				<Alert severity={show.type}>{show.text}</Alert>
			</Snackbar>

			{dialogClosePost()}
			{dialogOpenPost()}
			{dialogDeletePostSave()}
			{/* 	Xem hiển trước bài viết  */}

			<View data={preview} open={prewviewShow} close={closePrewviewPost} />

			<EditPost content={edit.content} title={edit.title} open={edit.open} close={handleCloseEdit}
				id={edit.id} show={type ? editSuccess : editSaveSuccess} type={type} />
			<Card>
				<CardHeader
					subheaderTypographyProps={{}}
					titleTypographyProps={{}}
					title="Bài Viết"
					subheader="Lịch sử bài viết của bạn"
					action={
						<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
							<Tab label="Đã Đăng" {...a11yProps(0)} />
							<Tab label="Lưu" {...a11yProps(1)} />
						</Tabs>
					}
				/>
				<Divider />
				<TableContainer>
					<Box sx={{ width: '100%' }}>
						<TabPanel value={value} index={0}>
							{/* Bài viết đã đăng */}
							<Posts data={data} editStatusShare={editStatusShare} setEdit={setEdit}
								lock={handleLockPost} setIndexItem={setIndexItem} />
						</TabPanel>
						<TabPanel value={value} index={1}>
							{ContainerSavePost()}
						</TabPanel>
					</Box>

					{/* */}
				</TableContainer>
			</Card>
		</>
	)
}

export default MyPost
