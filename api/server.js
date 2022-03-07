const express = require('express')
const users = require('./users/model')
const server = express()

server.use(express.json())


server.get('/api/users', (req, res) => {
    users.find()
    .then(allUsers => {
        res.json(allUsers)
    })
    .catch(() => {
        res.status(400).json({message:'cannot find any users'})
    })
})

server.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    users.findById(id)
    .then(user => {
        if(user == null){
            res.status(404).json({message: `does not exist`})
        }else{
            res.json(user)
        }
    })
    .catch(() => {
        res.status(400).json({message: `Could not get user`})
    })
})

server.post('/api/users', (req, res) => {
    let body = req.body;
    if(!body.name) {
        res.status(400).json({ message: `provide name and bio` });
    } else if(!body.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        users.insert(body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(400).json({ message: "Please provide name and bio for the user" });
            });
    }
})

server.put('/api/users/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let body = req.body;
        if(!body.name) {
            res.status(400).json({ message:"Please provide name and bio for the user" });
            return;
        } else if(!body.bio) {
            res.status(400).json({ message:"Please provide name and bio for the user" });
            return;
        } else {
            let newUser = await users.update(id, body);
            if(newUser == null) {
                res.status(404).json({ message: `does not exist` });
                return;
            } else {
                res.status(200).json(newUser);
            }
        }
    } catch(e) {
        res.status(400).json({ message: `could not update user!` });
    }
});

server.delete('/api/users/:id', (req, res) => {
    let { id } = req.params;
    users.remove(id)
        .then(user => {
            if(user == null) {
                res.status(404).json({ message: `does not exist` });
                return;
            }

            res.status(200).json(user);
        })
        .catch(() => {
            res.status(400).json({ message: `could not delete user!` });
        });
});










module.exports = server; 

