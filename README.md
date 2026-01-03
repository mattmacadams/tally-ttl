## Simple tally tracker with individual TTL per tally (sliding window tally)

Useful for tracking how many events have occurred in a recent window of time.

Each tally has it's own TTL (Time-to-Live, aka expiration), rounded to 1 second increments.

Contains both CommonJS and ESM modules for counting items.

Typescript types included

There is a built-in cleanup function to delete expired tallies. By default it runs every 60 seconds, but can be configured to run at any interval `new TallyTTL({ cleanupSeconds: 900 })`. Setting a long or shorter cleanup period does not affect the results. A shorter clean up window could slightly improve performance in some cases. If you want to specify this, try starting with something close to the defaultTtl value.

**Installation**

```
npm install tally-ttl
```

**Usage Examples**

```javascript
// For ESM use
import TallyTTL from "tally-ttl";

// OR, for CommonJS use
const TallyTTL = require("tally-ttl");
```

```javascript
/*
Example: Set a default TTL for each tally to 1 minute (60 seconds).  After
this time the tally will expire and will not be counted.
*/
const userActionTally = new TallyTTL({ defaultTtl: 60 });

// in this case, we want to track how many times a user has failed to login
userActionTally.tally("bob-login-failed");
userActionTally.tally("bob-login-failed");

let bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 2

// wait 1 second or more...

/*
Each call to tally() gets it's own expiration time, so calling it again here would
last 60 seconds (the defaultTtl) from this current time
*/
// add another one
userActionTally.tally("bob-login-failed");

bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 3

// wait 60 seconds (which is the defaultTtl)...

bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 1 since the first two have already expired

// wait a second...

// out third call has now expired as well
bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 0
```

```javascript
// You can also override the defaultTtl for an individual tally
// Example: this particular tally would persisit for 15 minutes (900 seconds).
// When the second argument is undefined, the defaultTtl is used
userActionTally.tally("bob-login-failed", 900);
```
