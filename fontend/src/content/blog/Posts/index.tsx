import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import PageHeader from './PageHeader'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { Box, Container, Grid, Link, styled } from '@mui/material'
import Footer from 'src/components/Footer'
import ContentPost from './ContentPost'
import InfoPost from 'src/models/InfoPost'
import { useAppSelector } from 'src/app/hooks'
import { selecIsUser, selectIsLogged, selectIsLogin } from 'src/features/auth/authSlice'
import socket from 'src/models/socket'
import postSocket from 'src/api/socket/postSocket'
import { useSearchParams } from 'react-router-dom'
import { te } from 'date-fns/locale'
import CircularProgress from '@mui/material/CircularProgress'

//Thông báo khi có bài viết mới
const BoxNewPost = styled(Box)(
	() => `
	padding-top: 5px;
    animation: blinker 3s linear infinite;
    position: fixed;
    width: 100%;
    text-align: center;
    left: 0;
	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
	@media only screen and (min-width: 1280px) {
		left: 100px;
	}
	`
)

let posts: InfoPost[] = []
//Lưu những bài viết mới đăng vào biến tạm
let newPostTemp: InfoPost[] = []

//Số lượng bài viết mới chưa xem
let count: number = 0
let temp: InfoPost[] = []

//
let scroll = false
let index = 3
function Posts() {

	const [data, setData] = useState<InfoPost[]>([])
	const [dataNew, setDataNew] = useState<InfoPost[]>([])
	const user = useAppSelector(selecIsUser)
	const login = useAppSelector(selectIsLogin)
	const logged = useAppSelector(selectIsLogged)
	//Thông báo khi có bài viết mới
	const [noti, setNoti] = useState(false)
	//Bìa viết mới

	//số lượng thông báo
	const [countNewPost, setCountNewPost] = useState(0)

	const search = window.location.search
	const params = new URLSearchParams(search)
	//Kiểm tra url xem url nào đang mở
	const params_url = params.get('url')
	//Kiểm tra có post nào được chọn hay không
	const [postSelect, setPostSelect] = useState(-1)
	//Thay đổi đường dẫn khi không có bài viết nào được chọn
	const [searchParams, setSearchParams] = useSearchParams()

	//Cuộn xuống vị trí bài viết được chọn
	const [end, setEnd] = useState(false)

	useEffect(() => {
		//Nếu đang tiến hành đăng nhập thì đợi đăng nhập xong
		if (logged) return
		postSocket.get('').then((res) => {
			scroll = false

			index = 3
			// temp = res.slice(0, 3)
			posts = res
			const select = posts.findIndex((item) => item.url_short === params_url)

			if (select === -1) {
				setSearchParams('')
				setData(res.slice(0, 3))
			}
			else {
				setPostSelect(0)
				//Nếu có bài viết đang được chon thì cho bài viết đó lên trên cùng
				setData([posts[select], ...res.slice(1, 3)])
				// console.log(posts[select].id)
			}

		})
	}, [login])

	const ref = useRef(null)

	function showMore() {
		try {
			if ((window.pageYOffset + window.innerHeight - ref.current.clientHeight) >= 0) {
				// console.log(location.pathname)
				if (posts[index]) {
					index += 1
					setData((data) => [...data, posts[data.length]])
				} else {
					setEnd(true)
					window.removeEventListener("scroll", showMore)
				}
			}
		} catch (error) {
			window.removeEventListener("scroll", showMore)
		}
	}

	useEffect(() => {
		if (data.length !== 0 && !scroll) {
			window.addEventListener("scroll", showMore)
			scroll = true
		}
	}, [data])

	//Nhận thông báo có bài viết mới được đăng
	useEffect(() => {
		socket.on('receive_add_post', (res) => {
			setNoti(true)
			newPostTemp.push(res)

			count += 1
			setCountNewPost(count)
		})
	}, [])

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})

		// setNewPost(sorted)
		newPostTemp.map((value) => {
			setDataNew((dataNew) => [...dataNew, value])
		})
		newPostTemp = []
		setNoti(false)

		count = 0
		setCountNewPost(0)
	}

	window.addEventListener('scroll', function () { })

	function showContentPost(): JSX.Element[] {
		if (postSelect === -1) {
			{
				return data.map((value, index) => {
					return <ContentPost data={value} key={index} login={login} token={user.token} open={false} profile={false} />
				})
			}
		} else {
			return (
				data.map((value, index) => {
					if (postSelect === index)
						return <ContentPost data={value} key={index} login={login} token={user.token} open={true} profile={false} />
					else
						return <ContentPost data={value} key={index} login={login} token={user.token} open={false} profile={false} />
				})
			)
		}
	}
	function newPost() {
		return dataNew.map((value, index) => {
			return (
				<ContentPost data={value} key={index} login={login} token={user.token} open={false} profile={false} />
			)
		})
	}
	return (
		<>
			<Helmet>
				<title>Thông Báo</title>
			</Helmet>
			<BoxNewPost>
				<Link component="button" underline="none" onClick={scrollToTop}
					style={{ display: (noti === true ? "inline" : "none") }}
				>{countNewPost} bài viết mới </Link>
			</BoxNewPost>
			<PageTitleWrapper>
				{noti}
				<PageHeader />
			</PageTitleWrapper>
			<Container maxWidth="lg" ref={ref}>
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="stretch"
					spacing={3}
				>
					<Grid item xs={12}>
						<Grid container spacing={2} style={{ display: "flex", flexDirection: "column-reverse" }}>
							{newPost()}
						</Grid>
						<Grid container spacing={2} style={{ display: "flex" }} pt={2}>
							{showContentPost()}
						</Grid>
					</Grid>
				</Grid>
				<Grid container justifyContent='center' mt={2}>
					{!end ? <CircularProgress sx={{ textAlign: "center" }} size="25px" /> : <>Đã Đến Cuối Trang</>}
				</Grid>
			</Container>
			<Footer />
		</>
	);
}

export default Posts
