describe('ui-components: AddMedicalPrescriptionForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=addmedicalprescriptionform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to AddMedicalPrescriptionForm!');
    });
});
