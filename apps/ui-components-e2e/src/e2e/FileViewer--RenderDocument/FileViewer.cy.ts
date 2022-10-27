describe('ui-components: RenderDocument component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=renderdocument--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to RenderDocument!');
  });
});
