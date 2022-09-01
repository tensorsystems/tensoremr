describe('ui-components: EyeGlassTable component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=eyeglasstable--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to EyeGlassTable!');
    });
});
