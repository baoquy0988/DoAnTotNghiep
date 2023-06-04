import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material"
import { Alert, AlertColor, Button, FormControl, Grid, IconButton, InputAdornment, Snackbar, Typography } from "@mui/material"
import Box from "@mui/material/Box/Box"
import Card from "@mui/material/Card"
import TextField from "@mui/material/TextField"
import { Helmet } from "react-helmet-async"

import AbcIcon from '@mui/icons-material/Abc'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import ReCAPTCHA from "react-google-recaptcha"
import SITE_KEY from 'src/models/KEY'
import { useRef, useState } from "react"
import { Register } from "src/models/Auth"
import Label from "src/components/Label"
import AuthSocket from "src/api/socket/authSocket"
import { useNavigate } from "react-router-dom"

interface Snack {
    type: AlertColor
    text: string
    open: boolean
}

function AuthRegister() {
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    const [showPass, setShowPass] = useState(false)
    const navigate = useNavigate()
    const [form, setForm] = useState<Register>({
        name: '',
        user_name: '',
        password: '',
        email: '',
        captcha: ''
    })
    //Hộp thoại thông báo
    const [show, setShow] = useState<Snack>({
        open: false,
        type: "success",
        text: ""
    })

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

        const action = await AuthSocket.register(form)
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
        if (action.user_name === false) {
            setShow({
                open: true,
                type: 'error',
                text: 'Tên tài khoản tồn tại'
            })
            recaptchaRef.current.reset()
            return
        }

        setShow({
            open: true,
            type: 'success',
            text: 'Đăng ký tài khoản thành công'
        })
        navigate('/auth/login')
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return
        setShow({ ...show, open: false })
    }

    return (
        <>
            <Helmet>
                <title>Đăng Ký</title>
            </Helmet>
            <Typography variant="h3" p={4} textAlign='center'>Đăng Ký Tài Khoản</Typography>
            <Card>
                <Box p={4}>
                    <form onSubmit={onClickRegister}>
                        <Grid container spacing={2} >
                            <Grid item md={12}>
                                <TextField id="outlined-basic" label="Tên Của Bạn"
                                    variant="outlined" fullWidth required
                                    onChange={(e) => { setForm({ ...form, name: e.target.value }) }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AbcIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextField id="outlined-basic" label="Email"
                                    variant="outlined" fullWidth type='email' required
                                    onChange={(e) => { setForm({ ...form, email: e.target.value }) }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

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
                                <Button variant="contained" fullWidth type='submit'>Đăng Ký</Button>
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
export default AuthRegister