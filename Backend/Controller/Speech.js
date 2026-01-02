import { PassThrough } from "stream"
import ffmpegPath from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"
import streamifier from "streamifier"
import fs, { existsSync } from "fs"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
import chat from "./ChatDB.js"
import { error } from "console"
import axios from "axios"
import FormData from "form-data"


dotenv.config()

const models = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
let role = ''
let exp = ''
let chatSession
let ans = ''
let started = false

ffmpeg.setFfmpegPath(ffmpegPath);
const transformer = process.env.TRANSFORMERS_API_URL


//EXTRACT AUDIO FROM VIDEO BUFFER
export const audioExtraction = async (videoBuffer) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = streamifier.createReadStream(videoBuffer);

    ffmpeg(stream)
      .inputFormat("webm")
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .on("error", (err) => reject(err))
      .pipe()
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => {
        resolve(Buffer.concat(chunks));
      });
  }).catch(error => console.log(error));
};


//TRANSRIBE SPEECH MODULE
export const speechAnalyzer = async (req, res, next) => {
  try {
    const videoBuffer = req.file.buffer;
    const { email } = req.body
    const audio = await audioExtraction(videoBuffer);
    const form = new FormData();
    form.append("file", audio, {
      filename: "audio.wav",
      contentType: "audio/wav"
    });

    const res = await axios.post(`${transformer}/stt`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,

      });

    const transcription = res.data.text

    ans = transcription
    const { audioBase64, reply } = await interviewer()
    const session = await chat.findOne({ email: email })
    if (!session) console.log('No user Found')
    console.log(transcription)
    session.messages.push({
      role: 'applicant',
      content: transcription
    });
    session.messages.push({
      role: 'interviewer',
      content: reply
    });

    await session.save();

    res.status(200).json({ success:true,audio: audioBase64 })

  } catch (error) {
    console.log('STT error:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
}


//START BASIC CHAT START WITH PROMPT
export const chat_starter = async (req, res, next) => {
  if (started) return;
  started = true

  try {
    const { role, exp, name } = req.query;
    const { email, resume } = req.body
    const existing = await chat.findOne({ email: email })
    if (existing) {
      await chat.deleteOne({ email: email })
    }
    const session = await chat.create({ email: email })

    const user = `You are acting as company interviewer for a big MNC company.Your task is to take the interview of applicant for ${role} role with an experience of ${exp} years .
                      Ask questions based on those basis and cross-question them. Ask them problems related to their feild like ask some DSA question if role is SDE
                      Name of the applicant is ${name}.
                      Here is the extracted text from resume for your reference : ${resume}
                      Let Your name be Alex. Don't tell applicant anything unnecessary.
                      Interview should last for minimum about 15-20 minutes and questions show be relevant
                      Try to keep it as close as possible to a real interview experience.
                      when Interview is over U can just ask applicant to press the leave button
                      `;

    session.messages.push({
      role: 'applicant',
      content: user
    });

    await axios.get(`${transformer}`, { contentType: "application/json" })

    chatSession = models.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: 'user',
          parts: [{ text: user }],
        },
        {
          role: 'model',
          parts: [{ text: "Understood! I'm ready to assist you." }],
        },
      ],
    });

    session.messages.push({
      role: 'interviewer',
      content: "Understood! I'm ready to assist you."
    });

    await session.save()
    console.log('started')
    res.status(200).json({
      success: true,
      message: "chat started"
    })
  } catch (error) {
    console.log(error)
  }
}

//CONVERSATION HANDLER
export const interviewer = async (req, res, next) => {
  try {
    const result = await chatSession.sendMessage({ message: ans });
    const reply = result.text;
    const ttsResponse = await axios.post(
      `${transformer}/tts`,
      { text: reply },
      { responseType: "arraybuffer" }
    );
    const audioBase64 = Buffer.from(ttsResponse.data).toString("base64");
    return { audioBase64, reply }
  } catch (error) {
    console.log(error)
  }
}

export const chatAnalyze = async (req, res, next) => {
  try {
    const { email } = req.query
    const chats = await chat.findOne({ email: email })
    console.log(chats)
    var geminiHistory = ''
    chats.messages.slice(2).map(m => (
      geminiHistory += `role:` + (m.role) === 'applicant' ? 'user' : 'model' + `parts:` + m.content

    ));
    const faces = []
    const gaze = []
    console.log(geminiHistory)
    // chats.emotions.face.map(f => (
    //   faces.add(f)
    // ))
    // chats.emotions.gaze.map(f => (
    //   gaze.add(f)
    // ))

    const response = await models.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyse the ans given by user when the question was asked by model using ${geminiHistory} in which role:user are the answers given by user and role:model are questions asked by interviewer. 
    Tell about the areas of improvements and also comment about there fluency , confidence and pronunciation if you can,
    Here is the data of each 10s interval gap if the user was seeing camera or not ${gaze}. Tell the use how many times the user looked away in percentage and ask them politely if the percentage is high.
    Here is also the data if the user was visible or not or whether they wre alone or not : ${faces}. If its 1 means only user was present , if it is 2 or more means many people were present and 
    if it is 0 means no user waas visible. each of these data was collected in 10s interval so comment appropraitely.
      Give your  Answer in json format given below:
      {AreasofImprove:[String],
       ContentClarity:[String],
       FeedBack:[String]
       ScoreOfInterview:Number,

      }
       Stick to this json format only ...don't give any extra text`
    });
    const reply = response.text.split('json')[1]
    const cleaned = JSON.parse(reply.replace(/```(?:json)?\n?/g, '').replace('**', '').replace(/^Report/, '').trim());
    console.log(cleaned)
    res.status(200).json({
      reply: cleaned
    })
  } catch (error) {
    console.log(error)
  }
}


export const viewBehaviour = async (req, res, next) => {
  try {
    const { email, faces, gaze } = req.body
    console.log('start recognition')
    const chats = await chat.findOne({ email: email })
    if (chats) {
      const update = await chat.findByIdAndUpdate(chats._id, {
        $addToSet: {
          face: faces, gaze: gaze
        },
      })
      res.status(200).json({ update })
    }
  } catch (error) {
    console.log(error)
  }

}
