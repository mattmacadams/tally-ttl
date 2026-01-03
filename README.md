## Simple tally tracker with individual TTL per tally (sliding window tally)

Useful for tracking how many events have occurred in a recent window of time, such as rate limiting in a customizable sliding window of time.

Each individual tally has its own TTL (Time-to-Live, aka expiration), rounded to 1 second increments. In other words, we're not just counting tallies - we're tracking when they occurred so we can expire each tally individually.

Contains both CommonJS and ESM modules. Written in Typescript, with types included.

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
Example: Set a default TTL for each tally to 1 minute (60 seconds).
After 60 seconds the each tally will expire.
*/
const userActionTally = new TallyTTL({ defaultTtl: 60 });

// in this case, we want to track how many times a user has failed to login
userActionTally.tally("bob-login-failed");
userActionTally.tally("bob-login-failed");
// wait 10 seconds
userActionTally.tally("bob-login-failed");

let bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 3

// wait 50 seconds for the first two tallies to expire...

bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 1

// wait 10 seconds for the last tally to expire...

bobLoginFailedCount = userActionTally.get("bob-login-failed");
// bobLoginFailedCount would be 0
```

```javascript
// You can also override the defaultTtl for an individual tally

// Example: this particular tally would persisit for 15 minutes (900 seconds).
userActionTally.tally("bob-login-failed", 900);
```
