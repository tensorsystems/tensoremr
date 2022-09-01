describe('ui-components: AppointmentFormContainer component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=appointmentformcontainer--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to AppointmentFormContainer!');
    });
});
