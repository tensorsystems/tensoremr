describe('ui-components: NavItem component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=navitem--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to NavItem!');
    });
});
