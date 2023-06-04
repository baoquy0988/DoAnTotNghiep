import { Notification } from "src/models/Noti"
import {
    Avatar,
    CardHeader,
    Grid,
    ListItem,
} from '@mui/material'

import { Link } from 'react-router-dom'
import { red } from "@mui/material/colors"
import { styled } from '@mui/material/styles'
import { intlFormatDistance } from 'date-fns'
import { useAppDispatch } from "src/app/hooks"
import { notiActions } from "src/features/notiSlice"
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

const Title = styled(Link)(
    () => `text-decoration: none;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 14px;
    -webkit-box-orient: vertical;`
)

interface Props {
    data: Notification
    watched: boolean
    index: number
}

//Thông báo có người bình luận vào bài viết của bạn
export default function ReceieLikePost(props: Props) {
    const dispatch = useAppDispatch()

    const timeReceive = () => {
        return (
            <Grid container justifyItems='center'>
                <Grid item>
                    <ThumbUpIcon fontSize='small' color="primary" />
                </Grid>
                <Grid pl={0.5} fontSize="12px">
                    {intlFormatDistance(props.data.time, Date.now())}
                </Grid>
            </Grid>
        )
    }
    //Đã xem
    function onClickWatched() {
        dispatch(notiActions.watched(props.index))
    }

    const numberLike = () => {
        const sum = props.data.list_like.length - 1
        if (sum !== 0) return (
            <label>và {sum} người khác đã thích bài viết của bạn.</label>
        )
        return (
            <label>đã thích bài viết của bạn.</label>
        )
    }

    const titleReceive = () => {
        return (
            <Title to={props.data.url_user} onClick={onClickWatched}
                sx={{ color: props.watched === true ? '#0000006e' : 'black' }}>
                <b>{props.data.user_name}&nbsp;</b>
                {numberLike()}
                <b>&nbsp;{props.data.title_post}</b>
            </Title>
        )
    }

    return (
        <ListItem
            sx={{
                width: 350, display: { xs: 'block', sm: 'flex' },
                borderBottom: '1px solid #f4f4f4'
            }}
        >
            <CardHeader sx={{ p: 0 }}
                avatar={
                    <Link to={props.data.url_user} onClick={onClickWatched}>
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={props.data.image_user} />
                    </Link>
                }

                title={titleReceive()}
                subheader={timeReceive()}
            />
        </ListItem>
    )
}