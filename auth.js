const express = require('express');
const User = require('./userSchema');
const Country = require("./countrySchema");
const State = require("./stateSchema");
const City = require("./citySchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const table = require('table');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');

const JWT_SECRET = "Roshanis@goodboy";

// password : 123456, 789012

// Create the user in employee table

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a password of minimum length of 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ error: "Sorry this user already exist" });
        } else if ((req.body.age < 10 || req.body.age > 100)) {
            res.status(400).json({ error: "Enter a valid age" });
        } else if ((req.body.phoneNumber.length <= 6 || req.body.phoneNumber.length >= 11)) {
            res.status(400).json({ error: "Enter a valid phone number" });
        } else {
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
                salary: req.body.salary,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                phoneNumber: req.body.phoneNumber,
                password: securePassword
            })
            // await Country.create({
            //     name: req.body.country
            // })
            // await State.create({
            //     name: req.body.name,
            //     country: req.body.country
            // })
            // await City.create({
            //     name: req.body.name,
            //     state: req.body.state
            // })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken, user: user });
        }
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// login the user

router.get('/login', [
    query('email', 'Enter a valid email').isEmail(),
    query('password', 'Enter a password of minimum length of 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // console.log(req.query.email, req.query.password)
        let user = await User.findOne({ email: req.query.email });

        if (!user) {
            res.status(400).json({ error: "Please try to login with correct credentials" });
        } else {
            let passwordCompare = await bcrypt.compare(req.query.password, user.password);
            if (!passwordCompare) {
                res.status(400).json({ error: "Please try to login with correct credentials" });
            } else {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                success = true;
                res.json({ success, authToken, user: user });
            }
        }

    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// Read the data of employee table

router.get('/getuser', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.find({});
        let config = {
            border: table.getBorderCharacters("ramac"),
        }
        let data = [];
        user.forEach((element) => {
            let result = Object.entries(element);
            data.push(result);
        })
        let x = table.table(data, config);
        console.log(x)
        // let page = Number(req.query.page) || 1;
        // let limit = Number(req.query.limit) || 50;
        // let skip = (page - 1) * limit;
        // let users = await User.find({}).skip(skip).limit(limit);
        let users = await User.find().sort({ "salary": 1, "age": 1 });
        res.json(users);
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// Update the data in employee table

router.put('/updateuser/:id', async (req, res) => {
    const { name, age, email, salary, country, state, city, phoneNumber, password } = req.body;
    try {
        let newUser = {};
        if (name) { newUser.name = name };
        if (age && (age > 10 && age < 100)) {
            newUser.age = age
        };
        if (email) { newUser.email = email };
        if (salary) { newUser.salary = salary };
        if (country) { newUser.country = country };
        if (state) { newUser.state = state };
        if (city) { newUser.city = city };
        if (phoneNumber && (phoneNumber.length > 6 && phoneNumber.length < 11)) {
            newUser.phoneNumber = phoneNumber
        };
        if (password && password.length > 4) {
            newUser.phoneNumber = phoneNumber
        };

        let getUsers = await User.findById(req.params.id);
        if (!getUsers) {
            return res.status(404).send("User not found");
        }
        getUsers = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true });
        let user = await User.find({});
        res.json({ getUsers, user: user });
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// Delete the data from employee table

router.delete('/deleteuser/:id', async (req, res) => {
    try {
        let getUsers = await User.findById(req.params.id);
        if (!getUsers) {
            return res.status(404).send("User not found");
        }
        getUsers = await User.findByIdAndDelete(req.params.id);
        let user = await User.find({});
        res.json({ "Success": "User has been deleted", user: user });
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// Countries list for dropdown

router.get("/getcountries", async function (req, res) {
    try {
        let countries = await Country.find({});
        res.status(200).json({ success: true, msg: 'Country Data', data: countries })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// States list for dropdown

router.post("/getstates", async function (req, res) {
    try {
        let states = await State.find({ country: req.body.country });
        res.status(200).json({ success: true, msg: 'State Data', data: states })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// Cities list for dropdown

router.post("/getcities", async function (req, res) {
    try {
        let cities = await City.find({ state: req.body.state });
        res.status(200).json({ success: true, msg: 'City Data', data: cities })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// To store country value

router.post("/storecountry", async function (req, res) {
    try {
        let country = await Country.create({
            name: req.body.name
        });
        res.status(200).json({ success: true, country })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// To store state value

router.post("/storestate", async function (req, res) {
    try {
        let state = await State.create({
            name: req.body.name,
            country: req.body.country
        });
        res.status(200).json({ success: true, state })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// To store city value

router.post("/storecity", async function (req, res) {
    try {
        let city = await City.create({
            name: req.body.name,
            state: req.body.state
        });
        res.status(200).json({ success: true, city })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

// Search functionality for the employee user

router.get("/search/:name", async (req, res) => {
    try {
        const findname = req.params.name;
        const objs = await User.find({ name: { $regex: '.*' + findname + '.*' } });
        res.json(objs);
    } catch (error) {
        res.json({ message: error });
    }
})

module.exports = router;