describe('ui-components: IntraOpForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=intraopform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to IntraOpForm!');
    });
});
