import React, { useState } from 'react'
import { useHistory } from "react-router-dom";


export const Signin = (props) => {
    const [userValue, setUserValue] = useState('')
    const history = useHistory()
    // console.log(props)
    
    function handleChange(event) {
        setUserValue(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        props.handleAll(userValue)
        history.push('/')
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Username  */}
                <label>
                    Enter your Username:
                <input type="text" name="apple" value={userValue} onChange={handleChange} />
                </label>

                {/* Password */}
                <label>
                    Enter your Password:
                <input type="password" />
                </label>

                {/* Button */}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Signin