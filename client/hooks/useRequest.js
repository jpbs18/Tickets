import { useState } from 'react'
import axios from 'axios'

export default function useRequest ({ url, method, body, onSuccess }){
    const [errors, setErrors] = useState(null)

    const doRequest = async (props = {}) => {   
        try {
            setErrors(null)
            const { data } = await axios[method](url, { ...body, ...props })

            if(onSuccess){
                onSuccess(data)
            }

            return data
        } catch (err) {
            console.log(err)
            setErrors(
                <div className='alert alert-danger my-3'>
                    <h4>Ooops...</h4>
                    <ul>
                        {err.response.data.errors.map(e => 
                            <li key={e.message}>{e.message}</li>
                        )}
                    </ul>
                </div>
            )
        }
    }

    return { doRequest, errors }
}