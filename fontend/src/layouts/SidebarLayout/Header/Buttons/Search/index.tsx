import { forwardRef, Ref, useState, ReactElement, ChangeEvent } from 'react';
import {
	Avatar,
	Box,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	lighten,
	List,
	ListItem,
	ListItemAvatar,
	TextField,
	Theme,
	Tooltip,
	Typography,
	Dialog,
	DialogContent,
	DialogTitle,
	Slide,
	Hidden,
	Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';

import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import postSocket from 'src/api/socket/postSocket';
import Search from 'src/models/Search';
import { Link, useNavigate } from 'react-router-dom';
import { formatDatePost } from 'src/models/formatDate';
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import HowToRegIcon from '@mui/icons-material/HowToReg';
const Transition = forwardRef(function Transition(
	props: TransitionProps & { children: ReactElement<any, any> },
	ref: Ref<unknown>
) {
	return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
	() => `
    .MuiDialog-container {
        height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
        max-height: calc(100vh - 64px)
    }
`
);

const SearchInputWrapper = styled(TextField)(
	({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

const DialogTitleWrapper = styled(DialogTitle)(
	({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
`
);

let temp = ''
const DivShowSearch = styled(Link)(
	() => `
	text-decoration: none;
    font-weight: bold;
    color: #000000b5;
	`)
function HeaderSearch() {
	const [openSearchResults, setOpenSearchResults] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const [data, setData] = useState<Search[]>([])
	const [dataMini, setDataMini] = useState<Search[]>([])

	const navigate = useNavigate()

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setSearchValue(event.target.value);

		if (!event.target.value || event.target.value !== temp) {
			setOpenSearchResults(false)
		}
	}

	const submitSearch = (e) => {
		e.preventDefault()

		if (temp !== searchValue) {
			postSocket.search(searchValue).then((res) => {
				setData(res)
				setOpenSearchResults(true)
				setDataMini(res.slice(0, 3))
			})

			temp = searchValue
		}
	}

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const InputSearch = () => {
		if (data.length === 0) {
			return (
				<></>
			)
		}
		else return (
			<>
				<List disablePadding>
					{dataMini.map((value, index) => {
						return (
							<ListItem button key={index}>
								<Hidden smDown>
									<ListItemAvatar>
										<Link to={"/profile?id=" + value.user_id}>
											<Avatar src={value.user_image} />
										</Link>
									</ListItemAvatar>
								</Hidden>
								<Box flex="1" onClick={() => navigate(value.url_post)}>
									<Box display="flex" justifyContent="space-between">
										<DivShowSearch to={value.url_post}>
											{value.title_post}
										</DivShowSearch>
										<Typography
											component="span"
											variant="body2"
											sx={{
												color: (theme: Theme) =>
													lighten(theme.palette.secondary.main, 0.5)
											}}
										>
											{formatDatePost(value.time_post)}
										</Typography>
									</Box>
									<Grid container justifyContent="space-between" >
										<Grid item md={8} container alignItems='center' columnSpacing={1}>
											{value.type === 0 ?
												<Grid item>
													Tôi
												</Grid>
												:
												value.type == 1 ?
													<>
														<Grid item>
															<HowToRegIcon fontSize='small' />
														</Grid>
														<Grid item>
															{value.user_name} (bạn bè)
														</Grid>
													</>
													:
													<>
														<Grid item>
															<PersonIcon fontSize='small' />
														</Grid>
														<Grid item>
															{value.user_name}
														</Grid>
													</>
											}
										</Grid>
										<Grid item container alignItems='center' md={4} justifyContent='flex-end' spacing={1}>
											<Grid item>
												<ModeCommentIcon fontSize='small' color='primary' />
												{value.n_cmt}
											</Grid>
											<Grid item>
												<FavoriteIcon fontSize='small' color='error' />
												{value.n_like}
											</Grid>
										</Grid>

									</Grid>
								</Box>
								<ChevronRightTwoToneIcon />
							</ListItem>

						)
					})}

				</List>
				<Divider sx={{ mt: 1, mb: 2 }} />
				{data.length > 3 && dataMini.length !== data.length ?
					<Box sx={{ textAlign: 'center' }}>
						<Button color="primary" onClick={() => setDataMini(data)}>Xem tất cả</Button>
					</Box> : <></>
				}
			</>
		)
	}

	const numberSearch = () => {
		if (data.length !== 0) return (
			<Typography variant="body2" component="span">
				Tìm thấy <b>{data.length}</b> bài viết với từ khóa: {' '}
				<Typography
					sx={{ fontWeight: 'bold' }}
					variant="body1"
					component="span"
				>
					{searchValue}
				</Typography>
			</Typography>
		)
		else return (
			<Typography variant="body2" component="span">
				Không tìm thấy kết quả nào cho từ khóa: {' '}
				<Typography
					sx={{ fontWeight: 'bold' }}
					variant="body1"
					component="span"
				>
					{searchValue}
				</Typography>
			</Typography>
		)
	}
	return (
		<>
			<Tooltip arrow title="Tìm Kiếm">
				<IconButton color="primary" onClick={handleClickOpen}>
					<SearchTwoToneIcon />
				</IconButton>
			</Tooltip>

			<DialogWrapper
				open={open}
				TransitionComponent={Transition}
				keepMounted
				maxWidth="md"
				fullWidth
				scroll="paper"
				onClose={handleClose}

			>
				<DialogTitleWrapper>
					<form onSubmit={submitSearch}>
						<SearchInputWrapper required
							value={searchValue}
							autoFocus={true}
							onChange={handleSearchChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchTwoToneIcon />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<Button variant='contained' type='submit'>Tìm</Button>
									</InputAdornment>
								)
							}}
							placeholder="Nhập từ khóa..."
							fullWidth
							label="Tìm kiếm" />
					</form>
				</DialogTitleWrapper>
				<Divider />

				{openSearchResults && (
					<DialogContent>
						<Box
							sx={{ pt: 0, pb: 1 }}
							display="flex"
							justifyContent="space-between"
						>
							{numberSearch()}
						</Box>
						<Divider sx={{ my: 1 }} />
						{InputSearch()}

					</DialogContent>
				)}
			</DialogWrapper>
		</>
	);
}

export default HeaderSearch;
