describe('ui-components: PatientRegistrationLayout component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=patientregistrationlayout--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PatientRegistrationLayout!');
    });
});
