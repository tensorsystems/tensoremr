describe('ui-components: Tabs component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=tabs--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Tabs!');
    });
});
