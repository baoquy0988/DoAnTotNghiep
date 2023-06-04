import { useEffect, useRef, useState } from 'react'
import BottomBarContent from './BottomBarContent'
import SidebarContent from './SidebarContent'
import ChatContent from './ChatContent'
import Scrollbar from 'src/components/Scrollbar'

import {
	Box,
	styled,
	Divider,
	Drawer,
	useTheme
} from '@mui/material'
import ChatInfo from 'src/models/Chat'
import socket from 'src/models/socket'
import ChatSocket from 'src/api/socket/chatSocket'
import User from 'src/models/User'

import {
	formatDistance,
	format,
	subDays,
	subHours,
	subMinutes
} from 'date-fns'


const RootWrapper = styled(Box)(
	() => `
       height: 500px;
       display: flex;
`
);

const ChatWindow = styled(Box)(
	() => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
)

const DrawerWrapperMobile = styled(Drawer)(
	() => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
)

interface Props {
	user: User
	data: ChatInfo[]
	number: Function
}
let connectRoom = false

function Messenger(props: Props) {
	const theme = useTheme()
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	}
	const bottomRef = useRef(null)

	const [data, setData] = useState<ChatInfo[]>(props.data)

	useEffect(() => {
		setData(props.data)
		try {
			const scroll =
				bottomRef.current.scrollHeight -
				bottomRef.current.clientHeight
			bottomRef.current.scrollTo(0, scroll)
		} catch (error) {

		}

	}, [props.data])

	useEffect(() => {
		if (!connectRoom) {
			connectRoom = true
			socket.on('receive_messenger', (res) => {
				const save: ChatInfo = res
				// save.my = (save.user_id === props.user.id)
				// props.data.push(save)
				setData((data) => [...data, save])
				ScrollBottom()
				props.number(save)
			})
		}
	}, [])

	async function sendMess(content: string) {

		const save: ChatInfo = {
			content: content,
			date: format(new Date(), 'HH: mm'),
			image: undefined,
			name: undefined,
			user_id: props.user.id
		}
		// props.data.push(save)
		setData((data) => [...data, save])

		await ChatSocket.send(content)
		ScrollBottom()
		props.number(save)

	}

	function ScrollBottom() {
		try {

			const scroll =
				bottomRef.current.scrollHeight -
				bottomRef.current.clientHeight
			bottomRef.current.scrollTo(0, scroll)

		} catch (error) {

		}
	}
	return (
		<>
			<RootWrapper className="Mui-FixedWrapper">

				<DrawerWrapperMobile
					sx={{
						display: { lg: 'none', xs: 'inline-block' }
					}}
					variant="temporary"
					anchor={theme.direction === 'rtl' ? 'right' : 'left'}
					open={mobileOpen}
					onClose={handleDrawerToggle}
				>
					<Scrollbar>
						<SidebarContent />
					</Scrollbar>
				</DrawerWrapperMobile>
				<ChatWindow>
					<Box flex={1} ref={bottomRef}
						sx={{
							overflow: "auto",
							scrollbarWidth: 'thin',
							'&::-webkit-scrollbar': {
								width: '0.3em',
							},
							'&::-webkit-scrollbar-track': {
								background: "#f1f1f1",
							},
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: '#888',
							},
							'&::-webkit-scrollbar-thumb:hover': {
								background: '#555'
							}
						}}
					>

						<ChatContent data={data} user_id={props.user.id} />
					</Box>
					<Divider />
					<BottomBarContent send={sendMess} />
				</ChatWindow>
			</RootWrapper>
		</>
	);
}

export default Messenger
