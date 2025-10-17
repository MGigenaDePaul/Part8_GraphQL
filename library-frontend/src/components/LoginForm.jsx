import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('mluukkai')
  const [password, setPassword] = useState('secret')
  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
        console.log('wrong credentials', error)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      console.log('TOKEN:', token)
      setToken(token)
      localStorage.setItem('user-token', token)
      navigate('/')
    }
  }, [result.data])
  
  const handleSubmit = (event) => {
    event.preventDefault() 

    login({ variables: { username, password } })
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <div>
            name:
            <input value={username} onChange={(event) => setUsername(event.target.value)}/>
        </div>
        <div>
            password:
            <input value={password} onChange={(event) => setPassword(event.target.value)}/>
        </div>
        <button type="submit">login</button>
        </form>
    </div>
  )
}

export default LoginForm