import axios from "axios";

export default function buildClient({ req }) {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: 'http://www.jpbs-app-prod.xyz',
            headers: req.headers
        })
    } 
    
    return axios.create({ baseURL: '/' })  
}