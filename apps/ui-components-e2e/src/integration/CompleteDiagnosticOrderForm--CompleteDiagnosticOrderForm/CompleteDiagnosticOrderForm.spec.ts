describe('ui-components: CompleteDiagnosticOrderForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=completediagnosticorderform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CompleteDiagnosticOrderForm!');
    });
});
