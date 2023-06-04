import {
    Box,
    CardHeader,
    Grid,
    ListItem,
} from '@mui/material'

import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { intlFormatDistance } from 'date-fns'

const Title = styled(Box)(
    () => `
    display: -webkit-box;
    color: #0000006e;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 14px;
    -webkit-box-orient: vertical;`
)
const Name = styled(Link)(
    () => `
    text-decoration: none;
    color: #000000ab;
    `
)
interface Props{
    date: Date
    user_name: string
    user_url: string
}
export default function SuccessAddFriend(props: Props) {

    const timeReceive = () => {
        return (
            <Grid container justifyItems='center'>
                <Grid fontSize="12px">
                    {intlFormatDistance(props.date, Date.now())}
                </Grid>
            </Grid>
        )
    }

    const titleReceive = () => {
        return (
            <Title>
                Bạn và
                <Name to={props.user_url} >&nbsp;{props.user_name}&nbsp;</Name>
                đã trở thành bạn bè
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
                title={titleReceive()}
                subheader={timeReceive()}
            />
        </ListItem>
    )
}