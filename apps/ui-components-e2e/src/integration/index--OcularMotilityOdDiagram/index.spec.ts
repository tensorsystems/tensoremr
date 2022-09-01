describe('ui-components: OcularMotilityOdDiagram component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=ocularmotilityoddiagram--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to OcularMotilityOdDiagram!');
    });
});
