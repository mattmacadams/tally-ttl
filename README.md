## Simple tally tracker with individual TTL per tally (sliding window tally)

Useful for tracking how many events have occurred in a recent window of time, such as rate limiting in a customizable sliding window of time.

Each individual tally has its own TTL (Time-to-Live, aka expiration), rounded to 1 second increments. In other words, we're not just counting tallies - we're tracking when they occurred so we can expire each tally individually.

- Tracking is in-memory only, there is no persisitent storage option at this time.
- Contains both CommonJS and ESM modules.
- Source was written in Typescript, with types included.
- Source code is available on Github

There is a built-in cleanup function to delete expired tallies. By default it runs every 60 seconds, which should be suitable for most use cases. If you have a reason to change the interval, simply add an arg to the config: `new TallyTTL({ cleanupSeconds: 900 })`. Setting a long or shorter cleanup period does not affect the results. A shorter clean up window could slightly improve counting performance in some cases by removing expired items from memory more quickly. If you want to specify this, try starting with something close to the defaultTtl value.

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
Example: Set defaultTtl to set the default TTL for each tally. After 300 seconds the each tally will expire.
*/
const userActionTally = new TallyTTL({ defaultTtl: 300 });

// in this case, we want to track how many times a user has failed to login
userActionTally.tally("user1234-login-failed");
userActionTally.tally("user1234-login-failed");
// wait 30 seconds
userActionTally.tally("user1234-login-failed");

let bobLoginFailedCount = userActionTally.get("user1234-login-failed");
// bobLoginFailedCount would now be 3

// wait 300 seconds for the first two tallies to expire...

bobLoginFailedCount = userActionTally.get("user1234-login-failed");
// bobLoginFailedCount would now be 1

// wait 30 seconds for that last tally to expire...

bobLoginFailedCount = userActionTally.get("user1234-login-failed");
// bobLoginFailedCount would be 0
```

```javascript
/*
You can also override the defaultTtl for an individual tally.
*/

// Example: this particular tally would persisit for 15 minutes (900 seconds) rather than the value of defaultTtl.
userActionTally.tally("bob-login-failed", 900);
```
