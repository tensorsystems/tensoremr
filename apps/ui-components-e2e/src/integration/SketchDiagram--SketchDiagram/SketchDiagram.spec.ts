describe('ui-components: SketchDiagram component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=sketchdiagram--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to SketchDiagram!');
    });
});
