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
      // click the login button to open the form
      cy.contains('login').click()
      // type credentials
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      // click to submit the form
      cy.get('#login-button').click()
      // after login success
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
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
      cy.contains('Add new blog').click()
      cy.get('input#title').type('a new blog created')
      cy.get('input#author').type('author cypress')
      cy.get('input#url').type('www.cypress.com')
      cy.get('#create-button').click()
      cy.get('.blog-header').contains('a new blog created')
      cy.get('.blog-header').contains('author cypress')
    })

    describe('And blogs have been added', function () {
      beforeEach(function () {
        // create 3 blogs for the tests
        cy.createBlog({ title: 'First blog', author: 'Author 1', url: 'www.test1.com' })
        cy.createBlog({ title: 'Second blog', author: 'Author 2', url: 'www.test2.com' })
        cy.createBlog({ title: 'Third blog', author: 'Author 3', url: 'www.test3.com' })
      })

      it('Blog can be liked', function () {
        cy.contains('First blog').parent().as('blog1')
        cy.get('@blog1')
          .contains('View').click()
        // likes are 0 by default
        cy.get('@blog1').contains('likes 0')
        cy.get('@blog1').find('#like-button').click()
        // likes have been increased to 1
        cy.get('@blog1').contains('likes 1')
      })

      it('Blog can be removed', function () {
        cy.contains('Second blog').parent().as('blog2')
        cy.get('@blog2')
          .contains('View').click()
        cy.get('@blog2').find('#remove-button').click()
        // Second blog should not appear
        cy.get('html').should('not.contain', 'Second blog')
        cy.get('.blog').should('have.length', 2)
      })

      it('Blog can not be removed by another user than the creator', function () {
        const secondUser = {
          username: 'hellas',
          name: 'Arto Hellas',
          password: 'secret'
        }
        // create the second user and login
        cy.request('POST', 'http://localhost:3003/api/users', secondUser)
        cy.login({ username: 'hellas', password: 'secret' })

        cy.contains('First blog').parent().as('blog1')
        // click to view the First blog
        cy.get('@blog1')
          .contains('View').click()
        cy.get('@blog1').should('not.contain', 'Remove')
      })

      it('Blogs will be sorted by likes', function () {
        cy.contains('First blog').parent().as('blog1')
        cy.contains('Third blog').parent().as('blog3')

        // the 3rd blog will get 2 likes
        cy.get('@blog3').contains('View').click()
        // click Like button 2 times
        cy.get('@blog3').find('#like-button').click()
        cy.get('@blog3').contains('likes 1')
          .find('#like-button').click()
        cy.get('@blog3').contains('likes 2')

        // the 1st blog will get 1 like
        cy.get('@blog1').contains('View').click()
        cy.get('@blog1').find('#like-button').click()
        cy.get('@blog1').contains('likes 1')

        // Third blog must be the first blog on top, next First blog
        cy.get('.blog').eq(0).contains('Third blog').should('exist')
        cy.get('.blog').eq(1).contains('First blog').should('exist')
      })

    })

  })

})
