describe('ui-components: Modal component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=modal--primary&args=open:false;title;description;positive;negative;onPositiveClick;onNegativeClick;onClose;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Modal!');
    });
});
