describe('ui-components: MainLayout component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=mainlayout--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to MainLayout!');
    });
});
