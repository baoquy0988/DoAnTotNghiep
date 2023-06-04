export interface Comment {
	id: number
	user_id: number
	name: string
	content: string
	date: Date
	image: string
}


export default interface PostDetail {
	id: string
	name: string
	user_id: number
	user_name: string
	image: string
	content: string
	n_comments: number
	comments: Comment[]
	n_like: number
	date: string
	url: string
	user_like: boolean
	status: boolean
	//0 công khai, 1 bạn bè, 2 riêng tư
	share: number
}

//Xem trước bài đăng
export interface PostPreview {
	name: string
	user_name: string
	image: string
	content: string
	date: string
}

export const hollow: PostDetail = {
	id: '0',
	name: 'Bài Viết',
	user_id: 0,
	user_name: '',
	image: '',
	content: '',
	n_comments: 0,
	comments: [],
	n_like: 0,
	date: '',
	url: '',
	user_like: false,
	status: false,
	share: 2
}