import { Card, CardHeader, Avatar, Button, CardActions, styled } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import InfoPost from "src/models/InfoPost"
import { Link } from "react-router-dom"

const Name = styled(Link)(
    () => `text-decoration: none;
        color: #223354`
)

export default function TooltipInfoUser(props: { data: InfoPost }) {
    return (
        <Card sx={{ backgroundColor: '!important' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ width: '100px', height: '100px' }} src={props.data.image} />
                }
                titleTypographyProps={{ variant: 'h1' }}
                title={
                    <Name to={"/profile?id=" + props.data.user_id}>{props.data.user_name}</Name>
                }
                subheader={
                    <>fsaf
                        <br />
                        fsafasfs
                    </>
                }
            >

            </CardHeader>

            <CardActions>
                <Button size="small" variant='contained'>
                    <PersonAddIcon />
                    &nbsp;Thêm bạn bè
                </Button>
            </CardActions>
        </Card>
    )
}