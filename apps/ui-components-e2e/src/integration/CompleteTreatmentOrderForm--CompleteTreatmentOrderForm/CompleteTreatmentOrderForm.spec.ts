describe('ui-components: CompleteTreatmentOrderForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=completetreatmentorderform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CompleteTreatmentOrderForm!');
    });
});
