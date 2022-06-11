import PropTypes from 'prop-types'

const LoginForm = (props) => {
    return(
        <form onSubmit={props.handleSubmit}>
            <div>
                username
                <input
                    id="username"
                    type="text"
                    value={props.username}
                    name="Username"
                    onChange={props.handleUsernameChange}
                />
            </div>
            <div>
                password
                <input
                    id="password"
                    type="text"
                    value={props.password}
                    name="Password"
                    onChange={props.handlePasswordChange}
                />
            </div>
            <button id="login-button" type="submit">login</button>
        </form>
    )
}

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}
export default LoginForm