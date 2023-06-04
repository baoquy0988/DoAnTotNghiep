import { Helmet } from 'react-helmet-async'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { Alert, Container, Grid } from '@mui/material'
import Footer from 'src/components/Footer'

import AccountBalance from './AccountBalance'
import Wallets from './Wallets'
import AccountSecurity from './AccountSecurity'
import WatchList from './WatchList'
import { useAppDispatch, useAppSelector } from "src/app/hooks"
import { selecIsUser, selectIsLogged, selectIsLogin } from "src/features/auth/authSlice"

function DashboardCrypto() {
	const account = useAppSelector(selecIsUser)

	const container = () => {
		if (account.level) {
			return (
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="stretch"
					spacing={4}
					pt={2}
				>
					<Grid item xs={12}>
						<AccountBalance />
					</Grid>
					{/* <Grid item lg={8} xs={12}>
						<Wallets />
					</Grid>
					<Grid item lg={4} xs={12}>
						<AccountSecurity />
					</Grid> */}
					<Grid item xs={12}>
						<WatchList />
					</Grid>
				</Grid>
			)
		}
		return (
			<Grid
				container
				direction="row"
				justifyContent="center"
				alignItems="stretch"
				spacing={4}
				pt={5}
			>
				<Alert color='error'>Bạn Không Có Quyền Truy Cập Vào Trang Này</Alert>
			</Grid>
		)

	}
	return (
		<>
			<Helmet>
				<title>Thống Kê</title>
			</Helmet>
			<Container maxWidth="lg">
				{container()}
			</Container>
			<Footer />
		</>
	);
}

export default DashboardCrypto;
