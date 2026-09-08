// Smoke test - confirms the Jest + jest-expo baseline actually runs.
// Replace/extend once real utils land (see docs/plans/initial-scaffolding.md).
describe("jest baseline", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
