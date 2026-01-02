import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import './App.css'
import { Home } from './Components/Home/Home'
import Room from './Components/Room'
import Report from './Components/Home/Report'
import UserManual from './Components/Home/UserManual'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/userManual' element={<UserManual/>}/>
          <Route path='/room' element={<Room/>}/>
          <Route path='/interview-summary' element={<Report/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
