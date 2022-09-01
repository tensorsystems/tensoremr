describe('ui-components: PreOpForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=preopform--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to PreOpForm!');
    });
});
