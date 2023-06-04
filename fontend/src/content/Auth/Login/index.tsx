import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material"
import { Alert, AlertColor, Button, Grid, IconButton, InputAdornment, Snackbar, Typography } from "@mui/material"
import Box from "@mui/material/Box/Box"
import Card from "@mui/material/Card"
import TextField from "@mui/material/TextField"
import { Helmet } from "react-helmet-async"

import LockOpenIcon from '@mui/icons-material/LockOpen'
import ReCAPTCHA from "react-google-recaptcha"
import SITE_KEY from 'src/models/KEY'
import { useRef, useState } from "react"

import AuthSocket from "src/api/socket/authSocket"
import { Login } from "src/models/Auth"
import User from "src/models/User"
import { authActions } from "src/features/auth/authSlice"
import loginSocket from "src/api/socket/loginSocket"
import { useAppDispatch } from "src/app/hooks"
import { useNavigate } from "react-router-dom"

interface Snack {
    type: AlertColor
    text: string
    open: boolean
}

function AuthLogin() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState<Login>({
        user_name: '',
        password: '',
        captcha: ''
    })

    //Hộp thoại thông báo
    const [show, setShow] = useState<Snack>({
        open: false,
        type: "success",
        text: ""
    })


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return
        setShow({ ...show, open: false })
    }
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    async function onClickRegister(e) {
        e.preventDefault()
        
        if (form.captcha === '') {
            setShow({
                open: true,
                type: 'error',
                text: 'Vui lòng xác thực captcha'
            })
            recaptchaRef.current.reset()
            return
        }

        const action = await AuthSocket.login(form)

        if (action.captcha === false) {
            setShow({
                open: true,
                type: 'error',
                text: 'Captcha không hợp lệ hoặc hết hạn'
            })
            recaptchaRef.current.reset()
            return
        }
        if (action.server === false) {
            setShow({
                open: true,
                type: 'error',
                text: 'Có lỗi xảy ra vui lòng thử lại'
            })
            recaptchaRef.current.reset()
            return
        }
        if (action.account === false) {
            setShow({
                open: true,
                type: 'error',
                text: 'Thông tin tài khoản không chính xác'
            })
            recaptchaRef.current.reset()
            return
        }

        //Lưu thông tin
        if (action.data) {
            //Lưu token
            const data: User = action.data
            localStorage.setItem('token', data.token)
            dispatch(authActions.loginSuccess(data))
            loginSocket.login(data.token)

            setShow({
                open: true,
                type: 'success',
                text: 'Đăng nhập khoản thành công'
            })
            // console.log(navigate)
            navigate('/home')
        }
    }
    return (
        <>
            <Helmet>
                <title>Đăng Nhập</title>
            </Helmet>
            <Typography variant="h3" p={4} textAlign='center'>Đăng Nhập</Typography>
            <Card>
                <Box p={4}>
                    <form onSubmit={onClickRegister}>
                        <Grid container spacing={2} >

                            <Grid item md={12}>
                                <TextField id="outlined-basic" label="Tên Tài Khoản"
                                    variant="outlined" fullWidth required
                                    onChange={(e) => { setForm({ ...form, user_name: e.target.value }) }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextField id="outlined-basic" label="Mật Khẩu" required
                                    variant="outlined" fullWidth type={showPass === true ? 'text' : 'password'}
                                    onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOpenIcon />
                                            </InputAdornment>

                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => { setShowPass(!showPass) }}
                                                // onMouseDown={()=>{}}
                                                >
                                                    {showPass ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item container md={12} justifyContent='center'>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    onExpired={() => { setForm({ ...form, captcha: '' }) }}
                                    sitekey={SITE_KEY}
                                    onChange={(value) => setForm({ ...form, captcha: value })}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Button variant="contained" fullWidth type='submit'>Đăng Nhập</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box >
                <Snackbar
                    open={show.open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                >
                    <Alert severity={show.type}>{show.text}</Alert>
                </Snackbar>

            </Card>
        </>
    )
}
export default AuthLogin


