import { Notification } from "src/models/Noti"
import {
    Avatar,
    Button,
    CardHeader,
    Grid,
    ListItem,
} from '@mui/material'

import { Link } from 'react-router-dom'
import { red } from "@mui/material/colors"
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import { styled } from '@mui/material/styles'
import { intlFormatDistance } from 'date-fns'
import { useAppDispatch } from "src/app/hooks"
import { notiActions } from "src/features/notiSlice"
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import userSocket from "src/api/socket/userSocket"
const Title = styled(Link)(
    () => `text-decoration: none;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 14px;
    -webkit-box-orient: vertical;`
)
const Time = styled(Link)(
    () => `text-decoration: none;
        color: #888888;`
)

interface Props {
    data: Notification
    watched: boolean
    index: number
}

//Thông báo khi có người gửi yêu cầu kết bạn
export default function AcceptFriend(props: Props) {
    const dispatch = useAppDispatch()

    const timeReceive = () => {
        return (
            <Grid container justifyItems='center'>
                <Grid item>
                    <PersonAddAlt1Icon fontSize='small' color="primary" />
                </Grid>

                <Grid pl={0.5} fontSize="12px">
                    {intlFormatDistance(props.data.time, Date.now())}
                </Grid>
            </Grid>
        )
    }

    function onClickAddFriend() {
        console.log(props.data.user_id)
        userSocket.acceptAddFriend(props.data.user_id).then(() => {
            //Chấp nhận kết bạn
            dispatch(notiActions.acceptAddFriend(props.index))

        })
    }

    const titleReceive = () => {
        return (
            <Grid container >
                <Grid item md={12}>

                    <b>{props.data.user_name}&nbsp;</b>
                    <label>vửa gửi lời mời kết bạn</label>
                </Grid>
                <Grid item container>
                    <Grid item>
                        <Button size="small" variant="contained" onClick={onClickAddFriend}>
                            Chấp Nhận
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button size="small" color="error">Xóa</Button>
                    </Grid>
                </Grid>
            </Grid>
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
                    <Link to={props.data.url_user}>
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={props.data.image_user} />
                    </Link>
                }

                title={titleReceive()}
                subheader={timeReceive()}
            />
        </ListItem>
    )
}