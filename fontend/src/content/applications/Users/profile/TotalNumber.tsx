import {
	Box,
	Typography,
	Card,
	CardHeader,
	Divider,
	Avatar,
	useTheme,
	styled,
	Grid,
} from '@mui/material';

import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { SumNumberLikeComment } from 'src/models/Info';

const AvatarPrimary = styled(Avatar)(
	({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
`
);

function TotalNumber(props: { data: SumNumberLikeComment }) {

	const theme = useTheme();

	return (
		<Card>
			<CardHeader title="Hoạt Động" subheader='Số lượng đánh giá'/>
			<Divider />
			<Box px={1} py={2} display="flex" alignItems="flex-start">
				<AvatarPrimary>
					<PostAddIcon />
				</AvatarPrimary>
				<Box pl={1} flex={1}>
					<Typography variant="h4">Bài viết</Typography>
					<Grid container spacing={1} paddingTop={1}>
						<Grid item xs={6} md={6}>
							<Typography variant="subtitle1">
								Số lượng
							</Typography>
							<Typography variant="h3">{props.data.sum_post}</Typography>
						</Grid>
						<Grid item xs={6} md={6} textAlign='right' pr={2}>
							<Typography variant="subtitle1">
								Ẩn
							</Typography>
							<Typography variant="h3">0</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Divider />
			<Box px={1} py={2} display="flex" alignItems="flex-start">
				<AvatarPrimary>
					<FavoriteTwoToneIcon />
				</AvatarPrimary>
				<Box pl={1} flex={1}>
					<Typography variant="h4">Đánh giá</Typography>
					<Grid container spacing={1} paddingTop={1}>
						<Grid item xs={12} md={6}>
							<Typography variant="subtitle1">
								Bình luận
							</Typography>
							<Typography variant="h3">{props.data.sum_comment}</Typography>
						</Grid>
						<Grid item xs={12} md={6} textAlign='right' pr={2}>
							<Typography variant="subtitle1">
								Thích
							</Typography>
							<Typography variant="h3">{props.data.sum_like}</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Divider />
		</Card>
	)
}

export default TotalNumber
