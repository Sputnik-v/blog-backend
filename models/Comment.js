import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    comm: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }  
}, {
    timestamps: true
});

export default mongoose.model('Comment', CommentSchema);