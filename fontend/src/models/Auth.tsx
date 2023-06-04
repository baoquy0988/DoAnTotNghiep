import User from "./User"

export interface Register {
    name: string
    user_name: string
    password: string
    email: string
    //Xac nhận captcha để tránh spam
    captcha: string
}
export interface Login {
    user_name: string
    password: string
    captcha: string
}

//Kiểm tra kết quả trả về từ server khi đăng ký tài khoản
export interface CheckRegister {
    captcha: boolean
    server: boolean | undefined
    user_name: boolean | undefined
}
export interface CheckLogin{
    captcha: boolean
    server: boolean | undefined
    //false nếu thông tin tài khoản không chính xác
    account: boolean | undefined
    data: User | undefined
}

export interface CheckLoginToken{
    token: boolean | undefined
    server: boolean | undefined
    data: User | undefined
}