describe('ui-components: OrdersToolbar component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=orderstoolbar--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to OrdersToolbar!');
    });
});
