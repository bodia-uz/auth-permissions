
# Install
```
npm install auth-permissions —save
```

# Create permissions store
```js
import AuthPermissions from 'auth-permissions';

const authPermissions = new AuthPermissions();
```

# Define permissions
```js
authPermissions.define('anonymous', () => !authService.isAuthenticated());
authPermissions.define('events.remove', () => authService.hasPermission('events.remove'));

authPermissions.defineMany(['events.remove', 'events.add', 'events.change'], 
  permissionName => authService.hasPermission(permissionName)
);
```

# Check permissions
```js
function removeEvent(event) {
  if (!authPermissions.validate('events.remove')) {
    return;
  }
  
  eventsService.remove(event);
}
```
