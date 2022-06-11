describe('Note app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Test User',
            username: 'testuser',
            password: 'testpassword'
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
    })

    it('login form can be opened', function(){
        cy.contains('login').click
    })

    it('a user can login and log out', function() {
        cy.contains('login').click()
        cy.get('#username').type('testuser')
        cy.get('#password').type('testpassword')
        cy.get('#login-button').click()

        cy.contains('Test User logged-in')

        cy.contains('Log Out').click()
        cy.get('#login-button')
    })

    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({username: 'testuser', password: 'testpassword'})
        })
        it('user can post a note', function () {
            cy.get('#note-create').click()
    
            cy.get('#note-input').type('Cypress is fun!')
            cy.get('#note-submit').click()
    
            cy.contains('Cypress is fun!')
        })
        describe('and a note exists', function () {
            beforeEach(function () {
                cy.contains('new note').click()
                cy.get('input').type('another note cypress')
                cy.contains('save').click()
            })
      
            it('it can be made important', function () {
                cy.contains('another note cypress')
                    .contains('make important')
                    .click()
        
                cy.contains('another note cypress')
                    .contains('make not important')
            })
        })
        afterEach(function () {
            cy.contains('Log Out').click()
            cy.get('#login-button')
        })
    })
    it('login fails with wrong password', function() {
        cy.contains('login').click()
        cy.get('#username').type('testuser')
        cy.get('#password').type('wrongpassword')
        cy.get('#login-button').click()

        cy.get('.error')
            .should('contain', 'Wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'Test User logged in')
    })
})