describe('ui-components: RefractionInput component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=refractioninput--primary&args=name;value;register;readOnly;onChange;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to RefractionInput!');
    });
});
