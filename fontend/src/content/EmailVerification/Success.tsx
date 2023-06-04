import { CircularProgress } from "@mui/material";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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

export default function Success() {

    const navigate = useNavigate()
    return (
        <>
            <Helmet>
                <title>Thành Công</title>
            </Helmet>
            <MainContent>
                <Container maxWidth="md">
                    <Box textAlign="center">
                        {/* <img alt="404" height={180} src="/static/images/status/404.svg" /> */}
                        <CheckCircleIcon sx={{ mt: 2, fontSize: '100px' }} color="success" />
                        <Typography variant="h2" sx={{ my: 2 }} color="#57CA22">
                            Thành Công
                        </Typography>

                    </Box>
                    <Container maxWidth="sm">
                        <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                            <Button onClick={() => { navigate('/home') }} variant="contained">
                                Trở về trang chủ
                            </Button>
                            <Divider sx={{ my: 1 }} />
                        </Card>
                    </Container>
                </Container>
            </MainContent>
        </>
    )
}




