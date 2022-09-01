describe('ui-components: CompleteLabOrderForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=completelaborderform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CompleteLabOrderForm!');
    });
});
