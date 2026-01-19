import React from 'react'
import "./loader.css"
import { useContext } from 'react'
import { Context } from '../main'
import { Navigate,useLocation } from 'react-router-dom'

const Loading = ({children}) => {
    const {loading,isAuthorized}=useContext(Context)
    const location=useLocation()
  
    if(loading){
        return(
    <div class="scanner-loader">
  <div class="document">
    <div class="scan-line"></div>
  </div>
</div>)}
  
  if(!isAuthorized){
    toast.error("Please login to continue")
    return ( <Navigate to="/login" state={{ from: location }} replace />);
  }
  return children;
}

export default Loading