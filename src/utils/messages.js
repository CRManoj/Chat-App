const generateMessage = (username,text) => {
    return {
        //we will be setting the properties which we want to transfer
        username,
        text,
        createdAt : new Date().getTime()
    }
}




//creating the timestamps for the location message
const generateLocationMessage = (username,url) => {
    return{
        username,
        url,
        createdAt : new Date().getTime()
    }
}



//we can export the files where as other files will be able to use like index.js and others
module.exports = {
    generateMessage,
    generateLocationMessage
}