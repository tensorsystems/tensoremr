describe('ui-components: EyewearPrescriptionPrint component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=eyewearprescriptionprint--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to EyewearPrescriptionPrint!');
    });
});
