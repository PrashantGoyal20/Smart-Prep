import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loader from '../Loader'
import Header from './Header'
import './report.css'
import {Play} from 'lucide-react'

const Report = () => {
  const server= import.meta.env.VITE_API_URL
  const [report, setReport] = useState([])
  const [load, setLoad] = useState(true)
  const location = useLocation()
  console.log(location.search)
  useEffect(() => {
    const fetchChat = async () => {
      await axios.post(`${server}/speech/analyseInterview${location.search}`).then((res) => {
        setReport(res.data.reply)
        setLoad(false)
      })

    }
    fetchChat()

  }, [])

  return (
    <div>{load ? <Loader /> :
      <div  style={{marginTop:"40%"}} >
        <Header />
        <div className='app'>
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
            <div className='container'>
              <div className='titleSection'>
                <h1 className='title'>
                  <span className='titleGradient'>Your Interview Report</span>
                </h1>
                
              </div>
              <div className='form'>
                  <div className='report-score'>
                    <span className='score-heading'>Your Score</span>
                    <span className='titleGradient score'>{report.ScoreOfInterview}</span>
                    <span className='score-comment'>{report.ScoreOfInterview>80 ? 'Keep it Up':<>{(report.ScoreOfInterview>50 && report.ScoreOfInterview<80) ?'Can Do Better':'Need To Improve'}</>}</span>
                  </div>

                  <div className='Content'><span className='titleGradient score'>Areas of Improvement</span>
                    <div className='content-details'>{report.AreasofImprove.map((data,index)=>{
                    return(
                      <div><Play size={16} fill='#ec4899' className='arrows'/>{data.replace('**','')}</div>
                    )})}</div>
                  </div>

                  <div className='Content'><span className='titleGradient score'>Content of Clarity</span>
                    <div className='content-details'>{report.ContentClarity.map((data,index)=>{
                    return(
                      <div><Play size={16} fill='#ec4899' className='arrows'/>{data.replace('**','')}</div>
                    )})}</div>
                  </div>

                  <div className='Content'><span className='titleGradient score'>FeedBack</span>
                    <div className='content-details'>{report.FeedBack.map((data,index)=>{
                    return(
                      <div><Play size={16} fill='#ec4899' className='arrows'/>{data.replace('**','')}</div>
                    )})}</div>
                  </div>

              </div>
            </div>
          </main>

        </div>

      </div>}

    </div>
  )
}

export default Report