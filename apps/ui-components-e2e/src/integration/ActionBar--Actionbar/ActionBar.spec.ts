describe('ui-components: Actionbar component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=actionbar--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Actionbar!');
    });
});
