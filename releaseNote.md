

# Release Notes - [Version 2.12]

## Overview

In this release, we've implemented several updates and enhancements to improve functionality and compatibility in the project. Please review the following changes and take note of important considerations:

### 1. Removal of Deprecated Packages

The `mrest:restivus` package has been removed from the project due to its lack of support and incompatibility with the latest Meteor version. This removal ensures a streamlined and up-to-date environment for your project.

### 2. Python 2 Compatibility

For optimal performance, we recommend using Python 2 with this project. Please ensure your Python environment is set to version 2 to ensure compatibility and a seamless operation.

### 3. Elimination of Unsupported Package

We have removed the `cultofcoders:persistent-session` package from the project as it is no longer supported and compatible with the latest Meteor version. This step guarantees that the project remains compatible and well-maintained.

### 4. Handling of Role 'admin'

An important update relates to the handling of the 'admin' role. During the account creation process, you might encounter an error message: "Exception while invoking method 'account.check': Error: Role 'admin' does not exist." This error is attributed to a change in the `alanning:roles` package, which no longer supports the 'admin' role by default.

## Action Required

To ensure a smooth transition and optimal performance after this update, please take the following actions:

1. **Remove Deprecated Packages**: Remove the `mrest:restivus` and `cultofcoders:persistent-session` packages from your project to prevent compatibility issues.

2. **Python Environment**: Confirm that your Python environment is configured for Python 2 to ensure seamless compatibility.

3. **Update 'admin' Role**: Address any occurrences of the 'admin' role in your project by referring to the updated documentation or by adjusting role assignments accordingly.

## Additional Changes and Explanations

### Commented Line in `account.js`

I have commented line 22 of `imports/api/accounts/account.js` due to the error: "TypeError: Cannot read property 'Email' of undefined."

### Commented Line in `register-api.js`

I have commented the line below in `imports/startup/server/register-api.js` due to the removal of the `mrest:restivus` package. (See point 1 in the Release Notes.)

### `--allow-incompatible-update` Flag

I have added the `--allow-incompatible-update` flag to the `npm start` command to handle compatibility issues effectively.

