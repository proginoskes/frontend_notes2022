import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

describe('<Note/>', () => {
    test('get by text visible', () => {
        const note = {
            content: 'Component testing is done with react-testing-library',
            important: true
        }

        render(<Note note={note} />)


        const element = screen.getByText('Component testing is done with react-testing-library')

        //screen.debug(element)

        expect(element).toBeDefined()

    })
    test('get by class name', () => {
        const note = {
            content: 'Component testing is done with react-testing-library',
            important: true
        }

        const { container } = render(<Note note={note} />)

        const div = container.querySelector('.note')
        //screen.debug(div)
        expect(div).toHaveTextContent('Component testing is done with react-testing-library')
    })
    // may need `npm install -D --exact jest-watch-typeahead@0.6.5`
    test('clicking the button calls event handler once', async () => {
        const note = {
            content: 'Component testing is done with react-testing-library',
            important: true
        }

        const mockHandler = jest.fn()

        render(
            <Note note={note} toggleImportance={mockHandler} />
        )

        const user = userEvent.setup()
        const button = screen.getByText('make not important')
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(1)
    })
    test('does not render this', () => {
        const note = {
            content: 'This is a reminder',
            important: true
        }

        render(<Note note={note} />)

        const element = screen.queryByText('do not want this thing to be rendered')
        expect(element).toBeNull()
    })
})