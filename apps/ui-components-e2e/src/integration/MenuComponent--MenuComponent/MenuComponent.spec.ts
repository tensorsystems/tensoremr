describe('ui-components: MenuComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=menucomponent--primary&args=title;menus;color;rounded;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to MenuComponent!');
    });
});
