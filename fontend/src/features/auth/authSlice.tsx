import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "src/models/User";

export interface AuthState {
    //Tiến hành đăng xuất khi có người dùng thay đổi mật khẩu ở nơi khác
    requestLogout: boolean
    login: boolean
    currentlyLogged: boolean
    currentUser: User
}

const setup: User = {
    id: 0,
    name: 'Khách',
    image: '/static/images/avatars/1.jpg',
    email: '',
    token: '',
    status: false,
    description: '',
    friend: [],
    accept: [],
    invitation: [],
    level: false,
    band: false,
    reason: undefined
}

const initialState: AuthState = {
    requestLogout: false,
    login: false,
    currentlyLogged: false,
    currentUser: setup
}

export interface LogginPayLoad {
    token: string
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //Đang tiến hành đăng nhập
        currentlyLogged(state) {

            state.currentlyLogged = true
        },
        loginSuccess(state, action: PayloadAction<User>) {
            state.requestLogout = false
            state.login = true
            state.currentUser = action.payload
            state.currentlyLogged = false
        },
        loginFail(state) {
            state.currentlyLogged = false
            state.login = false
            state.currentUser = setup
        },
        logout(state) {
            state.currentlyLogged = false
            state.login = false
            state.currentUser = setup
        },
        editAvatar(state, action: PayloadAction<string>) {
            state.currentUser.image = action.payload
        },
        requestLogout(state) {
            state.requestLogout = true
            state.currentlyLogged = false
            state.login = false
            state.currentUser = setup
        },
        setStatus(state) {
            state.currentUser.status = false
        },
        setBand(state, action: PayloadAction<Date | boolean>) {
            state.currentUser.band = action.payload
        },
        setReason(state, action: PayloadAction<string>) {
            state.currentUser.reason = action.payload
        }
    }
})
export const selecIsUser = (state): User => state.auth.currentUser
export const selectIsLogin = (state): boolean => state.auth.login
export const selectIsLogged = (state): boolean => state.auth.currentlyLogged
export const selectIsReq = (state): boolean => state.auth.requestLogout
export const selecIsBand = (state): Date | boolean => state.auth.currentUser.band
export const selecIsReason = (state): string | undefined => state.auth.currentUser.reason


export const authActions = authSlice.actions
const authReducer = authSlice.reducer
export default authReducer