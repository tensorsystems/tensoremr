describe('ui-components: AppointmentForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=appointmentform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to AppointmentForm!');
    });
});
