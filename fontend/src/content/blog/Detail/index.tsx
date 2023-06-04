import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid, CardHeader, Skeleton, Alert } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import postAPI from 'src/api/postAPI';

import { useNavigate } from 'react-router-dom';

import ContentPost from './ContentPost'
import Comments from './Comments'
import { useAppSelector } from 'src/app/hooks';
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice';
import PostDetail, { hollow } from 'src/models/PostDetail'
import postSocket from 'src/api/socket/postSocket';


function ManagementUserSettings() {

	const navigate = useNavigate();
	let path = ''

	const nextPage = useCallback(() => navigate(path, { replace: true }), [path])
	const [data, setData] = useState<PostDetail>(hollow)
	//Mặc định sẽ hiện thị nội dung bình luận
	const [showComment, setShowComment] = useState(true)
	//Đã load xong dữ liệu hay chưa
	const [load, setLoad] = useState(false)

	const user = useAppSelector(selecIsUser)
	const login = useAppSelector(selectIsLogin)
	const [status, setStatus] = useState(0)

	useEffect(() => {
		const status = postSocket.getDetail(location.pathname.split('/'))

		status.then((res) => {
			if (res === undefined) {
				path = '/post-null'
				nextPage()
			}
			else if (res === true) {
				setStatus(1)
				setLoad(true)
			}
			else if (res === false) {
				setStatus(2)
				setLoad(true)
			}
			else {
				if (res.navigation) {
					path = res.data.url
					nextPage()
				}
				setStatus(0)
				setLoad(true)
				setData(res.data)
			}
		}).catch(() => {

		})

	}, [])


	const ShareStatus = () => {
		if (!load) {
			return (
				<>
					<Grid item lg={showComment === true ? 8 : 12}>
						<CardHeader
							avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
							title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
							subheader={<Skeleton animation="wave" height={10} width="40%" />} />
					</Grid>

					<Grid item lg={showComment === true ? 4 : 12}>
						<CardHeader
							title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
							subheader={<Skeleton animation="wave" height={10} width="40%" />} />
					</Grid>
				</>
			)
		}
		if (status === 1) return (
			<Alert icon={false} sx={{ mt: 3 }} color="error">Bài Viết Chỉ Chia Sẻ Cho Bạn Bè</Alert>
		)
		else if (status === 2) return (
			<Alert icon={false} sx={{ mt: 3 }} color="error">Bài Viết Chia Sẻ Riêng Tư</Alert>
		)
		else {
			return (
				<>
					<Grid item lg={showComment === true ? 8 : 12}>
						<ContentPost value={data} show={showComment} setShow={setShowComment} />
					</Grid>
					<Grid item lg={showComment === true ? 4 : 12}>
						<Comments data={data.comments} login={login} status={data.status}
							id={data.id} n_like={data.n_like} n_comment={data.n_comments}
							user_like={data.user_like} share={data.share === 2} />
					</Grid>
				</>
			)
		}
	}

	return (
		<>
			<Helmet>
				<title>{data.name}</title>
			</Helmet>
			<Container maxWidth="lg" style={{ paddingTop: '10px' }}>
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="stretch"
					spacing={3}
				>
					{ShareStatus()}
				</Grid>
			</Container>
			<Footer />
		</>
	);
}

export default ManagementUserSettings
