import './App.css'
import React, { useState, useEffect } from 'react';
import Rooms from './Rooms'
import Signin from './Signin'
import MessageForm from './MessageForm'
import io from '../../node_modules/socket.io/client-dist/socket.io.js'
import { useHistory, Redirect } from "react-router-dom";



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
      redirect: '/',
    }

    this.handleSubmitMessage = this.handleSubmitMessage.bind(this)
    this.handleAll = this.handleAll.bind(this)
    this.getRooms = this.getRooms.bind(this)
    this.handleRoomState = this.handleRoomState.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
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
      this.setState({ isLoggedIn: true })
    }
  }

  handleRoomState(room) {
    this.setState({ room: room })
  }

  handleSubmitMessage(text) {
    // event.preventDefault()
    console.log('test')
    const message = { nick: this.state.nick, room: this.state.room, text }
    // console.log(message)
    socket.emit('chat message', message)
  }

  getRooms(messages, newRoom) {
    console.log(messages)
    const rooms = messages.map(msg => msg.room)
    rooms.push(newRoom)
    const allRooms = rooms.filter(room => room)

    const uniqrooms = Array.from(new Set(allRooms))
    return uniqrooms
  }

  handleLogout() {
    this.setState({isLoggedIn: false})
  }


  render() {
    return (
      <div className='App'>
        <h1>Chatroom phase 4</h1>
        <Router>
          <div>
            <header>
            <nav>
                <button>
                  <Link to="/">Home</Link>
                </button>

                {/* {!this.state.isLoggedIn &&
                <button>
                  <Link to="/Login">Login</Link>
                </button>} */}

                {this.state.isLoggedIn && 
                <button onClick={this.handleLogout}>
                  <Link to="/Logout">Logout</Link>
                </button>}

                {!this.state.isLoggedIn &&
                <button>
                  <Link to="/Signin">Sign Up</Link>
                </button>}
            </nav>
            </header>

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

              <Route path="/Rooms/:room">
                <RoomMessages
                  messages={this.state.messages}
                  room={this.state.room}
                  Room={Rooms}
                  MessageForm={MessageForm}
                  getRooms={this.getRooms}
                  handleRoomState={this.handleRoomState}
                  handleSubmitMessage={this.handleSubmitMessage}
                />
              </Route>

              {/* <Route path="/Login"><Login /></Route> */}

              <Route path="/Logout">
                <Logout 
                handleLogout={this.handleLogout}
                redirect={this.state.redirect}
                />
                </Route>

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

//Currently, signin also logs us in

//signin to create a user with name, pass, and email
//save that as our users
//be able to log in with existing info


function Home(props) {
  return (props.isLoggedIn
    // True  
    ?
    <div>
      Welcome {props.nick}!
    <Rooms handleRoomState={props.handleRoomState} messages={props.messages} getRooms={props.getRooms(props.messages, props.room)} />
    <MessageForm handleSubmitMessage={props.handleSubmitMessage} />

    </div>
    // False 
    :
    <div
    >Please Sign In
  </div>

  )
}

//messages and room
function RoomMessages(props) {
  return (
    <div>
      <Rooms handleRoomState={props.handleRoomState} messages={props.messages} getRooms={props.getRooms(props.messages, props.room)} />
      <MessageForm handleSubmitMessage={props.handleSubmitMessage} />
      {props.messages
        .filter(msg => msg.room === props.room)
        .map((msg, index) => <li key={index}>{msg.text}</li>)}
    </div>
  )
}

// function Login() {
//   return <h2>Login</h2>
// }

function Logout(props) {
  // const history = useHistory()
  return <Redirect to={props.redirect}/>
}



export default App
