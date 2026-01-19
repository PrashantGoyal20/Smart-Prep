import React, { useState } from 'react'
import './login.css'
import Header from '../Home/Header'
import axios from 'axios'
import { Users, Lock ,Mail,Phone,Send, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name,setName]=useState("");
    const navigate=useNavigate()
    const [phone,setPhone]=useState();
    const [isLoading, setIsLoading] = useState(false);
    const error=useRef()

    const handleRegister=async(e)=>{
        setIsLoading(true);
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`,{name,email,phone,password}, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }).then((res)=>{
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
            <div className='error-hide' ref={error}> Error in Registeration</div>
                <div className='container'>
                    <div className='titleSection'  style={{top:"70px" , position:"relative"}}>
                        <h4 className='title'>
                            <span className='titleGradient'>Register</span>
                        </h4>

                    </div>
                    <div className='form' style={{top:"30px" , position:"relative"}}>

                        <div className='inputGroup' style={{marginBottom:"40px"}}>
                            <label className='label'>
                                <Users size={14} className='labelIcon' />
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='input'
                                placeholder="Enter your name..."
                            />
                            <div className='inputGlow' />
                        </div>
                        <div className='inputGroup'  style={{bottom:"30px" , position:"relative"}}>
                            <label className='label'>
                                <Mail size={14} className='labelIcon' />
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
                        <div className='inputGroup'  style={{bottom:"20px" , position:"relative"}}>
                            <label className='label'>
                                <Phone size={14} className='labelIcon' />
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='input'
                                placeholder="Enter your phone number..."
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
                                onClick={(e)=>handleRegister()}
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
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span>Register</span>
                                        <Sparkles size={16} />
                                    </>
                                )}
                                <div className='submitGlow' />
                                </button>
                                <div style={{marginTop:"20px"}}>
                                    <span  style={{color:"white" ,marginRight:"15px"}}>Already have an account? </span><a href="/login" style={{ color: "#f65cee" }}>Login</a>
                                </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Register