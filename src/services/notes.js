import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request
        .then(resp => {
            return resp.data
        })
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request
        .then(resp => {
            return resp.data
        })
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request
        .then(resp => {
            return resp.data
        })
}

const noteService = { 
    getAll: getAll, 
    create: create, 
    update: update 
}

export default noteService