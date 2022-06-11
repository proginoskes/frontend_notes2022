import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
    const [notes, setNotes] = useState([])
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    //const [loginVisible, setLoginVisible] = useState(false)

    useEffect(() => {
        console.log('effect')
        noteService
            .getAll()
            .then(initialNotes => {
                console.log('promise fulfilled')
                setNotes(initialNotes)
            })
            .catch(err => {
                console.error(err)
            })
    },[])

    useEffect(() => {
        const loggerUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if(loggerUserJSON){
            const user = JSON.parse(loggerUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])

    const toggleImportanceOf = (id)  => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }
        //console.log(changedNote)
        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                //console.log(returnedNote)
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(() => {
                setErrorMessage(
                    `the note '${note.content}' does not exist on the server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                },5000)
                setNotes(notes.filter(n => n.id!==id))
            })
    }

    console.log('render',notes.length, 'notes')

    const notesToShow =
        showAll
            ? notes
            : notes.filter(note => note.important === true)

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility()
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
            })
            .catch(err => console.error(err))
    }

    // logging in
    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try{
            const user = await loginService.login({
                username, password
            })

            // enables caching in browser
            window.localStorage.setItem(
                'loggedNoteappUser', JSON.stringify(user)
            )

            noteService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }

    }

    const handleLogOut = () => {
        window.localStorage.removeItem('loggedNoteappUser')
        setUser(null)
    }

    const logInForm = () => {
        //const hideWhenLoginVisible = { display: loginVisible ? 'none' : '' }
        //const showWhenLoginVisible = { display: loginVisible ? '' : 'none' }
        return(
            <Togglable buttonLabel='login'>
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                />
            </Togglable>
        )
    }

    const logOutForm = () => (
        <button type="submit" onClick={handleLogOut}>Log Out</button>
    )

    // a hook to the note form
    const noteFormRef = useRef()

    const noteForm = () => (
        <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm createNote={addNote}/>
        </Togglable>
    )



    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>

            {
                user === null
                    ? logInForm()
                    :
                    <div>
                        <p>{user.name} logged-in</p>
                        {logOutForm()}
                        {noteForm()}
                    </div>
            }

            <button onClick={() => setShowAll(!showAll)}>{`show ${showAll ? 'important':'all'}`}</button>
            <ul>{notesToShow.map((note) => {
                return(
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )
            })}
            </ul>
            <Footer/>
        </div>
    )}

export default App