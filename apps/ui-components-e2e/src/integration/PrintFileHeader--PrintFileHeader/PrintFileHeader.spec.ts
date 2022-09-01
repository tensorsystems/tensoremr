describe('ui-components: PrintFileHeader component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=printfileheader--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PrintFileHeader!');
    });
});
