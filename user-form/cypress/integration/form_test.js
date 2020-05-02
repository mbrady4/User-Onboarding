describe("User Onboarding Form Test", function () {

    beforeEach( function () {
        cy.visit("http://localhost:3000/");
    });

    it("Adds text to inputs", function () {
        cy.get('[data-cy="name"]').type("Mike").should("have.value", "Mike");
        cy.get('[data-cy="email"]').type("sid@gmail.com").should("have.value", "sid@gmail.com");
        cy.get('[data-cy="password"]').type("anything5").should("have.value", "anything5");
        cy.get('[type="checkbox"]').check().should("be.checked");
        cy.contains("Submit").click();
    });

    it("Checks that form validation works", function () {
        cy.get('[data-cy="email"]').type("mike")
        cy.get('[data-cy="emerror"]').contains("Must be a valid email address")
    
        cy.get('[data-cy="password"]').type("mike")
        cy.get('[data-cy="pwerror"]').contains("Must be at least 6 characters")    

        cy.contains("Submit").should('be.disabled')

        cy.get('[type="checkbox"]').check()
        cy.get('[data-cy="name"]').type('mike')
        cy.get('[data-cy="email"]').type("sid@gmail.com")
        cy.get('[data-cy="password"]').type("anything5")

        cy.contains("Submit").click()
    });

});