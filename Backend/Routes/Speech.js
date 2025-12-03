import express from "express"
import {chat_starter, chatAnalyze, speechAnalyzer, viewBehaviour } from "../Controller/Speech.js"
import multer from "multer"

const upload=multer()

const router =express.Router()

router.post('/speechAnalyse',upload.single('file'),speechAnalyzer)
router.post('/chat-start',chat_starter)
router.post('/analyseInterview',chatAnalyze)
router.post('/behaviorAnalysis',viewBehaviour)

export default router