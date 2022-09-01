describe('ui-components: CheckInForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=checkinform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CheckInForm!');
    });
});
