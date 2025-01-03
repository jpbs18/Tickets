import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/useRequest'
import Form from '../../components/form'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors }  = useRequest({ 
        url: '/api/users/signup', 
        method: 'post', 
        body: { email, password }, 
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (e) => {
        e.preventDefault()    
        doRequest()
        setEmail('');
        setPassword('');
    }

    const inputs = [
        { labe: "Email Address", value: email, onChange: (e) => setEmail(e.target.value), type: "email", id: "email" },
        { labe: "Password", value: password, onChange: (e) => setPassword(e.target.value), type: "password", id: "password" }
    ]

    return <Form 
        title="Sign Up"
        inputs={inputs}
        onSubmit={onSubmit}
        errors={errors}
        buttonText="Sign Up"
    />
}