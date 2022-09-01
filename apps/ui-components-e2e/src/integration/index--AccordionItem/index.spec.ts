describe('ui-components: AccordionItem component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=accordionitem--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to AccordionItem!');
    });
});
