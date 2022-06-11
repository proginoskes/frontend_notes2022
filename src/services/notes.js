import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request
        .then(resp => {
            return resp.data
        })
}

const create = async newObject => {

    const config = {
        headers:{ Authorization: token }
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
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
    update: update,
    setToken: setToken
}

export default noteService