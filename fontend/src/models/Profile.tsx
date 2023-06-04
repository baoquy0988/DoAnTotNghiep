import InfoPost from "./InfoPost"

export default interface Profile {
    info: Info
    post: InfoPost[]
}

export interface Info {
    id: number
    name: string
    image: string
    description: string
}
