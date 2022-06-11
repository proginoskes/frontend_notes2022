import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

describe('<NoteForm/>', () => {
    test('updates parent state and calls onSubmit', async () => {
        const createNote = jest.fn()
        const user = userEvent.setup()

        render(<NoteForm createNote={createNote} />)

        const input = screen.getAllByRole('textbox')
        const sendButton = screen.getByText('save')

        await user.type(input[0], 'testing a form...' )
        await user.click(sendButton)

        expect(createNote.mock.calls).toHaveLength(1)
        expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
    })
    test('updates parent state and calls onSubmit by placeholder text', async () => {
        const createNote = jest.fn()

        render(<NoteForm createNote={createNote} />)

        const input = screen.getByPlaceholderText('write a note')
        const sendButton = screen.getByText('save')

        await userEvent.type(input, 'testing a form...' )
        await userEvent.click(sendButton)

        expect(createNote.mock.calls).toHaveLength(1)
        expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
    })
    test('updates parent state and calls onSubmit by id', async () => {
        const createNote = jest.fn()

        const { container } = render(<NoteForm createNote={createNote} />)

        const input = container.querySelector('#note-input')
        const sendButton = screen.getByText('save')

        await userEvent.type(input, 'testing a form...' )
        await userEvent.click(sendButton)

        expect(createNote.mock.calls).toHaveLength(1)
        expect(createNote.mock.calls[0][0].content).toBe('testing a form...' )
    })
})