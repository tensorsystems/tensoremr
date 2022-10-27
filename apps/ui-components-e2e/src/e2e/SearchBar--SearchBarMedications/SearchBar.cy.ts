describe('ui-components: SearchBarMedications component', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=searchbarmedications--primary&args=medicalPrescriptions;'
    )
  );

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to SearchBarMedications!');
  });
});
