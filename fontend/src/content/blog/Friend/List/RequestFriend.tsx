import { Avatar, Button, CardHeader, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import userSocket from "src/api/socket/userSocket"
import InfoFriend from "src/models/Friend"
import { Helmet } from 'react-helmet-async'
import { Link } from "react-router-dom"
import { formatDatePost } from 'src/models/formatDate'

interface Data {
    list: InfoFriend[]
    req: InfoFriend[]
}
interface Props {
    data: InfoFriend[]
    setData: Function
    err: Function
}
function RequestFriend(props: Props) {

    function onClick(id: number, index: number) {
        userSocket.acceptAddFriend(id).then(() => {
            props.setData(index, props.data[index])
        }).catch(() => {
            props.err()
        })
    }

    const container = () => {
        if (props.data.length === 0) {
            return (
                <Grid item>Không có lời mời kết bạn nào</Grid>
            )
        }
        else {
            return props.data.map((value, index) => {
                return (
                    <Grid item md={3} sm={6} xs={12} key={index}>
                        <CardHeader
                            avatar={
                                <Link to={"/profile?id=" + value.id}>
                                    <Avatar aria-label="recipe" src={value.image} />
                                </Link>
                            }
                            title={
                                <>
                                    <b>{value.name}</b>
                                    <i style={{ fontSize: '10px' }}> {formatDatePost(value.time)}</i>
                                </>
                            }
                            subheader={
                                <Button variant="contained"
                                    size="small" color="success"
                                    onClick={() => onClick(value.id, index)}>
                                    Chấp Nhận
                                </Button>
                            }
                        />
                    </Grid >
                )
            })
        }
    }

    return (
        <>
            <Helmet>
                <title>Yêu Cầu Kết Bạn</title>
            </Helmet>
            <Grid container>
                {container()}
            </Grid>
        </>
    )
}
export default RequestFriend