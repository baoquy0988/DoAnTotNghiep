export default interface Noti {
	user_name: string
	title: string | boolean
	url: string
	like: boolean
	user_id: number
	//Lời mời kết bạn
	accept: boolean
	time: string
}
//Thông báo
export const Type = {
	like: "like",
	comment: "comment",
	reply_comment: "reply_comment",
	//Lời mời kết bạn (người khác gửi đến bạn)
	friend_request: "friend_request",
	//Chấp nhận kết bạn (từ phía người nhận)
	accept_friend: "accept_friend",
	//Lời mời kết bạn được chấp nhận
	success_add_friend: "success_add_friend"
}

export interface Notification{
	type: string
	title_post: string | undefined
	content: string | undefined
	url: string | undefined
	// url_post: string | undefined
	user_id: number | undefined
	user_name: string
	url_user: string
	image_user: string
	time: Date
	//Đã xem hay chưa
	watched: boolean
	number: number | undefined
	list_like: number[] | undefined

}
