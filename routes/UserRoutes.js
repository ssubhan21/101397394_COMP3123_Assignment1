/*const express = require('express')
const UserModel = require('../models/UserModels')

const routes = express.Router()

//CREATE ACCOUNT - POST********************************************************************
// Allow user to create new account
//http://localhost:3030/api/v1/user/signup
routes.post('/signup', async (req, res) => {
    try{
        const newUser = new UserModel({
            ...req.body
        })
        await newUser.save()
        console.log("New User created: " + newUser + "\n------------------------------------------------------------------------------------------------------------------")
        res.status(201).send(newUser)
    }catch(error){
        res.status(500).send(error)
    }
})


//LOGIN - POST********************************************************************
//Allow user to access the system
//http://localhost:3030/api/v1/user/login
routes.post('/login', async (req, res) => {
    const {username, password} = req.query

    try{
        const user = await UserModel.findOne({ $or: [{ username: username }, { email: username }] })
        if(user){
            if(password == user.password){
                console.log("USER LOOGED IN: " + user)
                res.send({
                    username: username,
                    password: password
                })
            }else{
                res.send({
                    status: false,
                    message: 'Invalid Username and/or password'
                })
            }
        }else{
            res.send({
                status: false,
                message: 'Invalid Username and/or password'
            })
        }

    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = routes
*/
const express = require('express');
const bcrypt = require('bcryptjs');  // Import bcrypt
const UserModel = require('../models/UserModels');

const routes = express.Router();

// CREATE ACCOUNT - POST********************************************************************
// Allow user to create new account
// http://localhost:3030/api/v1/user/signup
routes.post('/signup', async (req, res) => {
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 

        // Create a new user with the hashed password
        const newUser = new UserModel({
            ...req.body,
            password: hashedPassword 
        });

        await newUser.save();
        console.log("New User created: " + newUser + "\n------------------------------------------------------------------------------------------------------------------");
        res.status(201).send({
            message: "User created successfully",
            user_id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// LOGIN - POST********************************************************************
// Allow user to access the system
// http://localhost:3030/api/v1/user/login
routes.post('/login', async (req, res) => {
    const { username, password } = req.body;  // Use req.body for POST request

    try {
        // Find user by username or email
        const user = await UserModel.findOne({ $or: [{ username: username }, { email: username }] });

        if (user) {
            // Compare the hashed password in the database with the plain-text password provided
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                console.log("USER LOGGED IN: " + user);
                res.send({
                    status: true,
                    message: "Login successful",
                    username: user.username,
                    email: user.email
                });
            } else {
                res.status(400).send({
                    status: false,
                    message: 'Invalid Username and/or password'
                });
            }
        } else {
            res.status(400).send({
                status: false,
                message: 'Invalid Username and/or password'
            });
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = routes;
