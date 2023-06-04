import { useState } from 'react'
import {
	Box,
	Typography,
	Hidden,
	Container,
	Button,
	Grid
} from '@mui/material';
import { Helmet } from 'react-helmet-async'
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone'
import LoadingButton from '@mui/lab/LoadingButton'

import { styled } from '@mui/material/styles'

const MainContent = styled(Box)(
	() => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);


function Status500() {
	const [pending, setPending] = useState(false)
	function handleClick() {
		// setLoad(!load)
		setPending(true)
	}

	return (
		<>
			<Helmet>
				<title>Status - 500</title>
			</Helmet>
			<MainContent>
				<Grid
					container
					sx={{ height: '100%' }}
					alignItems="stretch"
					spacing={0}
				>

						<Container maxWidth="sm">
							<Box textAlign="center">
								<img
									alt="500"
									height={260}
									src="/static/images/status/500.svg"
								/>
								<Typography variant="h2" sx={{ my: 2 }}>
									Đã xảy ra lỗi, vui lòng thử lại sau
								</Typography>
								<Typography
									variant="h4"
									color="text.secondary"
									fontWeight="normal"
									sx={{ mb: 4 }}
								>
									Server hiện đang lỗi hoặc chưa bật
								</Typography>
								<LoadingButton
									onClick={handleClick}
									loading={pending}
									variant="outlined"
									color="primary"
									startIcon={<RefreshTwoToneIcon />}
								>
									Thử lại
								</LoadingButton>
								<Button href="/overview" variant="contained" sx={{ ml: 1 }}>
									Liên Hệ
								</Button>
							</Box>
						</Container>

					
				</Grid>
			</MainContent>
		</>
	);
}

export default Status500
