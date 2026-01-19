import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import './App.css'
import { Home } from './Components/Home/Home'
import Room from './Components/Room'
import Report from './Components/Home/Report'
import UserManual from './Components/Home/UserManual'
import { useContext,useEffect,useCallback } from 'react'
import { Context } from './main'
import axios from 'axios'
import Login from './Components/Forms/Login'
import Register from './Components/Forms/Register'
import Loading from './Components/Loading'

function App() {
  
  const server= import.meta.env.VITE_API_URL
  const {isAuthorized,setIsAuthorized,user,setUser,loading,setLoading}=useContext(Context)
  const fetchUser=useCallback(async()=>{
    setLoading(true)
      try {
        const response = await axios.get(
        `${server}/auth/getuser`,{
          withCredentials: true,
        }
      );
      if(response.data.success==true){
      setUser(response.data.user);
      setIsAuthorized(true);
    }
    if(response.data.success==false){
      setIsAuthorized(false);
    }
      } catch (error) {
        console.error(error)
      }finally{
        setLoading(false)
      }
      
    },[setIsAuthorized])
  useEffect(()=>{
    
    fetchUser();
  },[fetchUser])


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/userManual' element={<UserManual/>}/>
          <Route path='/room' element={<Loading><Room/></Loading>}/>
          <Route path='/interview-summary' element={<Loading><Report/></Loading>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
