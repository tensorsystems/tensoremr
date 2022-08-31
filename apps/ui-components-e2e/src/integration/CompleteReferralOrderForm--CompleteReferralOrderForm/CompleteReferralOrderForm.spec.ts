describe('ui-components: CompleteReferralOrderForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=completereferralorderform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CompleteReferralOrderForm!');
    });
});
