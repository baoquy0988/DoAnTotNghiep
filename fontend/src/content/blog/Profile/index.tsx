import { Card, CardHeader, Avatar, Button, CardActions, Grid, Container } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import InfoPost from "src/models/InfoPost"
import ProfileCover from "./ProfileCover"
import { useEffect, useState } from "react"
import Profile, { Info } from "src/models/Profile"
import { Helmet } from "react-helmet-async"
import Footer from "src/components/Footer"
import { useNavigate, useSearchParams } from "react-router-dom"
import userSocket from "src/api/socket/userSocket"
import NotFoundUser from "./NotFoundUser"
import Content from "../Posts/ContentPost"
import { useAppDispatch, useAppSelector } from "src/app/hooks"
import { selecIsUser, selectIsLogged, selectIsLogin } from "src/features/auth/authSlice"
import Snack from "./AlertDialog"

export default function ShowProfile() {

    const [user, setUser] = useState<Info>({
        id: -1,
        name: '',
        description: '',
        image: ''
    })
    const [posts, setPosts] = useState<InfoPost[]>([])
    const [searchParams, setSearchParams] = useSearchParams()

    const login = useAppSelector(selectIsLogin)
    const account = useAppSelector(selecIsUser)

    const user_id = searchParams.get("id")
    const [myAccount, setMyAccount] = useState(false)
    const [friend, setFriend] = useState(false)
    //Đang đợi bạn chấp nhận kết bạn
    const [accept, setAccept] = useState(false)
    //Bạn gửi lời mời kết bạn
    const [invitation, setInvitation] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {

        if (login) {
            //Nếu là chủ sở hữu thì chuyển hướng
            if (user_id === account.id.toString()) navigate('/user/details')
            setTimeout(() => {

                if (user_id) {
                    const profile = userSocket.otherProfile(user_id)
                    profile.then((res: Profile) => {
                        if (res.info) {

                            setUser(res.info)
                            setPosts(res.post)

                            const checkFriend = (account.friend.indexOf(Number(user_id)) !== -1)

                            if (!checkFriend) {
                                const checkAccpect = (account.accept.indexOf(Number(user_id)) !== -1)

                                if (!checkAccpect) {
                                    const checkInvitation = (account.invitation.indexOf(Number(user_id)) !== -1)

                                    setInvitation(checkInvitation)

                                } else setAccept(true)
                            }
                            else setFriend(true)


                        } else {
                            setUser(undefined)
                        }
                    }).catch(() => {

                    })
                }
                //Nếu không nhập vào id
                else {
                    navigate('/user/details')
                }
            }, 100)
        }

    }, [login])

    const containerPosts = () => {
        if (posts.length !== 0) return (
            posts.map((value, index) => {
                return (
                    <Content login={login} open={false} token='a' data={value} key={index} profile={true} />

                )
            })
        )
        else return (
            <Grid textAlign='center' md={12} pt={2}>Chưa có bài viết nào hoặc người dùng không hiển thị</Grid>
        )
    }
    const container = () => {
        if (login) {
            //Người dùng tồn tại
            if (user) {
                return (
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={1}
                    >
                        <Grid item xs={12} md={12} >
                            <ProfileCover data={user} friend={friend} accept={accept} invitation={invitation}
                                setAccept={setAccept} setFriend={setFriend} setInvitation={setInvitation}
                            />

                        </Grid>

                        <Grid item md={12} container spacing={1}>

                            {containerPosts()}

                        </Grid>
                    </Grid>
                )
            } else return (
                <NotFoundUser />
            )
        }
        else {
            return (
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
                            Vui lòng đăng nhập để sử dụng chức năng này
                        </Button>
                    </Grid>
                </Grid>
            )
        }
    }

    return (
        <>
            <Helmet>
                <title>{user ? user.name + " | Trang Cá Nhân" : "Không Tìm Thấy"}</title>
            </Helmet>
            <Container sx={{ mt: 3 }} maxWidth="lg">
                {container()}
            </Container>
            <Footer />
        </>
    )
}