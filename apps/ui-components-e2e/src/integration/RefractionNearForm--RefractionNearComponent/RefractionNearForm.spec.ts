describe('ui-components: RefractionNearComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=refractionnearcomponent--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to RefractionNearComponent!');
    });
});
