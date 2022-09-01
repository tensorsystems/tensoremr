describe('ui-components: ProtectedRoute component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=protectedroute--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ProtectedRoute!');
    });
});
