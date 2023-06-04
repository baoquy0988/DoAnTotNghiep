import { useState, ChangeEvent, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import PageHeader from './PageHeader'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { Container, Tabs, Tab, Grid, Button } from '@mui/material'
import Footer from 'src/components/Footer'
import { styled } from '@mui/material/styles'
import ActivityTab from './ActivityTab'
import EditProfileTab from './EditProfileTab'
import NotificationsTab from './NotificationsTab'
import SecurityTab from './SecurityTab'
import { useNavigate } from 'react-router-dom'
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice'
import { useAppSelector } from 'src/app/hooks'
import userSocket from 'src/api/socket/userSocket'
import SettingsUser from 'src/models/SettingsUser'

const TabsWrapper = styled(Tabs)(
	() => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
)

function ManagementUserSettings() {
	const [currentTab, setCurrentTab] = useState<string>('edit_profile')

	const tabs = [
		{ value: 'edit_profile', label: 'Thông tin' },
		{ value: 'notifications', label: 'Riêng tư' },
		{ value: 'security', label: 'Bảo mật' }
	]

	const navigate = useNavigate()

	const user = useAppSelector(selecIsUser)
	const login = useAppSelector(selectIsLogin)


	const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	}


	function container() {
		//Chưa đăng nhập
		if (login === false) return (
			<Grid
				container
				direction="row"
				justifyContent="center"
				alignItems="stretch"
				spacing={3}
			>
				<Grid item xs={12} md={12} m={3}>
					<Button onClick={() => navigate('/auth/login')}
						variant='contained' color='error' fullWidth>
						Vui lòng đăng nhập
					</Button>

				</Grid>
			</Grid>
		)
		else return (
			<>
				<PageTitleWrapper>
					<PageHeader name={user.name} />
				</PageTitleWrapper>
				<Container maxWidth="lg">
					<Grid
						container
						direction="row"
						justifyContent="center"
						alignItems="stretch"
						spacing={3}
					>
						<Grid item xs={12}>
							<TabsWrapper
								onChange={handleTabsChange}
								value={currentTab}
								variant="scrollable"
								scrollButtons="auto"
								textColor="primary"
								indicatorColor="primary"
							>
								{tabs.map((tab) => (
									<Tab key={tab.value} label={tab.label} value={tab.value} />
								))}
							</TabsWrapper>
						</Grid>
						<Grid item xs={12}>
							{currentTab === 'edit_profile' && <EditProfileTab user={user} />}
							{currentTab === 'notifications' && <NotificationsTab login={login} />}
							{currentTab === 'security' && <SecurityTab user={user} />}
						</Grid>
					</Grid>
				</Container>
			</>
		)
	}

	return (
		<>
			<Helmet>
				<title>Cài Đặt</title>
			</Helmet>
			{container()}
			<Footer />
		</>
	)
}

export default ManagementUserSettings
