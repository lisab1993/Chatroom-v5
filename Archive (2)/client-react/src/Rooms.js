import React, { useState } from 'react'

function getRooms (messages, newRoom) {
  console.log(messages)
  const rooms = messages.map(msg => msg.room)
  rooms.push(newRoom)
  const allRooms = rooms.filter(room => room)

  const uniqrooms = Array.from(new Set(allRooms))
  return uniqrooms
}

export default function Rooms (props) {
  const [newRoom, setNewRoom] = useState('')

  function addRoom () {
    const newRoom = prompt('enter a new room name: ')
    setNewRoom(newRoom)
  }

  return (
    <div id='room'>
      <button onClick={addRoom}>Add Room</button>
      <label htmlFor='room-select'>Change Room:</label>
      <select onChange={event => props.setRoom(event.target.value)} value={newRoom || props.room} id='room-select'>
        <option value=''>--Select a Room--</option>
        {getRooms(props.messages, newRoom).map(room => <option key={room} value={room}>{room}</option>)}
      </select>
    </div>
  )
}
