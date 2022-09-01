describe('ui-components: Component404 component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=component404--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Component404!');
    });
});
