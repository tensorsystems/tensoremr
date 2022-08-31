describe('ui-components: ModalitySelectableItem component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=modalityselectableitem--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ModalitySelectableItem!');
    });
});
