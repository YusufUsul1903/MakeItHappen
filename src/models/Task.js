import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Titel is verplicht'],
        trim: true,
        maxlength: [200, 'Titel mag max 200 tekens zijn']
    },
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);