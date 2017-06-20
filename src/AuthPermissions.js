class AuthPermissions {
  constructor() {
    this.permissionStore = {};
  }

  /**
   * Check permissions by "except" and/or "only" rules
   * @param {Object|Array<string>|string} permissions - "admin", ["admin"], {only:"admin"}, {only: ["admin"]}
   * @param {Array<string>|string} [permissions.except]
   * @param {Array<string>|string} [permissions.only]
   * @returns {boolean}
     */
  validate(permissions) {
    if (!permissions) {
      throw new TypeError('Parameter "permissions" not provided');
    }

    // validate permissions like "admin" or [ "admin" ]
    if (typeof permissions === "string" || Array.isArray(permissions)) {
      // Check if any of "only" permissions valid
      return this._validatePermissionsAny(permissions);
    }

    // check if permissions object is valid
    if (!permissions.except && !permissions.only) {
      throw new TypeError(
        'Parameter "permissions.except" or/and "permissions.only" not provided'
      );
    }

    // validate permissions like { except: ["anonymous"], only: ["editor"] }
    // if permissions rules provided
    // check if all rules valid
    return (
      // except rules is opposite to "any" rules,
      // so use opposite to "any" validation
      (!permissions.except ||
        !this._validatePermissionsAny(permissions.except)) &&
      // Check if any of "only" permissions valid
      (!permissions.only || this._validatePermissionsAny(permissions.only))
    );
  }

  /**
   * Define validation rules for permission list
   * @param {Array<string>} permissionNames
   * @param {Function} validationFunction
     */
  defineMany(permissionNames, validationFunction) {
    if (!Array.isArray(permissionNames)) {
      throw new TypeError('Parameter "permissionNames" name must be Array');
    }

    permissionNames.forEach(permissionName => {
      this.define(permissionName, validationFunction);
    });
  }

  /**
   * Define validation rules for permission
   * @param {string} permissionName
   * @param {Function} validationFunction
     */
  define(permissionName, validationFunction) {
    this.permissionStore[permissionName] = validationFunction;
  }

  /**
   * Check if any permissions valid
   * @param {Array<string>|string} permissionNames
   * @returns {boolean}
   * @private
   */
  _validatePermissionsAny(permissionNames) {
    if (typeof permissionNames === "string") {
      return this._validatePermission(permissionNames);
    }

    // if any of permissions validated, return true
    return permissionNames.some(p => this._validatePermission(p));
  }

  /**
   * Check if permission defined and valid
   * @param {string} permissionName
   * @returns {boolean}
   * @private
     */
  _validatePermission(permissionName) {
    const validationFunction = this.permissionStore[permissionName];

    if (!validationFunction) {
      console.warn(
        `validationFunction for permission ${permissionName} not defined.`
      );
      console.info(
        `use authPermissions.define to define validationFunction for permission ${permissionName}.`
      );
    }

    return !!(validationFunction && validationFunction(permissionName));
  }
}

export default AuthPermissions;
