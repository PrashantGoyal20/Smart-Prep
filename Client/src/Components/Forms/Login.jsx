import React, { useState,useRef } from 'react'
import Header from '../Home/Header'
import axios from 'axios'
import './login.css'

import { Users, Lock ,Send, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const error=useRef()
    const navigate=useNavigate()
    
        const handleLogin=async(e)=>{
            e.preventDefault();
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`,{email,password}, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }).then((res)=>{
                console.log(res)
                if(res.data.success){
                    navigate('/')
                }
                else{
                    setTimeout(() => {
                    error.current.classList.replace('error-hide','error')
                      },4000)
                      error.current.classList.replace('error','error-hide')
                }
            }).catch((err)=>{
                console.log(err)
                setTimeout(() => {
                    error.current.classList.replace('error-hide','error')
                      },4000)
                      error.current.classList.replace('error','error-hide')
                
            }).finally(()=>{
                setIsLoading(false);
            });
        }
    return (
        <div >
            <Header />
            <div className='particles'>
                {[...Array(200)].map((_, i) => (
                    <div
                        key={i}
                        className='particle'
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>
            <div className='particles'>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className='particle-sun'
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>
            <main className='main'>
                <div className='error-hide' ref={error}> Error in Login</div>

                <div className='container-2'>
                    <div className='titleSection' >
                        <h4 className='title'>
                            <span className='titleGradient'>Login</span>
                        </h4>

                    </div>
                    <div className='form' style={{bottom:"60px" , position:"relative"}}>
                        <div className='inputGroup'  style={{bottom:"30px" , position:"relative"}}>
                            <label className='label'>
                                <Users size={14} className='labelIcon' />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='input'
                                placeholder="Enter your email..."
                            />
                            <div className='inputGlow' />
                        </div>
                        <div className='inputGroup' style={{marginBottom:"40px"}}>
                            <label className='label'>
                                <Lock size={14} className='labelIcon' />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='input'
                                placeholder="Enter your password..."
                            />
                            <div className='inputGlow' />
                        </div>

                        <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className='submitButton'
                                style={{
                                    ...(isLoading ? {
                                        opacity: "0.8",
                                        cursor: "not - allowed"
                                    } : {})
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className='spinner' />
                                        Logging In...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span>Log In</span>
                                        <Sparkles size={16} />
                                    </>
                                )}
                                <div className='submitGlow' />
                                </button>
                                <div style={{marginTop:"20px"}}>
                                    <span  style={{color:"white" ,marginRight:"15px"}}>Don't have an account? </span><a href="/register" style={{ color: "#f65cee" }}>Register</a>
                                </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login