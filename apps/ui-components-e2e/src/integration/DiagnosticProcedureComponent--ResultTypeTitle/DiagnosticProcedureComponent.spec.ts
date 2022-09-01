describe('ui-components: ResultTypeTitle component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=resulttypetitle--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ResultTypeTitle!');
    });
});
