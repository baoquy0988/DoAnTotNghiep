import { useNavigate } from 'react-router-dom'
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice'
import { useAppSelector } from 'src/app/hooks'
import { Grid, Button, Container } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import Footer from 'src/components/Footer'
import Posts from './Posts'

function FriendPosts() {

    const navigate = useNavigate()
    const login = useAppSelector(selectIsLogin)

    const container = () => {
        if (!login)
            return (
                <Container sx={{ mt: 3 }} maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12} md={12} >
                        <Button onClick={() => navigate('/auth/login')}
                            variant='contained' color='error' fullWidth>
                            Vui lòng đăng nhập
                        </Button>

                    </Grid>
                </Grid>
                </Container>
            )
        else
            return (
                <Posts/>
            )
    }

    return (
        <>
            <Helmet>
                <title>Bài Viết Của Bạn Bè</title>
            </Helmet>
                {container()}
            <Footer/>
        </>
    )
}

export default FriendPosts