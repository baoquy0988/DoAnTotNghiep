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
import Success from "./Success";
import Error from "./Error";
import { useEffect, useState } from "react";
import AuthSocket from "src/api/socket/authSocket";

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


export default function Emailverification() {

    const navigate = useNavigate()
    const [status, setStatus] = useState(0)

    const [value, setValue] = useState("")
    useEffect(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        //Kiểm tra url xem url nào đang mở
        const token = params.get('token')
        if (token) {
            AuthSocket.undoEmail(token).then((res) => {
                setValue(res)
                setStatus(1)
            }).catch(() => {
                setStatus(2)
            })
        } else {
            //Không truyền vào token
            navigate('/home')
        }
    }, [])

    const container = () => {
        if (status === 0) {
            return (
                <>
                    <Helmet>
                        <title>Hoàn Tác Email</title>
                    </Helmet>
                    <MainContent>
                        <Container maxWidth="md">
                            <Box textAlign="center">
                                <CircularProgress size={100} sx={{ mt: 2 }} />
                                <Typography variant="h2" sx={{ my: 2 }}>
                                    Đang Hoàn Tác Email
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
        if (status === 1) {
            return <Success email={value} />
        }
        return <Error />

    }
    return (
        <>
            {container()}
        </>
    )
}




