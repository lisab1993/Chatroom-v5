import './App.css'
import React, { useState, useEffect } from 'react';
import Rooms from './Rooms'
import Signin from './Signin'
import MessageForm from './MessageForm'
import io from '../../node_modules/socket.io/client-dist/socket.io.js'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const socket = io()

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      room: '',
      nick: '',
      isLoggedIn: false,
      userValue: '',
    }

    this.handleSubmitMessage = this.handleSubmitMessage.bind(this)
    this.handleAll = this.handleAll.bind(this)
    this.getRooms = this.getRooms.bind(this)
    this.handleRoomState = this.handleRoomState.bind(this)
  }



  componentDidMount() {
    socket.on('chat message', msg => {
      // console.log(this.state.messages)
      this.setState({ messages: this.state.messages.concat(msg) })
      // console.log('got a message')
      // console.log(msg)
    })

    fetch('/messages')
      .then(res => res.json())
      .then(newMessages => {
        this.setState({ messages: newMessages })
      })
  }


  handleAll(nick) {
    this.setState({ nick })
    if (nick !== '') {
      // console.log('hello from handleislogged')
      this.setState({isLoggedIn: true})
    }
  }

  handleRoomState (room) {
    this.setState({room: room})
  }

  handleSubmitMessage (text) {
    const message = { nick: this.state.nick, room: this.state.room, text }
    // console.log(message)
    socket.emit('chat message', message)
  }

  getRooms (messages, newRoom) {
    console.log(messages)
    const rooms = messages.map(msg => msg.room)
    rooms.push(newRoom)
    const allRooms = rooms.filter(room => room)
  
    const uniqrooms = Array.from(new Set(allRooms))
    return uniqrooms
  }


  render() {
    return (
      <div className='App'>
        <h1>Chatroom phase 4</h1>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/Rooms/:room">Rooms</Link>
                </li>
                <li>
                  <Link to="/Login">Login</Link>
                </li>
                <li>
                  <Link to="/Logout">Logout</Link>
                </li>
                <li>
                  <Link to="/Signin">Signin</Link>
                </li>
              </ul>
            </nav>

            <Switch>
              <Route exact path="/">
                <Home isLoggedIn={this.state.isLoggedIn} 
                nick={this.state.nick}
                messages={this.state.messages} 
                room={this.state.room}
                Room={Rooms}
                MessageForm={MessageForm}
                handleSubmitMessage={this.handleSubmitMessage}
                getRooms={this.getRooms}
                useEffect={this.useEffect}
                handleRoomState={this.handleRoomState}
                />
                </Route>

              <Route path="/Login"><Login /></Route>

              <Route path="/Logout"><Logout /></Route>

              <Route path="/Signin">
                <Signin setState={(nick) => this.setState({ nick })}
                handleAll={this.handleAll} 
                userValue={this.state.userValue} 
              />
              </Route>

            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}


function Home(props) {
  // useEffect(() => {
  //   const room = props.match.params
  //   console.log(room)
  // })


  return (props.isLoggedIn
    // True  
    ? 
  <div>
    Welcome {props.nick}!
    <Rooms handleRoomState={props.handleRoomState} messages={props.messages} getRooms={props.getRooms(props.messages, props.room)} />
        <MessageForm  handleSubmitMessage = {props.handleSubmitMessage} /> 
        {props.messages
          .filter(msg => msg.room === props.room)
          .map((msg, index) => <li key={index}>{msg.text}</li>)}
  </div> 
  // False 
  : 
  <div
  >Please Sign In
  </div>

  )
}

function Login() {
  return <h2>Login</h2>
}

function Logout() {
  return <h2>Logout</h2>
}



export default App
