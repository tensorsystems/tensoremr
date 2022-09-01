describe('ui-components: AutocompleteInput component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=autocompleteinput--primary&args=name;field;type;register;uri;setFormValue;control;disabled:false;onInputChange;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to AutocompleteInput!');
    });
});
