describe('ui-components: MedicationTable component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=medicationtable--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to MedicationTable!');
    });
});
