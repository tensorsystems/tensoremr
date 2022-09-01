describe('ui-components: TreatmentForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=treatmentform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to TreatmentForm!');
    });
});
