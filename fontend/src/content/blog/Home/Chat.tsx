import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Messenger from 'src/components/Messenger';
import Button from '@mui/material/Button';
import User from 'src/models/User';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import ChatInfo from 'src/models/Chat';
import { Badge } from '@mui/material';
import socket from 'src/models/socket';
import { useAppSelector } from 'src/app/hooks'
import { selecIsUser, selectIsLogged, selectIsLogin } from 'src/features/auth/authSlice'
import ChatSocket from 'src/api/socket/chatSocket';

let numberUnreadGlobal = 0
let openGlobal = false
let dataGlobal: ChatInfo[] = []

export default function Chat(props: { login: boolean, user: User }) {
	// Kiểm tra tài khoản 
	const navigate = useNavigate()

	const [data, setData] = useState<ChatInfo[]>([])
	const [open, setOpen] = useState(openGlobal)

	const login = useAppSelector(selectIsLogin)
	const logged = useAppSelector(selectIsLogged)

	//Số lượng tin nhắn chưa đọc
	const [numberUnread, setNumberUnread] = useState(0)

	useEffect(() => {
		//Lấy lịch sử chat trước đó (nếu chưa lấy)
		if (dataGlobal.length === 0) {
			ChatSocket.history().then((res) => {
				dataGlobal = res
				setData(dataGlobal)
			})
		} else
			setData(dataGlobal)
	}, [])



	function openContainerChat() {

		if (!openGlobal) {
			setNumberUnread(0)
			numberUnreadGlobal = 0
		}
		openGlobal = !openGlobal
		setOpen(!open)


	}

	function addNumber(mess: ChatInfo) {
		dataGlobal.push(mess)
		if (!openGlobal) {
			numberUnreadGlobal += 1
			setNumberUnread(numberUnreadGlobal)
		}
	}

	const check = () => {
		if (props.login === false)
			return (
				<Button variant='contained' color='error'
					onClick={() => navigate('/auth/login')}>
					Vui lòng đăng nhập
				</ Button>
			)
		else {
			//Chưa kích hoạt
			if (props.user.status === false)
				return (
					<Button variant='contained' color='warning'>Vui lòng kích hoạt</Button>
				)
			return (
				<Messenger user={props.user} data={data} number={addNumber} />
			)
		}

	}
	return (
		<div>
			<Accordion expanded={open}>
				<AccordionSummary onClick={openContainerChat}
					expandIcon={
						<Badge badgeContent={numberUnread} color="error" max={99} >
							<ExpandMoreIcon />
						</Badge>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>Chat Tổng</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						{check()}
					</Typography>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}
