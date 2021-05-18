import './App.css'
import React from 'react'
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

    this.handleAll = this.handleAll.bind(this)
  }



  componentDidMount() {
    socket.on('chat message', msg => {
      console.log(this.state.messages)
      this.setState({ messages: this.state.messages.concat(msg) })
      console.log('got a message')
      console.log(msg)
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
      console.log('hello from handleislogged')
      this.setState({isLoggedIn: true})
    }
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
                {/* <li>
                  <Link to="/Rooms/:room">Rooms</Link>
                </li> */}
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
              <Route exact path="/"><Home isLoggedIn={this.state.isLoggedIn} nick={this.state.nick} /></Route>

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


        {/* <Rooms messages={this.state.messages} setRoom={(room) => this.setState({ room })} room={this.state.room} />
        <MessageForm handleSubmit={this.handleSubmit.bind(this)} />
        {this.state.messages
          .filter(msg => msg.room === this.state.room)
          .map((msg, index) => <li key={index}>{msg.text}</li>)} */}
      </div>
    )
  }
}

function Home(props) {
  return (props.isLoggedIn ? <div>Welcome {props.nick}!</div> : <div>Please Sign In</div>)

}

function Login() {
  return <h2>Login</h2>
}

function Logout() {
  return <h2>Logout</h2>
}



export default App
