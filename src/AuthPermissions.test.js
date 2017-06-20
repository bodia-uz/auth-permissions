import AuthPermissions from "./AuthPermissions";

describe("Auth permissions service", () => {
  let authPermissions;

  beforeEach(function() {
    authPermissions = new AuthPermissions();
  });

  it("should be possible to define one permission with function", () => {
    const validator1 = () => true;
    const validator2 = () => false;

    authPermissions.define("admin", validator1);
    expect(Object.keys(authPermissions.permissionStore).length).toBe(1);
    expect(authPermissions.permissionStore["admin"]).toBe(validator1);

    authPermissions.define("operator", validator2);
    expect(Object.keys(authPermissions.permissionStore).length).toBe(2);
    expect(authPermissions.permissionStore["operator"]).toBe(validator2);
  });

  it("should be possible to define many permissions", () => {
    const validator = () => true;

    authPermissions.defineMany(["admin", "operator"], validator);

    expect(Object.keys(authPermissions.permissionStore).length).toBe(2);
    expect(authPermissions.permissionStore["admin"]).toBe(validator);
    expect(authPermissions.permissionStore["operator"]).toBe(validator);
  });

  describe("validate method", () => {
    it("should throw error if permissions parameter is invalid", () => {
      expect(() => authPermissions.validate()).toThrow();
      // permission parameter is object, but key 'except' or 'only' is not provided
      expect(() => authPermissions.validate({})).toThrow();
    });

    it("should validate array of permissions", () => {
      const validator = () => false;

      authPermissions.defineMany(["operator1", "operator2"], validator);
      expect(authPermissions.validate(["operator1", "operator2"])).toBeFalsy();
    });

    it("should validate by except / only fields", () => {
      authPermissions.defineMany(["admin", "operator"], () => true);
      authPermissions.define("creator", () => false);

      expect(authPermissions.validate({ only: "operator" })).toBeTruthy();
      expect(authPermissions.validate({ except: "operator" })).toBeFalsy();
      expect(
        authPermissions.validate({ only: "operator", except: "operator" })
      ).toBeFalsy();
      expect(
        authPermissions.validate({
          only: ["admin", "operator"],
          except: ["creator"]
        })
      ).toBeTruthy();
      expect(authPermissions.validate({ only: "creator" })).toBeFalsy();
      expect(
        authPermissions.validate({ only: ["creator", "admin"] })
      ).toBeTruthy();
    });
  });
});
