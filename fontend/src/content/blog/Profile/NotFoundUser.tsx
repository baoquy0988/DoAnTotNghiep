import {
	Box,
	Card,
	Typography,
	Container,
	Divider,
	Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';

const MainContent = styled(Box)(
	({ theme }) => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);


function NotFound() {
    const navigate = useNavigate()

	return (
		<>
			<Helmet>
				<title>Không Tồn Tại</title>
			</Helmet>
			<MainContent>
				<Container maxWidth="md">
					<Box textAlign="center">
						<img alt="404" height={180} src="/static/images/status/404.svg" />
						<Typography variant="h2" sx={{ my: 2 }}>
							Người dùng này không tồn tại
						</Typography>
	
					</Box>
					<Container maxWidth="sm">
						<Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
							<Button onClick={()=>{navigate('/home')}} variant="contained">
								Trở về trang chủ
							</Button>
                            <Divider sx={{ my: 1 }}/>
                            <Button onClick={()=>{navigate(-1)}} variant="text">
								Quay lại
							</Button>
						</Card>
					</Container>
				</Container>
			</MainContent>
		</>
	);
}

export default NotFound
