describe('ui-components: DrugComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=drugcomponent--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to DrugComponent!');
  });
});
