const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    designation: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stipend: {
        type: String,
        required: true
    },
    postedOn: {
        type: String,
        required: true
    },
    applyBy: {
        type: String,
        required: true
    },
    aboutOrganization: {
        type: String,
        required: true
    },
    aboutInternship: {
        type: String,
        required: true
    },
    noOfInternship: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    whoCanApply: {
        type: String,
        required: true
    },
    perks: {
        type: String,
        required: true
    } 
});


const job = mongoose.model('Job', JobSchema);

module.exports = job;