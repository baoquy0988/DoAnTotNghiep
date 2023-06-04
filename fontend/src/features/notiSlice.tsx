import { StaticDatePicker } from "@mui/lab";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Noti, { Notification } from "src/models/Noti";

export interface NotiSate {
    data: Notification[]
    number: number
}

interface Edit {
    index: number,
    noti: Notification
}
const initialState: NotiSate = {
    data: [],
    number: 0
}

const notiSlice = createSlice({
    name: 'noti',
    initialState,
    reducers: {
        reviceNoti(state: NotiSate, action: PayloadAction<Notification>) {
            // console.log()
            //Nếu nhiều người like mà chưa xem thì gộp lại thành 1 thông báo
            const data = action.payload

            if (data.type === "like") {
                const index = state.data.findIndex((item) => item.url === data.url && item.type === "like")

                if (index !== -1) {

                    const like = state.data[index].list_like.indexOf(data.user_id)
                    //Người này chưa like
                    if (like === -1) {
                        if (!state.data[index].watched) {
                            const temp = state.data[index]
                            temp.list_like.push(data.user_id)
                            temp.user_id = data.user_id
                            temp.user_name = data.user_name
                            temp.url_user = data.url_user
                            temp.image_user = data.image_user

                            state.data.splice(index, 1)
                            console.log(temp.list_like.length)
                            state.data = [temp, ...state.data]
                        } else {
                            data.list_like.push(data.user_id)
                            state.data = [data, ...state.data]
                            state.number += 1
                        }

                    } else {

                    }

                } else {
                    data.list_like.push(data.user_id)
                    state.data = [data, ...state.data]

                    state.number += 1
                }
            } else {
                state.data = [data, ...state.data]
                state.number += 1
            }





        },
        acceptAddFriend(state, action: PayloadAction<number>) {
            state.data[action.payload].type = "accept_friend"
            state.data[action.payload].watched = true
        },
        watched(state, action: PayloadAction<number>) {
            //Đã đọc thông báo này
            state.data[action.payload].watched = true
        }
        ,
        init(state, action: PayloadAction<Notification[]>) {
            state.data = action.payload
        },
        seen(state) {
            state.number = 0
        }
    }
})
export const selectNoti = (state): Notification[] => state.noti.data
export const selectNumberNoti = (state) => state.noti.number

export const notiActions = notiSlice.actions
const notiReducer = notiSlice.reducer
export default notiReducer