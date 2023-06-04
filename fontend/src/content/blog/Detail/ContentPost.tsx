import {
    Box,
    CardMedia,
    Typography,
    Card,
    CardHeader,
    Divider,
    Avatar,
    IconButton,
    Button,
    CardActions,
    Link,
    Grid,
    Switch,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import parse from 'html-react-parser'
import { Dispatch, useEffect, useState } from 'react';

import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import PostDetail from 'src/models/PostDetail'
import PublicIcon from '@mui/icons-material/Public'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import LockOpenIcon from '@mui/icons-material/LockOpen'

//user_id trong Post là người đăng


export default function Content(props: { value: PostDetail, show: boolean, setShow: Dispatch<React.SetStateAction<boolean>> }) {
    const data: PostDetail = props.value

    const status = () => {
        if (data.share === 0) {
            return (
                <Grid container>
                    <Tooltip title="Công Khai">
                        <PublicIcon fontSize='small' sx={{ mr: '10px' }} />
                    </Tooltip>
                    {data.date}
                </Grid>
            )
        }
        if (data.share === 1) {
            return (
                <Grid container>
                    <Tooltip title="Bạn Bè">
                        <PeopleAltIcon fontSize='small' sx={{ mr: '10px' }} />
                    </Tooltip>
                    {data.date}
                </Grid>
            )
        } return (
            <Grid container>
                <Tooltip title="Chỉ Mình Tôi">
                    <LockOpenIcon fontSize='small' sx={{ mr: '10px' }} />
                </Tooltip>
                {data.date}
            </Grid>
        )
    }
    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    avatar={<Avatar src={data.image} />}
                    action={
                        <Button onClick={(e) => props.setShow(!props.show)}>
                            {props.show === true ? <OpenInFullIcon fontSize='inherit' />
                                : <CloseFullscreenIcon fontSize='inherit' />}
                        </Button>
                    }
                    titleTypographyProps={{ variant: 'h4' }}
                    subheaderTypographyProps={{ variant: 'subtitle2' }}
                    title={data.user_name}
                    subheader={status()}
                />
                <Box px={3}>
                    <Typography variant="h3">
                        {data.name}
                    </Typography>
                </Box>
                {/* <CardMedia
        sx={{ minHeight: 280 }}
        image="/static/images/placeholders/covers/6.jpg"
        title="Card Cover"
    /> */}
                <Box p={3} pt={0}>
                    <Typography>
                        {parse(data.content)}

                    </Typography>
                    {/* <Typography variant="subtitle2">
            <Link href="#" underline="hover">
                example.com
            </Link>{' '}
            • 4 mins read
        </Typography> */}
                </Box>
                <Divider />

            </Card>
        </Grid>
    )
}