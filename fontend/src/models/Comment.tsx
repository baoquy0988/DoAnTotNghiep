export default interface InfoComment {
    id: number
    user_id: number
    name: string
    content: string
    date: Date
    image: string
    reply: Reply[]
}
export interface Reply{
    user_id: number
    name: string
    content: string
    date: Date
    image: string
}
