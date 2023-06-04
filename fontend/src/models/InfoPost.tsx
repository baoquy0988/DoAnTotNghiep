export default interface InfoPost {
	id: number
	name: string
	user_id: number
	user_name: string
	image: string
	content: string
	n_comments: number
	n_like: number
	date: Date
	user_like: boolean
	url: string
	url_short: string
	status: boolean
	share: number
}

export const hollow : InfoPost = {
	id: 0,
	name: '',
	user_id: 0,
	image: '',
	content: '',
	n_comments: 0,
	n_like: 0,
	date: (new Date()),
	user_like: false,
	url: '',
	url_short: '',
	user_name: "",
	status: false,
	share: 2
}