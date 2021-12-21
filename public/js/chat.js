//this will allow to us connect to server
//this will allow us to send events and receive events from both server and client
const socket = io()

//Elements for message-form,button,input
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
//this is for div messages
const $messages = document.querySelector('#messages')

//Templates and .innerHTML will give access to that element and we html innerside
const messageTemplate = document.querySelector('#message-template').innerHTML
//this is the template for the location
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
//template for sidebar
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options   
//Qs will be used for query string
//to ignore the question mark we will be using ignoreQueryPrefix
//and destructing object  to store username and Roomname
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix : true})



//we will be implementing the autoscroll for new messages
const autoscroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of the new Message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const VisibleHeight = $messages.offsetHeight

    //Height of messages Container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled
    const scrollOffset = $messages.scrollTop + VisibleHeight

    //this condition will scroll to the bottom
    if(containerHeight - $newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}



//Elements for the send-location
const $sendLocationButton = document.querySelector('#send-location')


//receving the message and displaying it on the terminal
socket.on('message', (message) => {
    console.log(message)
    //we will be rendering  the template with the help of Mustache Libary
    const html = Mustache.render(messageTemplate, {
        username : message.username,
        //this mustache to send the value to the template and we have to take only text from the message object
        message : message.text,
        //now we will be moments.js for the time format in our required style
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    //we will be displaying in the messages div
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



//we sending the location in the shorter url
socket.on('locationMessage', (message) => {
    console.log(message)
    //we will be rendering the location template
    const html = Mustache.render(locationMessageTemplate, {
        username : message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    //we will be displaying the message in the div
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



//we displaying the list of user in the dispaly
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})



//setting up the listerner for the form 
$messageForm.addEventListener('submit', (e) => {
    //to avoid the default behavior where the browser go the go false refresh 
    e.preventDefault()

    //we will be disabling the button when we are sending the same message
    $messageFormButton.setAttribute('disabled','disabled')

    //grabing the value from the input
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message, (error) => {

        //we will be enabling the message after that is enabled
        $messageFormButton.removeAttribute('disabled')
        //we will be clearing the input after sending the message
        $messageFormInput.value = ''
        //we want the poniter to point inside the input form 
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message Delivered')
    })
})



//we will be grabing the button location id and a function when a button is clicked
$sendLocationButton.addEventListener('click', () => {

    //now we will be checking the wheather the geolocation is supported or not in the browser
    if(!navigator.geolocation) {
        //now we will be using the alert
        return alert('Geolocation is not supported by your Browser')
    }

    //we will be disabling the button when we are sending the same message
    $sendLocationButton.setAttribute('disabled','disabled')

    //we will be running the code if the geolocation is working
    navigator.geolocation.getCurrentPosition( (position) => {

        //now we will be sending the location to the connected client
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
            //setting the client acknowledgment function
        }, () => {

            //now we will be enabling the button
            $sendLocationButton.removeAttribute('disabled')

            //printing the message when acknowledged
            console.log('Location Shared!')
        })

    })
})




//now We Will be sending the username and Roomname to the server by emitting of
socket.emit('join', { username, room }, (error) => {
    //if there is error by same name or any error we will redirectingthem to same page to recorrect
    if(error){
        alert(error)
        location.href = "/"
    }
})