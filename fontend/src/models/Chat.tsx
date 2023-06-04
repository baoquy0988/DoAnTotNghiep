export default interface ChatInfo{
    user_id: number
    name: string | undefined
    image: string | undefined
    content: string
    date: Date | undefined | string
    //true = bản thân -- false: người khác
    // my: boolean
}
