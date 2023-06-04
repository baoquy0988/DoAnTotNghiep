
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Badge, Link, Tooltip } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import InfoPost from 'src/models/InfoPost'
import { useNavigate } from 'react-router'
import parse from 'html-react-parser'

export default function RecipeReviewCard(props: { data: InfoPost[], item: number }) {
    const navigate = useNavigate()

    const getUrl = (url: string) => {
        navigate(url)
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {props.data.map((value, index) => {
                    return (
                        <Grid item lg={props.item} key={index}>
                            <Card sx={{ maxWidth: 500 }}>
                                <CardHeader
                                    avatar={
                                        <Tooltip title={value.user_name}>
                                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={value.image} />
                                        </Tooltip>
                                    }
                                    title={
                                        <Link component="button" onClick={() => getUrl(value.url)}
                                            underline="none" color='red' variant='h5'>
                                            <div style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            }}>
                                                {value.name}
                                            </div>
                                        </Link>
                                    }
                                    subheader={value.date}
                                />

                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="https://img.freepik.com/free-photo/abstract-grunge-decorative-relief-navy-blue-stucco-wall-texture-wide-angle-rough-colored-background_1258-28311.jpg?w=2000"
                                    alt="Paella dish"
                                />

                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                        maxHeight: '50px'
                                    }}>
                                        {parse(value.content)}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <Grid item lg={6}>
                                        <IconButton aria-label="add to favorites" disabled>
                                            <Badge badgeContent={value.n_like} color="primary">
                                                <FavoriteIcon color='error' />
                                            </Badge>
                                        </IconButton>

                                        <IconButton aria-label="comments" disabled>
                                            <Badge badgeContent={value.n_comments} color="primary">
                                                <ChatBubbleOutlineIcon />
                                            </Badge>
                                        </IconButton>
                                    </Grid>
                                    <Grid item lg={6} container
                                        direction="row"
                                        justifyContent="flex-end"
                                    >
                                        <IconButton aria-label="share">
                                            <ShareIcon />
                                        </IconButton>
                                    </Grid>
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Box >
    )
}

