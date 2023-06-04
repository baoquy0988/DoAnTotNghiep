
import {axiosClient} from "./axiosClient";

interface InfoPost{
    token: string
    name: string
    content: string
}

const postAPI = {
    add(data:InfoPost) {
        const url = '/post'
        return axiosClient.post(url, data)
    },
    getNotification(){
        const url = '/posts/notification'
        return axiosClient.get(url)
    },
    getComments(id){
        const url = '/comments/'+id
        return axiosClient.get(url)
    },
    getTopicToken(topic:string, token:string){
        const url = '/topic?name=' + topic + '&token=' + token
        return axiosClient.get(url)
    },
    getTopic(topic:string){
        const url = '/topic?name=' + topic
        return axiosClient.get(url)
    },

    getDetail(url: string){
        return axiosClient.get(url)
    },
    getDetailToken(url: string, token: string){
        if(url.charAt(url.length - 1) === '/')
            url = url.substring(0, url.length - 1)
        url = url + '?token=' + token
        return axiosClient.get(url)
    },
    
    like(post_id: string, token: string){
        const url = '/like?post_id='+ post_id + '&token=' + token
        return axiosClient.get(url)
    },
    addComment(text: string, post_id: string, token: string){
        const url = '/comments/' + post_id
        return axiosClient.post(url, {
            'token' : token,
            'content' : text
        })
    }

}

export default postAPI
