require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken');

app.use(express.json()) // lets our application use JSON from the body that gets passed up to it

const posts = [
    {
        username: "Kyle",
        title: "Post 1"
    },
    {
        username: "Jim",
        title: "Post 2"
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //sign first takes payload (what we want to serialize). Then it gets the secret key from our environment variables.
    res.json({accessToken: accessToken}) // returning our access token. Creates access token when we create a new user.
})

function authenticateToken(req, res, next) {
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(' ')[1]
   if (token == null) return res.sendStatus(401)

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
   })
}

app.listen(3020)