describe('ui-components: HomePages component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=homepages--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to HomePages!');
    });
});
