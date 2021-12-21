//To Keep The Track Of User
const users = []




//fuction are done based on adduser,removeuser,getuser,getUsersInRoom
//adduser to keep the track of the user join,
//removeuser to stop the track of the user,
//getuser this is for allowing us to fetch the existing user data,
//getUsersInRoom allowing us to get the list specific user in the room




const addUser = ({ id, username, room }) => {
    //clean the data to get username
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error : 'UserName and Room are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        //we are checking for unique username
        return user.room === room && user.username == username
    })

    //validate username
    //if there is an existing username then user cannot be added to room
    if(existingUser) {
        return {
            error: 'UserName is in Use!'
        }
    }

    //Store User
    //we are going store and pushing it to the array to return it
    const user = { id, username, room }
    users.push(user)
    return { user }

}



//To remove user
const removeUser = (id) => {
    //checking for the id
    const index = users.findIndex((user) => user.id == id)

    if(index !== -1){
        //splice is used to remove through index we found with number of items
        return users.splice(index,1)[0]
    } 
}




//to fetch the user and "find" will return the data if it found otherwise it will return undefined
const getUser = (id) => {
    return users.find((user) => user.id === id)
}



//to list the user
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



//now we will export all of these function
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
