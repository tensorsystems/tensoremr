describe('ui-components: HomeTabs component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=hometabs--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to HomeTabs!');
    });
});
