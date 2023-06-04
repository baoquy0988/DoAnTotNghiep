import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Button, Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import Switch from '@mui/material/Switch';

import PostTrend from 'src/components/PostTrend';
import Slider from './Slider'
import Chat from './Chat'
import Info from './InfoHome'
import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/app/hooks';
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice';

function Home() {
	const [show, setShow] = useState(false)

	const user = useAppSelector(selecIsUser)
	const login = useAppSelector(selectIsLogin)

	return (
		<>
			<Helmet>
				<title>Trang Chủ</title>
			</Helmet>
			<PageTitleWrapper>
				<Slider />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="stretch"
					spacing={4}
				>
					<Grid item lg={show === true ? 12 : 9} xs={12}>
						<Switch defaultChecked onChange={() => setShow(!show)}
							sx={{ position: 'absolute', right: '35px', marginTop: '-30px' }}
						/>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Chat login={login} user={user} />
							</Grid>
							<Grid item xs={12}>
								<PostTrend item={show === true ? 4 : 6} />
							</Grid>
						</Grid>
					</Grid>

					<Grid item lg={3} xs={12} container rowSpacing={2}
						style={{ display: show === true ? 'none' : 'block' }}>
						{/* <AccountSecurity /> */}

						<Grid item md={12}>
							{login === true ? <Info user={user} /> : <></>}
						</Grid>
						{/* <Grid item md={12}>
							{login === true ? <Info user={user} /> : <></>}
						</Grid> */}

					</Grid>
				</Grid>
			</Container>
			<Footer />
		</>
	);
}

export default Home
