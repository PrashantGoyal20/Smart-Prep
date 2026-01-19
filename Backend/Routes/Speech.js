import express from "express"
import {chat_starter, chatAnalyze, speechAnalyzer, viewBehaviour } from "../Controller/Speech.js"
import multer from "multer"
import { authenticator } from "../MiddleWare/auth.js"

const upload=multer()

const router =express.Router()

router.post('/speechAnalyse',authenticator,upload.single('file'),speechAnalyzer)
router.post('/chat-start',authenticator,chat_starter)
router.post('/analyseInterview',authenticator,chatAnalyze)
router.post('/behaviorAnalysis',authenticator,viewBehaviour)

export default router