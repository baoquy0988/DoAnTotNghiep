import { Avatar, CardHeader, Grid, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InfoFriend from "src/models/Friend"
import { useEffect, useState } from "react";
import userSocket from "src/api/socket/userSocket";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async'


function AllFriend(props: {data: InfoFriend[]}) {

    const container = () => {
        if (props.data.length === 0) {
            return (
                <Grid item>Chưa có bạn bè</Grid>
            )
        }
        else {
            return props.data.map((value, index) => {
                return (
                    <Grid item md={3} sm={6} xs={12} key={index}>
                        <CardHeader
                            avatar={
                                <Link to={"/profile?id=" + value.id}>
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={value.image} />
                                </Link>
                            }
                            title={value.name}
                        />
                    </Grid>
                )
            })
        }
    }
    return (
        <>
            <Helmet>
                <title>Danh Sách Bạn Bè</title>
            </Helmet>
            <Grid container>
                {container()}
            </Grid>
        </>
    )
}
export default AllFriend