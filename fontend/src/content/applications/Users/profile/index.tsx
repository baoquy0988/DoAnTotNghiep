import { Helmet } from 'react-helmet-async'
import Footer from 'src/components/Footer'
import { Grid, Container, Button } from '@mui/material'
import ProfileCover from './ProfileCover'
import TotalNumber from './TotalNumber'
import NumberPost from './NumberPost'
import PopularTags from './PopularTags'
import MyCards from './MyPost'
import { useNavigate } from 'react-router-dom'
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice'
import { useAppSelector } from 'src/app/hooks'
import { useEffect, useState } from 'react'
import userSocket from 'src/api/socket/userSocket'
import Info, { SumNumberLikeComment } from 'src/models/Info'

function ManagementUserProfile() {
	const navigate = useNavigate()

	const user = useAppSelector(selecIsUser)
	const login = useAppSelector(selectIsLogin)
	//Thống kê số lượng bài viết đã đăng, số lượng like - cmt
	const [sumNumberLikeComment, setSumNumberLikeComment] = useState<SumNumberLikeComment>(
		{
			sum_like: 0,
			sum_comment: 0,
			sum_post: 0,
			tallest_cmt: 0,
			tallest_like: 0
		}
	)

	const [data, setData] = useState<Info>({
		statistical: [],
		posts: [],
		postsSave: [],
		sum_like: 0,
		sum_comment: 0
	})

	useEffect(() => {
		if(login === false) return
		async function getProfile() {
			const action = await userSocket.profile(user.token)
			setData({
				statistical: action.statistical,
				posts: action.posts,
				postsSave: action.postsSave,
				sum_like: action.sum_like,
				sum_comment: action.sum_comment

			})

			setSumNumberLikeComment(
				{
					sum_like: action.sum_like,
					sum_comment: action.sum_comment,
					sum_post: action.posts.length,
					tallest_cmt: 0,
					tallest_like: 0
				}
			)

		}
		getProfile()
	}, [login === true])

	function container() {
		//Chưa đăng nhập
		if (login === false) return (
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
		)
		else return (
			<Grid
				container
				direction="row"
				justifyContent="center"
				alignItems="stretch"
				spacing={3}
			>
				<Grid item xs={12} md={9} >
					<ProfileCover user={user} />
				</Grid>

				<Grid item xs={12} md={3}>
					<Grid
						container
						spacing={3}
					>
						<Grid item xs={12} md={12}>
							<TotalNumber data={sumNumberLikeComment} />
						</Grid>
						<Grid item xs={12} md={12}>
							<PopularTags />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={12}>
					<NumberPost data={data.statistical} />
				</Grid>
				<Grid item xs={12} md={12}>
					<MyCards data={data.posts} save={data.postsSave} user_name={user.name} user_image={user.image}/>
				</Grid>
			</Grid>
		)
	}

	return (
		<>
			<Helmet>
				<title>{user.name} - Trang Cá Nhân</title>
			</Helmet>
			<Container sx={{ mt: 3 }} maxWidth="lg">
				{container()}
			</Container>
			{/* <Select/> */}
			<Footer />
		</>
	);
}




export default ManagementUserProfile;
