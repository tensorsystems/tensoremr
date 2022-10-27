describe('ui-components: SearchBarAppointments component', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=searchbarappointments--primary&args=currentDateTime;appointments;'
    )
  );

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to SearchBarAppointments!');
  });
});
