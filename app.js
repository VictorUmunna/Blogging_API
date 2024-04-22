// Require the necessary modules
const express = require('express');

// Set the port for the server
const PORT = 4000;

// Create an instance of express
const app = express();

// Use the express.json() middleware
app.use(express.json());

// Require the routers
const userRouter = require('./routes/userRoute')
const blogRouter = require('./routes/blogRoute')

// Use the routers
app.use('/user', userRouter)
app.use('/blog', blogRouter)

// Add a homepage endpoint
app.get('/', (req, res) => {
    res.send("Welcome to my Blogging App")
})

// Listen for requests made to the server
app.listen(PORT, (req, res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
 