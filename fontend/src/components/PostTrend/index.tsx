import { MouseEvent, useState, useEffect } from 'react'
import {
    Button,
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Card,
    Typography,
} from '@mui/material'
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone'
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone'

import PostInfo from './PostInfo'
import PostTable from './PostInfoTable'
import CreatePost from 'src/components/CreatePost'
import { useAppSelector } from 'src/app/hooks'
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice'
import postSocket from 'src/api/socket/postSocket'
import InfoPost from 'src/models/InfoPost'


function WatchList(prop: { item: number }) {
    const [tabs, setTab] = useState<string | null>('watch_list_columns')

    const handleViewOrientation = (
        _event: MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        setTab(newValue);
    }

    const[pTrend, setPTrend] = useState<InfoPost[]>([])

	useEffect(()=>{
        async function trend() {
            const action = await postSocket.trend()
            if(action !== true && action !== false)
                setPTrend(action)
        }
        trend()
    },[])

    return (
        <>
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                pb: 3
            }}
        >
            <Typography variant="h3">Bài Viết</Typography>
            <ToggleButtonGroup
                value={tabs}
                exclusive
                onChange={handleViewOrientation}
            >
                <ToggleButton disableRipple value="watch_list_columns">
                    <ViewWeekTwoToneIcon />
                </ToggleButton>
                <ToggleButton disableRipple value="watch_list_rows">
                    <TableRowsTwoToneIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>

        {tabs === 'watch_list_columns' && <PostInfo data={pTrend} item={prop.item} />}

        {tabs === 'watch_list_rows' && <PostTable data={pTrend}/>}

        {!tabs && (
            <Card
                sx={{
                    textAlign: 'center',
                    p: 3
                }}
            >
                <Typography
                    align="center"
                    variant="h2"
                    fontWeight="normal"
                    color="text.secondary"
                    sx={{
                        mt: 3
                    }}
                    gutterBottom
                >
                    Chọn kiểu hiện thị                    
                </Typography>
            </Card>
        )}
        </>
    )
}

export default WatchList
