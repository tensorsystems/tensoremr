describe('ui-components: CompleteSurgicalOrderForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=completesurgicalorderform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CompleteSurgicalOrderForm!');
    });
});
