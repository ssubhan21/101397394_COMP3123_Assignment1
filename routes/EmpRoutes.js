const express = require('express');
const EmpModel = require('../models/EmpModels');
const routes = express.Router();

// CREATE NEW EMPLOYEE *****************************************************************
// User can create a new employee
// http://localhost:3030/api/v1/emp/employees
routes.post('/employees', async (req, res) => {
    const { first_name, last_name, email, position, salary, department } = req.body; // Destructure for clarity
    try {
        const newEmp = new EmpModel({
            first_name,
            last_name,
            email,
            position,
            salary,
            department,
        });
        await newEmp.save();
        console.log("New Employee created: ", newEmp);
        res.status(201).json({
            message: "Employee created successfully",
            employee_id: newEmp._id
           /* First_name: newEmp.first_name,
            Last_name:newEmp.last_name,
            Email: newEmp.email,
            Salary:newEmp.salary,
            DATE_OF_JOINING:newEmp.date_of_joining,
            Department:newEmp.department*/
        });
    } catch (error) {
        console.error("Error creating employee: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// VIEW ALL EMPLOYEES *****************************************************************
// User can get all employee list
// http://localhost:3030/api/v1/emp/employees
routes.get('/employees', async (req, res) => {
    try {
        const empList = await EmpModel.find({});
        console.log("ALL EMPLOYEES: \n", empList);
        res.status(200).json(empList);
    } catch (error) {
        console.error("Error fetching employees: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// GET EMPLOYEE BY ID *****************************************************************
// User can get employee details by employee id
// http://localhost:3030/api/v1/emp/employees/:eid
routes.get('/employees/:eid', async (req, res) => {
    try {
        const emp = await EmpModel.findById(req.params.eid);
        if (emp) {
            console.log("Employee found: ", emp);
            res.status(200).json(emp);
        } else {
            console.log("No Employee found with ID:", req.params.eid);
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        console.error("Error fetching employee: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// UPDATE EMPLOYEE DETAILS *****************************************************************
// User can update employee details
// http://localhost:3030/api/v1/emp/employees/:eid
routes.put('/employees/:eid', async (req, res) => {
    try {
        const updatedEmp = await EmpModel.findByIdAndUpdate(
            req.params.eid,
            req.body,
            { new: true }
        );
        if (!updatedEmp) {
            console.log("Employee not found with ID:", req.params.eid);
            return res.status(404).json({ message: "Employee not found" });
        }
        console.log("UPDATED EMPLOYEE INFO: ", updatedEmp);
        res.status(200).json({
            message: "Employee details updated successfully",
        });
    } catch (error) {
        console.error("Error updating employee: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// DELETE EMPLOYEE ********************************************************************************************
// User can delete employee by employee id
// http://localhost:3030/api/v1/emp/employees?eid=
routes.delete('/employees', async (req, res) => {
    const { eid } = req.query;
    try {
        const dltEmp = await EmpModel.findByIdAndDelete(eid);
        if (!dltEmp) {
            console.log("Employee not found with ID:", eid);
            return res.status(404).json({ message: "Employee not found" });
        }
        console.log("Employee Deleted successfully ");
        res.status(200).json({ message: "Employee deleted", dltEmp });
    } catch (error) {
        console.error("Error deleting employee: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = routes;
