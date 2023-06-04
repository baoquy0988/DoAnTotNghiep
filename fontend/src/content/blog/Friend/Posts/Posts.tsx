import { Alert, Container, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import PageTitleWrapper from "src/components/PageTitleWrapper"
import InfoPost from "src/models/InfoPost"
import PageHeader from "./PageHeader"
import { useAppSelector } from 'src/app/hooks'
import { selecIsUser, selectIsLogged, selectIsLogin } from 'src/features/auth/authSlice'
import socket from 'src/models/socket'
import postSocket from 'src/api/socket/postSocket'
import { useSearchParams } from 'react-router-dom'

let posts: InfoPost[] = []

function Posts() {
    const [sumFriend, setSumfriend] = useState(2)
    const [data, setData] = useState<InfoPost[]>([])

    const user = useAppSelector(selecIsUser)
    const login = useAppSelector(selectIsLogin)
    const logged = useAppSelector(selectIsLogged)
	const [postSelect, setPostSelect] = useState(-1)

    const search = window.location.search
    const params = new URLSearchParams(search)
    //Kiểm tra url xem url nào đang mở
    const params_url = params.get('url')
	//Thay đổi đường dẫn khi không có bài viết nào được chọn
	const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
		//Nếu đang tiến hành đăng nhập thì đợi đăng nhập xong
		// if (logged) return
		// postSocket.getPostFriend('').then((res)=>{
		// 	setData(res)
		// 	posts = res
		// 	const select = posts.findIndex((item) => item.url_short === params_url)
		// 	setPostSelect(select)
		// 	if (select === -1) setSearchParams('')
		// })
    }, [login])

    const AllPost = () => {
        if (sumFriend === 0) {
            return (
                <Alert icon={false} color="error">Chưa có bạn bè nào</Alert>
            )
        }
        if (data.length === 0) {
            return (
                <Alert icon={false} color="warning">Không tìm thấy bài viết nào từ bạn bè</Alert>
            )
        }
        else {
            return (
                <></>
            )
        }
    }
    return (
        <>
            <PageTitleWrapper>
                <PageHeader count={sumFriend} />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    {AllPost()}
                    {/* <Grid item xs={12}>
                        <Grid container spacing={2} style={{ display: "flex", flexDirection: "column-reverse" }}>
                            {showContentPost()}
                        </Grid>
                    </Grid> */}
                </Grid>
            </Container>
        </>
    )
}
export default Posts