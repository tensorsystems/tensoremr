describe('ui-components: UserRegistrationForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=userregistrationform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to UserRegistrationForm!');
    });
});
