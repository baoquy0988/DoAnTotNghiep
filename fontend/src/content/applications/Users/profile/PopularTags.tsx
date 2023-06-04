import {
	Card,
	CardHeader,
	Divider,
	List,
	ListItem,
	ListItemText,
	Avatar,
	useTheme,
	styled,
} from '@mui/material'

import PlaceIcon from '@mui/icons-material/Place'
import CakeIcon from '@mui/icons-material/Cake'

import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'

const ListWrapper = styled(List)(
	() => `
      .MuiListItem-root {
        border-radius: 0;
        margin: 0;
      }
`
);

function PopularTags() {
	const theme = useTheme()

	return (
		<Card sx={{ height: '100%' }}>
			{/* <CardHeader title="Cơ Bản" /> */}
			<Divider />
			<ListWrapper disablePadding>
				<ListItem 
					sx={{
						color: `${theme.colors.primary.main}`,
						'&:hover': { color: `${theme.colors.primary.dark}` },
						padding: '13px'
					}}
					button
				>
					<PlaceIcon fontSize='small' color='error' />
					<ListItemText primary="Thừa Thiên Huế" />

				</ListItem>
				<Divider />
				<ListItem
					sx={{
						color: `${theme.colors.primary.main}`,
						'&:hover': { color: `${theme.colors.primary.dark}` },
						padding: '13px'
					}}
					button
				>
					<CakeIcon fontSize='small' color='warning' />
					<ListItemText primary="15-08-2000" />
				</ListItem>
				<Divider />
				<ListItem
					sx={{
						color: `${theme.colors.primary.main}`,
						'&:hover': { color: `${theme.colors.primary.dark}` },
						padding: '13px'
					}}
					button
				>
					<MaleIcon fontSize='small' color='primary' />
					<ListItemText primary="Nam" />
				</ListItem>
				<Divider />
				<ListItem
					sx={{
						color: `${theme.colors.primary.main}`,
						'&:hover': { color: `${theme.colors.primary.dark}` },
						padding: '12px'
					}}
					button
				>
					<LocalPhoneIcon fontSize='small' color='success' />
					<ListItemText primary="0353.981.782" />
				</ListItem>
				<Divider />

			</ListWrapper>
		</Card>
	);
}

export default PopularTags
