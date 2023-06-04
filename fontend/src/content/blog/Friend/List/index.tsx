import { useState, ChangeEvent, useEffect } from 'react'

import PageHeader from './PageHeader'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import { Container, Tabs, Tab, Grid, Badge, AlertColor, Alert, Button } from '@mui/material'
import Footer from 'src/components/Footer'
import { styled } from '@mui/material/styles'

import { useNavigate } from 'react-router-dom'
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice'
import { useAppSelector } from 'src/app/hooks'
import userSocket from 'src/api/socket/userSocket'
import SettingsUser from 'src/models/SettingsUser'
import AllFriend from './AllFriend'
import RequestFriend from './RequestFriend'
import InfoFriend from 'src/models/Friend'
import Snackbar from '@mui/material/Snackbar';
import { Helmet } from 'react-helmet-async'

const TabsWrapper = styled(Tabs)(
    () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
)

interface Data {
    list: InfoFriend[]
    req: InfoFriend[]
}

interface Snack {
    type: AlertColor
    text: string
    open: boolean
}

function ManagementUserSettings() {
    const [currentTab, setCurrentTab] = useState<string>('all_friend')

    const [show, setShow] = useState<Snack>({
        open: false,
        type: "success",
        text: ""
    })

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setShow({ ...show, open: false });
    }


    const tabs = [
        { value: 'all_friend', label: 'Tất Cả Bạn Bè' },
        { value: 'requests', label: 'Yêu Cầu Kết Bạn' }
    ]

    const [number, setNumber] = useState([0, 0])

    const navigate = useNavigate()
    const login = useAppSelector(selectIsLogin)


    const [data, setData] = useState<Data>({
        list: [],
        req: []
    })

    useEffect(() => {
        if (login) {
            userSocket.getFriend().then((res) => {
                setData({
                    list: res.list,
                    req: res.req
                })
                setNumber([res.list.length, res.req.length])
            })
        }
    }, [login])


    function SuccessAddFriend(index: number, item: InfoFriend) {
        let temp = data.req
        temp.splice(index, 1)

        let temp_2 = data.list
        temp_2.unshift(item)
        setData({ list: temp_2, req: temp })

        setNumber([temp_2.length, temp.length])
        setShow({
            open: true,
            type: "success",
            text: "Thêm bạn bè thành công"
        })
    }

    function ErrorAddFriend() {
        setShow({
            open: true,
            type: "error",
            text: "Thêm bạn bè thất bại"
        })
    }

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    }


    function container() {
        if (!login)
            return (
                <>
                    <Helmet>
                        <title>Danh Sách Bạn Bè</title>
                    </Helmet>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={3}
                    >
                        <Grid item xs={12} md={12} >
                            <Button onClick={() => navigate('/auth/login')}
                                variant='contained' color='error' fullWidth>
                                Vui lòng đăng nhập
                            </Button>

                        </Grid>
                    </Grid>
                </>
            )
        else
            return (
                <>
                    <PageTitleWrapper>
                        <PageHeader />
                    </PageTitleWrapper>
                    <Container maxWidth="lg">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                <TabsWrapper
                                    onChange={handleTabsChange}
                                    value={currentTab}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    textColor="primary"
                                    indicatorColor="primary"
                                >
                                    {tabs.map((tab, index) => (
                                        <Tab key={tab.value} value={tab.value}
                                            label={
                                                <Badge badgeContent={number[index]} color="error" sx={{ px: 1 }}>
                                                    {tab.label}
                                                </Badge>
                                            }
                                        />

                                    ))}
                                </TabsWrapper>
                            </Grid>
                            <Grid item xs={12}>
                                {currentTab === 'all_friend' && <AllFriend data={data.list} />}
                                {currentTab === 'requests' && <RequestFriend data={data.req}
                                    setData={SuccessAddFriend} err={ErrorAddFriend} />}
                            </Grid>
                        </Grid>
                    </Container>
                </>
            )
    }

    return (
        <>
            <Container sx={{ mt: 3 }} maxWidth="lg">
                {container()}
            </Container>
            <Snackbar
                open={show.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert color={show.type}>{show.text}</Alert>
            </Snackbar>
            <Footer />
        </>
    )
}

export default ManagementUserSettings
