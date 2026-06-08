import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Voornaam is verplicht'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Achternaam is verplicht'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'E-mail is verplicht'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Wachtwoord is verplicht']
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);