describe('ui-components: HistoryTypeComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=historytypecomponent--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to HistoryTypeComponent!');
    });
});
