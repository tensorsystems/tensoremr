describe('ui-components: ProfileTabs component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=profiletabs--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ProfileTabs!');
    });
});
