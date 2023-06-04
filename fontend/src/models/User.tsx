
export default interface User {
    id: number
    name: string
    image: string
    email: string
    token: string
    status: boolean
    description: string
    friend: number[]
    //Lời mời kết bạn chưa được bạn chấp nhận
    accept: number[]
    //Lời mời đang đợi người khác chấp nhận
    invitation: number[]
    level: boolean
    //Tài khoản bị cấm hay không
    band: Date | boolean
    reason: string | undefined
}
