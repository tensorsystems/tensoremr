describe('ui-components: PatientRegistrationContactInfoForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=patientregistrationcontactinfoform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PatientRegistrationContactInfoForm!');
    });
});
