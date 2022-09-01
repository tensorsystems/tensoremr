describe('ui-components: PatientRegistrationDemographicForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=patientregistrationdemographicform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PatientRegistrationDemographicForm!');
    });
});
