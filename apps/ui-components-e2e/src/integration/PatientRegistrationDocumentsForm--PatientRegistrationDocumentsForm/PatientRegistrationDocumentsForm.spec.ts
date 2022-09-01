describe('ui-components: PatientRegistrationDocumentsForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=patientregistrationdocumentsform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PatientRegistrationDocumentsForm!');
    });
});
