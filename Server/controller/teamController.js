const Team = require('../model/team');

exports.createTeam = async (req, res, next) => {
    try {
        const { TeamName, employeeIds } = req.body;

        if (!TeamName) {
            return res.status(400).send({ message: "Please Provide Team Name" });
        }

      
        if (!Array.isArray(employeeIds)) {
            return res.status(400).send({ message: "employeeIds should be an array" });
        }

      
        const employeeIDs = employeeIds.map(emp => emp.id); 

        const team = new Team({ TeamName, employees: employeeIDs });
        await team.save();

        return res.status(201).json({
            message: "Team Created",
            status: "Success",
            team: {
                TeamName: team.TeamName,
                employees: team.employees, 
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getTeam = async (req, res, next) => {
    try {
        const team = await Team.find();
        return res.status(200).json(team);
    } catch (error) {
        next(error);
    }
};
