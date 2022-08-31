describe('ui-components: CompleteFollowUpOrderForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=completefollowuporderform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CompleteFollowUpOrderForm!');
    });
});
