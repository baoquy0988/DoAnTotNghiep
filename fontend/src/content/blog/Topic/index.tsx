import { Helmet } from 'react-helmet-async'
import PageHeader from './PageHeader'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { Grid, Container } from '@mui/material'
import Footer from 'src/components/Footer'
import AllContent from './AllContent'
import { useState } from 'react'

function Topic() {

	return (
		<>

			<PageTitleWrapper>
				<PageHeader/>
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
						<AllContent />
						{/* <RecentOrders /> */}
					</Grid>
				</Grid>
			</Container>
			<Footer />
		</>
	)
}

export default Topic
