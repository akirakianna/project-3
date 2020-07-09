import React, { useState, useContext } from 'react'
import axios from 'axios'
import { login } from '../lib/auth'
import { UserContext } from '../UserContext'


const Login = (props) => {

  const { user, setUser } = useState()
  const [formData, updateFormData] = useState({
    email: '',
    password: ''
  })
  const { setUserInfo } = useContext(UserContext)

  function handleChange(event) {
    const name = event.target.name
    const data = {
      ...formData,
      [name]: event.target.value
    }
    updateFormData(data)
  }

  function handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/login', formData)
      .then(resp => {
        // localStorage.setItem saves a key and value
        // to the browser
        login(resp.data.token)
        console.log(resp.data.user)
        setUserInfo(resp.data.user)
        props.history.push('/')
      })
      .catch(err => console.log(err.response))
  }

  return <form className="login-form" onSubmit={handleSubmit}>
    <label className="email-label">Email</label>
    <input
      name="email"
      className="form-input"
      onChange={handleChange}
      type="text"
      placeholder="ncage@thescore.com"
      value={formData.email}
    />
    <label className="password-label">Password</label>
    <input
      name="password"
      className="form-input"
      onChange={handleChange}
      type="password"
      placeholder="********"
      value={formData.password}
    />
    <div className="button-container">
      <button className="login-button">Login</button>
    </div>
  </form>

}

export default Login