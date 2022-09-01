describe('ui-components: StatCard component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=statcard--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to StatCard!');
    });
});
