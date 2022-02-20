describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/api/testing/reset');
    const user = {
      name: 'Superuser',
      username: 'admin',
      password: 'secret',
    };
    cy.request('POST', 'http://localhost:3000/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('displays login form at start', () => {
    cy.contains(/log in/i);
    cy.contains(/username/i);
    cy.contains(/password/i);
  });

  describe('Logging in', () => {
    it('existing user can log in', () => {
      cy.contains('username')
        .as('usernameContainer')
        .find('input').type('admin');

      cy.contains('password')
        .find('input')
        .type('secret');

      cy.get('@usernameContainer')
        .parent()
        .find('button')
        .click();

      cy.contains(/Superuser/);
      cy.contains(/log out/i);
      cy.get('[data-cy=navbar]');
    });

    it('login fails with wrong password', () => {
      cy.contains('username')
        .as('usernameContainer')
        .find('input').type('admin');

      cy.contains('password')
        .find('input')
        .type('wrongpassword');

      cy.get('@usernameContainer')
        .parent()
        .find('button')
        .click();

      cy.contains('invalid username or password').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('Logging out', () => {
    beforeEach(() => {
      cy.login({ username: 'admin', password: 'secret' });
    });

    it('logged in user can log out', () => {
      cy.contains(/log out/i).click();
      cy.contains(/log out/i).should('not.exist');
      cy.contains(/log in/i);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'admin', password: 'secret' });
    });

    it('a blog can be created', () => {
      cy.contains('Add blog').click();
      cy.contains('Title: ').find('input').type('test title');
      cy.contains('Author: ').find('input').type('test author');
      cy.contains('URL: ').find('input').type('testurl.com');
      cy.contains('Save').as('saveBtn').click();

      cy.contains('test title by test author');
      cy.get('@saveBtn').should('not.be.visible');
      cy.contains('New blog added!');
    });

    describe('when navigating through navbar', () => {
      it('user can view users page', () => {
        cy.contains(/users/i).click();
        cy.url().should('include', '/users');
      });

      describe('Users page', () => {
        describe('when there are multiple users', () => {
          beforeEach(() => {
            cy.createUser({
              name: 'Superuser2',
              username: 'admin2',
              password: 'secret',
            });
            cy.createUser({
              name: 'Superuser3',
              username: 'admin3',
              password: 'secret',
            });
            cy.visit('http://localhost:3000/users');
          });

          it.only('user can view a list of users', () => {
            cy.get('[data-cy=user-item]')
              .then((users) => {
                expect(users.length).to.equal(3);
              });
          });
        });
      });
    });

    describe('when blogs exist', () => {
      beforeEach(() => {
        cy.createBlog({
          title: 'title 1',
          author: 'author 1',
          url: 'url1.com',
        });

        cy.createBlog({
          title: 'title 2',
          author: 'author 2',
          url: 'url2.com',
        });
      });

      it('user can like a blog', () => {
        cy.contains('show').click();
        cy.contains('likes: 0');
        cy.contains('like').click();
        cy.contains('likes: 1');
      });

      it('username of creator is visible after liking/updating blog', () => {
        cy.contains('show').click();
        cy.contains('like').click();
        cy.contains('likes: 1');
        cy.contains('admin');
      });

      it('user can delete their own blog', () => {
        cy.contains('title 1')
          .as('userBlog')
          .find('button')
          .click();

        cy.get('@userBlog')
          .contains('delete')
          .click();

        cy.contains('Blog deleted!');
        cy.get('@userBlog').should('not.exist');
        cy.reload();
        cy.get('@userBlog').should('not.exist');
      });

      it('user can not delete another users blog', () => {
        cy.createUser({
          name: 'Other User',
          username: 'admin2',
          password: 'secret2',
        });

        cy.loginAsDifferentUser({ username: 'admin2', password: 'secret2' });

        cy.contains('title 1')
          .as('userBlog')
          .find('button')
          .click();

        cy.get('@userBlog')
          .contains('delete')
          .should('not.exist');
      });

      it('blogs are sorted by likes in ascending order', () => {
        cy.get('[data-cy=blogItem]')
          .then((blogs) => {
            expect(blogs[0]).to.contain.text('title 1');
          });

        cy.contains('title 2')
          .as('blog')
          .contains('show')
          .click();

        cy.get('@blog')
          .contains('like')
          .click();

        cy.get('[data-cy=blogItem]')
          .then((blogs) => {
            expect(blogs[0]).to.contain.text('title 2');
            expect(blogs[0]).to.contain.text('likes: 1');
          });
      });
    });
  });
});
