import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { CssBaseline } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import router from 'src/router'
import ThemeProvider from './theme/ThemeProvider'

import { authActions } from "src/features/auth/authSlice"

import User from "src/models/User"
import serverAPI from './api/Server'
import AuthSocket from './api/socket/authSocket'
import { useAppDispatch } from './app/hooks'
import socket from './models/socket'

function App() {
	let path = ''
	const navigate = useNavigate()
	const nextPage = useCallback(() => navigate(path, { replace: true }), [path])
	const dispatch = useAppDispatch()
	useEffect(() => {
		async function checkServer() {
			await serverAPI.status().then((res) => {
				if (location.pathname === '/error' || location.pathname === '/error/') {
					path = '/home'
					nextPage()
				}
			}).catch(() => {
				path = '/error'
				nextPage()

			})

			//Tiến hành kiểm tra token
			const token = localStorage.getItem('token')
			//Token có tồn tại

			if (token) {
				//Đang tiến hành đăng nhâp
				dispatch(authActions.currentlyLogged())

				const action = await AuthSocket.token(token)
				//Đăng nhập thành công
				if (action.data) {
					const data: User = action.data
					dispatch(authActions.loginSuccess(data))
				} else {
					dispatch(authActions.loginFail())
				}
			}
		}
		checkServer()
	}, [])

	useEffect(() => {
		socket.on('request_logout', () => {
			dispatch(authActions.requestLogout())
		})
	}, [])

	const content = useRoutes(router)

	return (
		<ThemeProvider>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<CssBaseline />
				{content}
			</LocalizationProvider>
		</ThemeProvider>
	)
}
export default App;
