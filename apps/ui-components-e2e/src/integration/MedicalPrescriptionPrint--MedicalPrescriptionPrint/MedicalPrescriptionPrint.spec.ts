describe('ui-components: MedicalPrescriptionPrint component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=medicalprescriptionprint--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to MedicalPrescriptionPrint!');
    });
});
