describe('ui-components: SearchBar component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=searchbar--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to SearchBar!');
    });
});
