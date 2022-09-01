describe('ui-components: FileUploader component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=fileuploader--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to FileUploader!');
    });
});
