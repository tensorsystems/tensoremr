describe('ui-components: PrescriptionOrdersToolbar component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=prescriptionorderstoolbar--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PrescriptionOrdersToolbar!');
    });
});
