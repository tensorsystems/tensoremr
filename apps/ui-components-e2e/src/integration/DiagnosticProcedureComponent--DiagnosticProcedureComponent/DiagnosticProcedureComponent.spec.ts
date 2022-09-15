describe('ui-components: DiagnosticProcedureComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=diagnosticprocedurecomponent--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to DiagnosticProcedureComponent!');
    });
});
