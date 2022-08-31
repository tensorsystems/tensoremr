describe('ui-components: RefractionDistanceComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=refractiondistancecomponent--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to RefractionDistanceComponent!');
    });
});
