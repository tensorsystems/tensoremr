describe('ui-components: Chip component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=chip--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Chip!');
    });
});
