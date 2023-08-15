import mongoose from 'mongoose';

const filePathSchema = new mongoose.Schema({

    subject: {
        type: String,
        required: false
    },
    path: String
});

const FilePathModel = mongoose.model("FilePath", filePathSchema);

export default FilePathModel;