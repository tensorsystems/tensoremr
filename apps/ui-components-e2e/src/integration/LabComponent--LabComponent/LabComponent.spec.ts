describe('ui-components: LabComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=labcomponent--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to LabComponent!');
    });
});
