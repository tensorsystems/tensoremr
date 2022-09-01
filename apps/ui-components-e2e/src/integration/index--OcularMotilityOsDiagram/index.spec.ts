describe('ui-components: OcularMotilityOsDiagram component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=ocularmotilityosdiagram--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to OcularMotilityOsDiagram!');
    });
});
