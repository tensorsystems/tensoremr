describe('ui-components: handlePatientClick component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=handlepatientclick--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to handlePatientClick!');
  });
});
