describe('ui-components: TablePagination component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=tablepagination--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to TablePagination!');
    });
});
