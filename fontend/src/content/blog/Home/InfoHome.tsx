
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import User from 'src/models/User'
import Divider from '@mui/material/Divider'
import { Grid } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PostAddIcon from '@mui/icons-material/PostAdd'

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}


export default function RecipeReviewCard(props: { user: User }) {

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader title="Thống kê " sx={{ backgroundColor: '#5569ffc7' }}/>
            <CardContent>
                <Grid container>
                    <Grid item container md={8} rowSpacing={1}>
                        <Grid item container alignItems='center'>
                            <PeopleIcon fontSize='small' />
                            Số thành viên:
                        </Grid>
                        <Grid item container alignItems='center'>
                            <PostAddIcon fontSize='small' />
                            Số bài viết:
                        </Grid>
                    </Grid>
                    <Grid item container md={4} direction='column'
                        rowSpacing={1} alignItems="flex-end">
                        <Grid item>
                            6
                        </Grid>
                        <Grid item>
                            9
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />

        </Card>
    )
}
