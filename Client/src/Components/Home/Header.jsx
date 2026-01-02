import React from 'react'
import {  Sparkles, Zap, Users } from 'lucide-react';
import './header.css'

const Header = () => {
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
            <a href="/" className="navLink">
              <Zap size={16} />
              Home
            </a>
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