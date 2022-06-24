# Chat App

## [Live Demo](https://cr-chat-app.herokuapp.com/)

## Features

* Join a specified room to chat

* Send the geographical location to other users in the room if permission is granted

* Automatically scroll down upon receiving a new message

* Responsive web design (RWD)

## Getting Started

Follow the instructions below to set up the environment and run this project on your local machine

#### Prerequisites

* Node.js

#### Installing

* Download ZIP or clone this repo
```bash
> git clone https://github.com/CRManoj/Chat-App
```
* Install dependencies via NPM
```bash
> npm install
```
* Back to the root directory and type the below command to start the server and the service
```bash
> npm run dev
```
* See it up and running on [http://localhost:8000](http://localhost:8000)

## Deployment

* Deploy to Heroku
```bash
> heroku create
> git push heroku master
```
* Open the app in the browser
```bash
> heroku open
```
## Built With

#### Frontend
* jquery
* mustache

#### Backend
* express
* NodeJS
* helmet

#### Utils
* socket.io
* moment

## Notes

* Send an event to everybody in the room 'The Office Fans'
```bash
io.emit -> io.to('The Office Fans').emit
```
* Send an event to everybody in the room 'The Office Fans' except for the current user
```bash
socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
```
* Send an event to a specific user
```bash
socket.emit
```
## Authors
* [Manoj Kumar C](https://github.com/CRManoj)
