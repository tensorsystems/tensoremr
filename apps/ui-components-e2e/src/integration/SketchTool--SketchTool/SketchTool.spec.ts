describe('ui-components: SketchTool component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=sketchtool--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to SketchTool!');
    });
});
