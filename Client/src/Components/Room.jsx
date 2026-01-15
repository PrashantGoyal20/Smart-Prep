import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './room.css'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SquareIcon from '@mui/icons-material/Square';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios"
import { FaceMesh } from "@mediapipe/face_mesh"
import { Camera } from "@mediapipe/camera_utils"

const Room = () => {
  const server= import.meta.env.VITE_API_URL
  const [mute, setMute] = useState(false)
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunks = useRef([]);
  var email
  const [isMuted, setIsMuted] = useState(true);
  const location = useLocation()
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef()
  const [multiface, setMultiface] = useState(false)
  const [noface,setNoface]=useState(false)
  const initializedRef = useRef(false);
  const navigate =useNavigate()
  const [loading,setLoading]=useState(false)
  

  const loacateMarks = async (email) => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const landmarks = results.multiFaceLandmarks?.[0];
      if (!landmarks || landmarks.length==0) {

        setNoface(true)
        setTimeout(() => {
          setNoface(false)
        }, 10000)
      }
      if(landmarks && landmarks.length>0){
      if(landmarks.length>264){let nose = landmarks[1]
      let leftEye = landmarks[33]
      let rightEye = landmarks[263]
      let chin = landmarks[152]

      let eyeCenterX = (leftEye.x - rightEye.x) / 2
      let eyeCenterY = (leftEye.y - rightEye.y) / 2
      let offsetX = (eyeCenterX - nose.x)
      let offsetY = (eyeCenterY - chin.y)

      let depth=1+(-5)*(nose.z + leftEye.z + rightEye.z + chin.z) / 4;

      let gaze = "center"
      if (offsetX*depth > -0.5) gaze = "away";
      else if (offsetX*depth < -0.7) gaze = "away";
      else if (offsetY*depth > -0.52) gaze = "away";
      else if (offsetY <-0.75) gaze = "away";
      // setInterval(async()=>{try {
      // console.log({email:email,faces:results.multiFaceLandmarks.length,gaze:gaze})
      //    await axios.post(`http://localhost:3000/speech/behaviorAnalysis`,{email:email,faces:results.multiFaceLandmarks.length,gaze:gaze})
      // } catch (error) {
      //   console.log(error)
      // }
       
      // },10000)
}
      if (results.multiFaceLandmarks.length != 1) {

        setMultiface(true)
        setTimeout(() => {
          setMultiface(false)
        }, 10000)
      }      
    }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => await faceMesh.send({ image: videoRef.current }),
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }
  useEffect(() => {
    
    const params = new URLSearchParams(location.search);
    email=params.get('email')
    console.log(params.get("email"))
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry && navEntry.type === "reload";

    if (isReload) {
      console.log('reload')
      handleNavigation();
    }
    if(initializedRef.current) return
    initializedRef.current=true
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    });
    loacateMarks(params.get('email'))
    const startInterview = async (req, res, next) => {
      await axios.post(`${server}/speech/chat-start${location.search}`,{resume:location.state.resume,email:location.state.email})
    }
    startInterview()
  }, [location.search]);

  const startRecording = () => {
    chunks.current = [];

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9',
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('email', location.state.email);
      formData.append('timestamp', new Date().toISOString());

      try {
        await axios.post(`${server}/speech/speechAnalyse`, formData, { "Content-Type": "multipart/form-data" })
        .then((res) => {
          const base64Audio = res.data.audio;

          const blob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: 'audio/mp3' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          const audio = new Audio(url);

          audio.onended = () => {
            setAudioUrl(null);
            URL.revokeObjectURL(url);
          };
          setLoading(false)
          audio.play();
        })

      } catch (err) {
        console.error('Upload failed:', err);
      }

      chunks.current = [];
    };

    recorderRef.current = recorder;
    recorder.start();
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
      setLoading(true)
    }
  };

  const toggleMic = () => {
    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length > 0) {
      const currentState = !audioTracks[0].enabled;
      audioTracks[0].enabled = currentState;
      setIsMuted(!currentState);

      if (currentState) startRecording();
      else stopRecording();
    }
  };

  const handleNavigation=()=>{
    navigate(`/interview-summary?email=${email}`)
  }

  return (
    <div className='room'>

      <div className='applicant-window'>
        <div className='applicant'>
          <video ref={videoRef} autoPlay muted={!isMuted} />
        </div>
        <div className='interviewer'>
          {audioUrl && <div></div>}<AccountCircleIcon style={{ fontSize: "200px" }} />

        </div>

      </div>
      {multiface ? <div className='multiple-face'>
        <span>Multiple Faces Detected</span>
        <small>Move unnecessary people away</small>
      </div> : <div></div>}

      {noface ? <div className='multiple-face'>
        <span>No Face Detected</span>
        <small>Please move camera to a proper location</small>
      </div> : <div></div>}



      <div className='room-btn'>
        {loading ? <div className='loader-container'><div className='loader'></div></div> : <><button className='mic' onClick={toggleMic}>{!isMuted ? <div className='mic-on'> <SquareIcon /> Speaking..</div> : <div className='mic-off'><PlayArrowIcon/> Start Speaking</div>}</button></>}
        <button className='leave' style={{
                                                backgroundColor: "rgba(203, 203, 239, 0.66)",
                                                borderColor: "#0509ecff",
                                                color: "#ffffff",
                                                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                                            }} onClick={handleNavigation}>End Interview</button>

      </div>

    </div>
  )
}

export default Room