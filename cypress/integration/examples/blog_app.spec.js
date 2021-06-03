describe('Blog app', function () {
  beforeEach(function () {
    // reset database via backend api call
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create a test user
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.get('form#login').should('be.visible')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {

    it('succeeds with correct credentials', function () {
      // type credentials
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      // click to submit the form
      cy.get('#login-button').click()
      // after login success
      cy.contains('Matti Luukkainen logged in')
      cy.contains('logout')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.alert').should('contain', 'Wrong credentials')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })

  })

  describe('When user is logged in', function () {
    beforeEach(function () {
      // log in user with created command
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('New blog can be created', function () {
      cy.contains('Add new').click()
      cy.get('input#title').type('Test blog')
      cy.get('input#author').type('author cypress')
      cy.get('input#url').type('www.cypress.com')
      cy.get('#create-button').click()
      cy.get('.alert').contains('Test blog')
      cy.get('.alert').contains('author cypress')
      cy.get('.blog-table').contains('Test blog')
      cy.get('.blog-table').contains('author cypress')
    })

    it('After logout login form is displayed again', function () {
      // after login success
      cy.contains('Matti Luukkainen logged in')
      // click to logout
      cy.get('#logout-button').click()
      cy.contains('Log in to application')
      cy.get('form#login').should('be.visible')
    })

    describe('And 3 blogs have been added', function () {
      beforeEach(function () {
        // create 3 blogs for the tests
        cy.createBlog({ title: 'First blog', author: 'Author 1', url: 'www.test1.com' })
        cy.createBlog({ title: 'Second blog', author: 'Author 2', url: 'www.test2.com' })
        cy.createBlog({ title: 'Third blog', author: 'Author 3', url: 'www.test3.com' })
      })

      it('Blog can be liked', function () {
        // click the link to Blog's page
        cy.contains('First blog').click()
        // likes are 0 by default
        cy.contains('th', 'Likes:')
        cy.contains('td#likes', '0')
        cy.get('#like-button').click()
        // likes have been increased to 1
        cy.contains('td#likes', '1')
      })

      it('Blog can be removed', function () {
        cy.contains('Second blog').click()
        cy.get('#remove-button').click()
        // Second blog should not appear
        cy.get('html').should('not.contain', 'Second blog')
        cy.get('tr').should('have.length', 2)
        cy.get('.alert').contains('Blog was removed')
      })

      it('Blogs will be sorted by likes', function () {
        // the 3rd blog will get 2 likes
        cy.contains('Third blog').click()
        // click Like button 2 times
        cy.get('#like-button').click()
        cy.contains('td#likes', '1')
        cy.get('#like-button').click()
        cy.contains('td#likes', '2')
        // back to Bloglist
        cy.get('#back-button').click()

        // the 1st blog will get 1 like
        cy.contains('First blog').click()
        cy.get('#like-button').click()
        cy.contains('td#likes', '1')
        // back to Bloglist
        cy.get('#back-button').click()

        // Third blog must be on first (top) table row, next First blog
        cy.get('tr').eq(0).contains('Third blog').should('exist')
        cy.get('tr').eq(1).contains('First blog').should('exist')
      })

      it('Blog can be commented', function () {
        cy.contains('a', 'Second blog').click()
        // Add first comment
        cy.get('input#comment').type('First comment')
        cy.get('#comment-button').click()
        cy.contains('First comment')
        // Add second comment
        cy.get('input#comment').type('Second comment')
        cy.get('#comment-button').click()
        cy.contains('Second comment')
      })

    })

    describe('SecondUser logged in', function () {
      beforeEach(function () {
        // create a blog with user1
        cy.createBlog({ title: 'User1 blog', author: 'Author', url: 'www.test.com' })
        const secondUser = {
          username: 'hellas',
          name: 'Arto Hellas',
          password: 'secret'
        }
        // create the second user and login
        cy.request('POST', 'http://localhost:3003/api/users', secondUser)
        cy.login({ username: 'hellas', password: 'secret' })
      })

      it('Users are listed correctly on Users page', function () {
        // click the link to Users page
        cy.contains('a', 'users').click()
        // correct page content
        cy.contains('th', 'Name')
        cy.contains('th', 'Blogs created')
        // two user rows and 0 and 1 blogs
        cy.get('tbody tr').should('have.length', 2)
        cy.contains('td#user-name', 'Matti Luukkainen')
        cy.contains('td#user-blogs', '1')
        cy.contains('td#user-name', 'Arto Hellas')
        cy.contains('td#user-blogs', '0')
      })

      it('Blog can not be removed by another user than the creator', function () {
        cy.contains('Arto Hellas logged in')
        // click to view the blog from user1
        cy.contains('User1 blog').click()
        // Remove button should not appear
        cy.get('html').should('not.contain', 'Remove')
        cy.get('#remove-button').should('not.exist')
      })

    })

  })

})
