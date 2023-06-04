import { Avatar, Box, Button, CardHeader, styled, TextField } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useRef, useState } from "react";

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Reply } from "src/models/Comment";
import SendIcon from '@mui/icons-material/Send';
import commentSocket from "src/api/socket/commentSocket";
import socket from "src/models/socket";
import formatDate from "src/models/formatDate";

const ActionReply = styled('div')(
    {
        position: 'relative',
        top: '-8px',
        left: '45px',
        fontSize: '10px',
        marginBottom: '-15px'
    }
)

const ButtonShowReply = styled(Button)(
    {
        fontSize: '10px'
    }
)
const ButtonReply = styled(Button)(
    {
        fontSize: '10px',
        color: 'rgba(34, 51, 84, 0.7)'
    }
)
const ContainerReply = styled('div')(
    {
        marginLeft: '40px',
        borderBottom: '0.5px solid rgba(34, 51, 84, 0.1)'
    }
)

interface Props {
    data: Reply[]
    number: number
    login: boolean
    id: number
    index: number
    status: boolean
    detail: boolean
    expanded: boolean
}
let n = 0

export default function CommentsReply(props: Props) {
    //Hiển Thị tất cả bình luận
    const [show, setShow] = useState(false)
    //Hiển thị ô nhập phản hồi bình luận
    const [showInputReply, setShowInputReply] = useState(false)

    const textRComment = useRef<HTMLInputElement>()

    const [number, setNumber] = useState(props.number)

    const [data, setData] = useState<Reply[]>(props.data)

    useEffect(() => {
        //Tắt event để tái kích hoạt
        if (props.expanded === true) {
            const room = `receive_add_reply_comment_${props.id}`
            socket.off(room)

        }
    }, [props.expanded])

    async function send(e) {
        e.preventDefault()
        const text = textRComment.current.value
        if(text === '') return
        const action = await commentSocket.addReply(props.id, text)
        if (action) {
            textRComment.current.value = ''
            setData([action, ...data])
            props.data.unshift(action)
            setNumber(props.data.length)
        }

    }

    useEffect(() => {
        const room = `receive_add_reply_comment_${props.id}`
        socket.on(room, (res) => {
            setData([res, ...data])
            props.data.unshift(res)
            setNumber(props.data.length)
        })

    }, [props.id])

    const numberReply = () => {
        //Có bình luận phản hồi
        if (number !== 0) return (
            <ButtonShowReply size='small' onClick={() => setShow(!show)}
                style={{ display: number === 0 ? 'none' : 'inline-flex' }}>
                Xem {number} phản hồi
                {show === true ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize='small' />}
            </ButtonShowReply>
        )
    }

    const Input = () => {
        if (props.login === true && props.status === true) return (
            <>
                <ButtonReply size='small' onClick={(e) => { setShowInputReply(!showInputReply) }}>
                    Phản hồi
                </ButtonReply>
                <Box sx={{ display: showInputReply === true ? 'block' : 'none' }} pl={1}>
                    <form onSubmit={send}>
                        <TextField id="outlined-basic" label="Phản hồi..."
                            variant="outlined" size='small' inputRef={textRComment} />
                        <Button type='submit'>
                            <SendIcon />
                        </Button>
                    </form>
                </Box>
            </>
        )
        if (props.number === 0 && props.login === true) {
            return (
                <ButtonReply size='small' />
            )
        }
    }


    return (
        <>
            <ActionReply>
                {Input()}
                {numberReply()}
            </ActionReply>

            <ContainerReply hidden={!show}>
                {data.reverse().map((value, index) => {
                    return (
                        <CardHeader style={{ padding: '5px' }} key={index}
                            avatar={
                                <Avatar style={{ width: '25px', height: '25px' }} src={value.image} />

                            }
                            title={
                                <div>
                                    {value.name}
                                    <label style={{ fontSize: '9px', paddingLeft: '10px' }}>
                                        {formatDate(value.date)}
                                    </label>
                                </div>
                            }
                            subheader={value.content}
                        />
                    )
                })}
            </ContainerReply>
        </>
    )


}