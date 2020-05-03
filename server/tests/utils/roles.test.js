const roles = require('../../utils/roles');

describe("Roles", () => {
  it("Should have set a role to everyone.", () => {
    const generatedRoles = roles.generateRoles(5)

    expect(generatedRoles.length).toEqual(5);
  });
});