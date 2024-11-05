const mongoose = require('mongoose'); // Corrected from 'moongoose' to 'mongoose'

const teamSchema = mongoose.Schema({
    TeamName: {
        type: String,
        required: true,
        unique: true
    },
    employees: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee' 
    }]
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
