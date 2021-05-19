import React, { useState } from 'react'
import { useHistory } from "react-router-dom";


function getRooms(messages, newRoom) {
  // console.log(messages)
  const rooms = messages.map(msg => msg.room)
  rooms.push(newRoom)
  const allRooms = rooms.filter(room => room)

  const uniqrooms = Array.from(new Set(allRooms))
  return uniqrooms
}



export default function Rooms(props) {
  const [newRoom, setNewRoom] = useState('')

  function addRoom() {
    const newRoom = prompt('enter a new room name: ')
    setNewRoom(newRoom)
  }

  const history = useHistory()
  function handleRoomChange(event) {
    const rooms = event.target.value
    history.push(`/Rooms/${rooms}`)
    props.handleRoomState(rooms)
  }

  return (
    <div id='room'>
      <button onClick={addRoom}>Add Room</button>
      <label htmlFor='room-select'>Change Room:</label>
      <select onChange={handleRoomChange} value={newRoom || props.room} id='room-select'>
        <option value=''>--Select a Room--</option>
        {getRooms(props.messages, newRoom).map(room => <option key={room} value={room}>{room}</option>)}
      </select>
    </div>
  )
}
