
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import User from 'src/models/User'
import Divider from '@mui/material/Divider'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}


export default function RecipeReviewCard(props: { user: User }) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        // avatar={
        //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={props.user.image}/>

        // }
        title="Thống kê "
        // subheader="15-08-2000"
		sx={{backgroundColor: 'red'}}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          1. Số lượng bài viết
		  <br/>
		  2. Số lượng thành viên
        </Typography>
      </CardContent>
	
	  <CardHeader
        title='Thành viên online'
        // subheader="15-08-2000"
		sx={{backgroundColor: 'red'}}
      />
		<Divider />


    </Card>
  )
}
