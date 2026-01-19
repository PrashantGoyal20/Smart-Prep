import React from 'react'
import {  Sparkles, Zap, Users } from 'lucide-react';
import './header.css'
import { useContext } from 'react';
import { Context } from '../../main';

const Header = () => {
  const {user,isAuthorized}=useContext(Context);
  const handleLogout=async(e)=>{
    e.preventFefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`,{withCredentials:true}).then((res)=>{
      if(res.success){
        alert("Logged Out Successfully")
      }
    })
  }
    return (
        <nav className="navbar">
        <div className='navContainer'>
          <div className='logo'>
            <div className='logoIcon'>
              <img src='/logo.svg'/>
            </div>
            <span className='logoText'>SmartPrep</span>
          </div>
          <div className='navLinks'>
            {(isAuthorized)?<div className="navLink" style={{width:"60px"}} onClick={handleLogout}>Logout</div>:<a href="/login" className="navLink">
              <Zap size={16} />
              Login
            </a>}
            <a href="/userManual" className="navLink">
              <Users size={16} />
              How to Use
            </a>
          </div>
        </div>
      </nav>
    )
}

export default Header