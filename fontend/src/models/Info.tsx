//Các thông tin như bài viết, thống kê của trang cá nhân

//Thống kê tầng xuất đăng bài
export interface NumberPostDate {
    date: string
    count: number
}
//Bảng chứa dữ liệu các bài viết đã dăng
export interface TablePosts{
	id: number
	title: string
	date: Date
	n_comment: number
	n_like: number
	content: string
	url: string
	status: boolean
	share: number
	//share: 0 công khai 1 bạn bè 2 chỉ mình tôi
}
//Bảng chứa dữ liệu các bài viết đã lưu
export interface TablePostsSave{
	id: number
	title: string
	date: Date
	content: string
}

//Tổng số lượng lượt thích, bình luận, bài viết
export interface SumNumberLikeComment{
	sum_post: number
	sum_like: number
	sum_comment: number
	//Lượt like cao nhất
	tallest_like: number
	//Lượt bình luận cao nhất
	tallest_cmt: number

}
//Thông tin thêm tổng số lượt like và bình luận
export default interface Info{
	statistical: NumberPostDate[]
	posts: TablePosts[]
	postsSave: TablePostsSave[]
	sum_like: number
	sum_comment: number
}