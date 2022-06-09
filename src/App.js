import {useState, useEffect} from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

import noteService from './services/notes'


const App = (props) => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('add a note')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(()=>{
        console.log('effect')
        noteService
            .getAll()
            .then(initialNotes=>{
                console.log('promise fulfilled')
                setNotes(initialNotes)
            })
            .catch(err=>{
                console.error(err)
            })
    },[])

    const toggleImportanceOf = (id) =>{
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }
        //console.log(changedNote)
        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                console.log(returnedNote)
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(err=>{
                setErrorMessage(
                    `the note '${note.content}' does not exist on the server`
                )
                setTimeout(()=>{
                    setErrorMessage(null)
                },5000)
                setNotes(notes.filter(n=>n.id!==id))
            })
    }

    console.log('render',notes.length, 'notes')

    const notesToShow = 
        showAll 
            ? notes
            : notes.filter(note=>note.important === true)

    const addNote = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target)
        // SCHEMA   
        const noteObject = {
            content:newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5
        }

        noteService
            .create(noteObject)
            .then(returnedNote=>{
                console.log(returnedNote)
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
            .catch(err=>console.error(err))
    }

    const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            <button onClick={()=>setShowAll(!showAll)}>{`show ${showAll ? 'important':'all'}`}</button>
            <ul>{notesToShow.map((note)=>{
                return(
                    <Note 
                        key={note.id} 
                        note={note}
                        toggleImportance={()=>toggleImportanceOf(note.id)}
                    />
                )
            })}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
            <Footer/>
        </div>
)}

export default App