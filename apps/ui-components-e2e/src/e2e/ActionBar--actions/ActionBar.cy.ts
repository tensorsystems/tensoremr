describe('ui-components: actions component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=actions--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to actions!');
  });
});
