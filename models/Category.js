import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Naam is verplicht'],
        trim: true,
        maxlength: [50, 'Naam mag max 50 tekens zijn']
    },
    color: {
        type: String,
        default: '#3B6D11'
    }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);