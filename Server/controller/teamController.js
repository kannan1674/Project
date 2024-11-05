const Team = require('../model/team')



exports.createTeam = async (req, res, next) => {
    try {
        const { TeamName, employeeIds } = req.body;

        if (!TeamName) {
            return res.status(400).send({ message: "Please Provide Team Name" });
        }

        // Assuming employeeIds is now an array of objects with id and name
        const employeeIDs = employeeIds.map(emp => emp.id); // Extract just the IDs for storage

        const team = new Team({ TeamName, employees: employeeIDs });
        await team.save();

        return res.status(201).json({
            message: "Team Created",
            status: "Success",
            team: {
                id: team._id,
                TeamName: team.TeamName,
                employees: team.employees, // Store only IDs in the database
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getTeam = async(req,res,next)=>{
    try {
        const team = await Team.find()
    return res.status(200).json(team)
    } catch (error) {
        next(error)
    }
}