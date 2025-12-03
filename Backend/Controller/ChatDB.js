import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['interviewer', 'applicant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});



const chatSessionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    messages: [messageSchema],

    face: { type: [Number], required: true },
    gaze: { type: [String], required: true },
    timestamp: { type: Date, default: Date.now },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatSession', chatSessionSchema);
