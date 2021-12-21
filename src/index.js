//serving the path directory to the folders
const path = require('path')

const http = require('http')

//we to load express
const express =  require('express')

//we will be loading the socket libary
const socketio = require('socket.io')

//we will be loading the bad-words libary
const Filter = require('bad-words')

//we will be using the messages.js for the timestamp and it is also used for location also
//we will be using the destructing to grap property and store as a standalone as a variable
const { generateMessage, generateLocationMessage } = require('./utils/messages')

//we will be loading the all four function of user.js
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

//create our new express application get configured up and running 
const app = express()

//this will allow us to create a new web server and we will pass our express application
const server = http.createServer(app)

//we create instance of socketio to config to work with our server
const io = socketio(server)

const port = process.env.PORT || 3000

//setting the path to the public Directory
const publicDirectoryPath = path.join(__dirname,'../public')

//we configure the server by using express static middleware to serve up in the publicDirectoyPath
app.use(express.static(publicDirectoryPath))




//printing the message on the terminal when client get connected and passing with event that is connection
io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    //setup a listener for the join and do create event
    socket.on('join', (Options, callback) => {

        //we will keep track of user with user.js function
        //instead of  giving username, room we use like ...options (spread operator)
        const { error, user } = addUser({ id: socket.id, ...Options })

        if(error){
            return callback(error)
        }

        //to join the individual room there is a method and it is only used on the server that is socket.join we will help
        //this will specifically emit the events to that room only
        socket.join(user.room)

        //instead of "socket.broadcast.emit" ==> "socket.broadcast.to(room).emit"

        socket.emit('message', generateMessage('Admin','Welcome!'))
        //message is sent when a new user is joined expect for the joined user
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has Joined!`))
        //we will be sending the list everybody in room including the user
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })
        callback()
    })



    //we will be receving the message from 'sendMessage'
    socket.on('sendMessage', (message,callback) => {
        //we will be using user from id to send the messages
        const user = getUser(socket.id)

        //we will be taking the new instance of filter
        const filter = new Filter()

        //we will be using the profane method to check weather the string is containg profane or not
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        //we will emit message only when there is no profanity
        io.to(user.room).emit('message',generateMessage(user.username, message))
        //this is acknowledgement event
        callback()
    })




    //now we will be receving the location and printing it on the terminal
    //setting the server to send back the acknowledgment
    socket.on('sendLocation', (coords,callback) => {
        const user = getUser(socket.id)
        //instead of sending the latitude,longitude we will be sending the location
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })




    //we will be sending the message when user has left
    socket.on('disconnect', () => {
        //we will removing the user from the list
        const user = removeUser(socket.id)

        //if the user is not the part of the room then we dont want to send message
        if(user){
         //if the user is part of the room
         io.to(user.room).emit('message',generateMessage('Admin',`${user.username} Has Left`))  
         //we will also send the updated data when the user left room
         io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        }) 
        }
    })
})




//To start the server up,by providing the port
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})