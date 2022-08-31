describe('ui-components: UpdateMedicalPrescriptionForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=updatemedicalprescriptionform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to UpdateMedicalPrescriptionForm!');
    });
});
