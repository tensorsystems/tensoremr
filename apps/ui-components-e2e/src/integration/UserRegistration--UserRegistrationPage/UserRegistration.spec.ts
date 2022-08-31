describe('ui-components: UserRegistrationPage component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=userregistrationpage--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to UserRegistrationPage!');
    });
});
