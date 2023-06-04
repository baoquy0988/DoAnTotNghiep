export default interface UserCpanel{
    id: string
    name: string
    username: string
    email: string
    count: number
    status: CryptoOrderStatus
    
}

export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';
