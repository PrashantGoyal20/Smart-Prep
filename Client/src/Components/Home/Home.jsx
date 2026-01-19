import React, { useRef, useState, useEffect } from 'react'
import { Mic, MicOff, Video, VideoOff, Upload, Send, Sparkles, Zap, Users } from 'lucide-react';
import Header from './Header'
import './header.css'
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import workerURL from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;


export const Home = () => {
    const [name, setName] = useState('')
    const [post, setPost] = useState('')
    const [exp, setExp] = useState('')
    const [email, setEmail] = useState('')
    const [resume, setResume] = useState(null)
    const preview = useRef()
    const resumeRef = useRef()
    const [cameraStatus, setCameraStatus] = useState(false)
    const [audioStatus, setAudioStatus] = useState(false)
    const videoRef = useRef()
    const audioRef = useRef()
    const navigate = useNavigate()


    const [isMicOn, setIsMicOn] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (file) => {
        if (file.size > 10485760) {
            alert('File Size Greater than 10MB')
            return
        }
        if (file && file.type === 'application/pdf') {
            setResume(file);
            console.log(file)
        } else {
            alert('Please upload a valid PDF file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const extractTextFromPDF = async (file) => {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    const typedArray = new Uint8Array(reader.result);
                    const loadingTask = pdfjsLib.getDocument({ data: typedArray });
                    const pdf = await loadingTask.promise;

                    let fullText = "";

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(item => item.str).join(" ");
                        fullText += pageText + "\n";
                    }

                    resolve(fullText);
                } catch (err) {
                    reject(err);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    useEffect(() => {
        if (resume) {
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    const typedArray = new Uint8Array(reader.result);
                    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 0.5 });

                    const canvas = preview.current;
                    const context = canvas.getContext("2d");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport }).promise;
                    console.log("Page rendered!");
                } catch (err) {
                    console.error("Rendering error:", err);
                }
            };

            reader.readAsArrayBuffer(resume);
        }
    }, [resume]);

    const requestCameraPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setCameraStatus(true);
            videoRef.current = stream
        } catch (err) {
            setCameraStatus(false);
            console.log(err)
        }
    };
    const requestAudioPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            setAudioStatus(true);
            audioRef.current = stream
        } catch (err) {
            setAudioStatus(false);
        }
    };

    const cancelCameraPermissions = async () => {
        try {
            if (videoRef.current) {
                console.log(videoRef.current.getTracks())
                videoRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
                videoRef.current = null;
            }
            setCameraStatus(false);
        } catch (err) {
            setCameraStatus(true);
            console.log(err)
        }
    }
    const cancelAudioPermissions = async () => {
        try {
            if (audioRef.current) {
                audioRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
                audioRef.current = null;
            }
            setAudioStatus(false);
        } catch (err) {
            setAudioStatus(true);
            console.log(err)
        }
    }

    const navigateInterview = async () => {
        if (!resume || !name || !post || !email) {
            window.alert('Enter All Credentials')
            return;
        }
        if (!videoRef.current || !audioRef.current) {
            window.alert('Please provide mic and camera permission')
            return;
        }
        setIsLoading(true)
        const fulltext = await extractTextFromPDF(resume)
        navigate(`/room?name=${name}&role=${post}&exp=${exp}&email=${email}`, { state: { resume: fulltext, email: email } })
    }



    return (
        <div >
            <Header />
            <div className='app' style={{ marginTop: "40%" }}>
                <div className='backgroundOverlay'>
                    <div className='mouseGlow'
                        style={{
                            left: mousePosition.x - 200,
                            top: mousePosition.y - 200
                        }}
                    />
                    <div className='gridPattern' />
                </div>

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
                                <span className='titleGradient'>Next-Gen</span> Interview Portal
                            </h1>
                            <p className='subtitle'>
                                Experience the future of job interview with our AI-powered platform
                            </p>
                        </div>

                        <div className='form'>
                            <div className='inputGrid'>
                                <div className='inputGroup'>
                                    <label className='label'>
                                        <Sparkles size={14} className='labelIcon' />
                                        Applicant Name
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

                                <div className='inputGroup'>
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

                                <div className='inputGroup'>
                                    <label className='label'>
                                        <Zap size={14} className='labelIcon' />
                                        Post
                                    </label>
                                    <input
                                        type="text"
                                        value={post}
                                        onChange={(e) => setPost(e.target.value)}
                                        className='input'
                                        placeholder="Enter the post you are applying for..."
                                    />
                                    <div className='inputGlow' />
                                </div>

                                <div className='inputGroup'>
                                    <label className='label'>
                                        <Sparkles size={14} className='labelIcon' />
                                        Experience
                                    </label>
                                    <input
                                        type="text"
                                        value={exp}
                                        onChange={(e) => setExp(e.target.value)}
                                        className='input'
                                        placeholder="Enter your experience at this post in years..."
                                    />
                                    <div className='inputGlow' />
                                </div>
                            </div>

                            <div className='uploadSection'>
                                <label className='label'>
                                    <Upload size={14} className='labelIcon' />
                                    Resume
                                </label>
                                <div className='dropbox'
                                    style={{
                                        ...(isDragOver ? {
                                            borderColor: "#6366f1",
                                            backgroundColor: "rgba(99, 102, 241, 0.1)",
                                            transform: "scale(1.02)"
                                        } : {}),
                                        ...(resume ? {
                                            borderColor: "#10b981",
                                            backgroundColor: "rgba(16, 185, 129, 0.1)"
                                        } : {})
                                    }}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => document.getElementById('pdfInput').click()}
                                >
                                    <div className='uploadIconContainer'>
                                        <Upload size={40} className='uploadIcon' />
                                        <div className='uploadPulse' />
                                    </div>
                                    <h3 className='dropboxTitle'>
                                        {resume ? '✨ Document Uploaded!' : '🚀 Drop Your PDF Here'}
                                    </h3>
                                    <p className='dropboxText'>
                                        {resume ? resume.name : 'Drag & drop or click to upload your project documentation'}
                                    </p>
                                    <p className='dropboxSubtext'>
                                        {resume ? 'Ready to launch!' : 'PDF files only • Max 10MB • Secure upload'}
                                    </p>
                                </div>
                                <input
                                    id="pdfInput"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileUpload(e.target.files[0])}
                                    className='hiddenInput'
                                />
                            </div>


                            <div className='mediaControls'>
                                <div className='mediaGroup'>
                                    <label className='label'>
                                        <Zap size={14} className='labelIcon' />
                                        Media Interface
                                    </label>
                                    <div className='mediaButtons'>
                                        {audioStatus ? <button
                                            onClick={cancelAudioPermissions}
                                            className='mediaButton'
                                            style={{
                                                backgroundColor: "rgba(99, 102, 241, 0.2)",
                                                borderColor: "#6366f1",
                                                color: "#ffffff",
                                                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",

                                            }}
                                        >
                                            <div className='mediaIconContainer'>
                                                <Mic size={20} />
                                                <div className='mediaGlow' />
                                            </div>
                                            <div className='mediaButtonText'>
                                                <span>Microphone</span>
                                                <small>Active</small>
                                            </div>
                                        </button> : <button
                                            onClick={requestAudioPermissions}
                                            className='mediaButton'>
                                            <div className='mediaIconContainer'>
                                                <MicOff size={20} />
                                            </div>
                                            <div className='mediaButtonText'>
                                                <span>Microphone</span>
                                                <small>Inactive</small>
                                            </div>
                                        </button>}

                                        {cameraStatus ? <button className='mediaButton'
                                            onClick={cancelCameraPermissions}
                                            style={{
                                                backgroundColor: "rgba(99, 102, 241, 0.2)",
                                                borderColor: "#6366f1",
                                                color: "#ffffff",
                                                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                                            }}
                                        >
                                            <div className='mediaIconContainer'>
                                                <Video size={20} />
                                                <div className='mediaGlow' />
                                            </div>
                                            <div className='mediaButtonText'>
                                                <span>Camera</span>
                                                <small>Active</small>
                                            </div>
                                        </button> : <button className='mediaButton'
                                            onClick={requestCameraPermissions}>
                                            <div className='mediaIconContainer'>
                                                <VideoOff size={20} />
                                            </div>
                                            <div className='mediaButtonText'>
                                                <span>Camera</span>
                                                <small>Inactive</small>
                                            </div>
                                        </button>}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={navigateInterview}
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
                                        Launching Interview...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span>Launch Interview</span>
                                        <Sparkles size={16} />
                                    </>
                                )}
                                <div className='submitGlow' />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
