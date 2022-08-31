describe('ui-components: PatientRegistrationEmergencyInfoForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=patientregistrationemergencyinfoform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PatientRegistrationEmergencyInfoForm!');
    });
});
