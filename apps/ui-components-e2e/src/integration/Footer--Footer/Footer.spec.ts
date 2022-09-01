describe('ui-components: Footer component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=footer--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Footer!');
    });
});
