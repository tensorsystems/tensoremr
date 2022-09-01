describe('ui-components: PositiveFindings component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=positivefindings--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PositiveFindings!');
    });
});
