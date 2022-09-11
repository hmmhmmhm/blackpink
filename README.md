# 🦄 BLACKPINK

> A Simple Redis Utility Function

```bash
npm install blackpink
npm install redis
```

# Check is newest list item

> This function allows you to use Redis to check that the data is up to date. It also allows you to check the maximum number.

```ts
import * as redis from "redis";
import blackpink from "blackpink";

const client = redis.createClient({});
const pink = blackpink(client);

void (async () => {
  const list = ["a1.png", "a2.png", "a3.png"];
  let isFirstLoop = true;

  for (const item of list) {
    const isNewest = await pink.checkIsNewest({
      list: "community-meme",
      item,
      isFirstLoop,
      limit: 300,
    });

    if (isFirstLoop) isFirstLoop = false;

    if (isNewest) {
      console.log("new meme", item);
      break;
    } else {
      console.log("old meme", item);
    }
  }
})();
```

# Cache single item

```ts
import * as redis from "redis";
import blackpink from ".blackpink";

const client = redis.createClient({});
const pink = blackpink(client);

void (async () => {
  // Set cache
  await pink.setCache({
    key: "test",
    value: "test",
    // 7days
    ttl: 60 * 60 * 24 * 7,
  });

  // Get cache
  const data = await pink.getCache("test");
  console.log(data);

   // Check cache hit
  const isHit = await pink.isCacheHit("test")
  console.log(isHit);

  // Invalidate cache
  await pink.invalidateCache("test");
})();
```

# Cache map item
```ts
import * as redis from "redis";
import blackpink from ".blackpink";

const client = redis.createClient({});
const pink = blackpink(client);

void (async () => {
  // Set hash cache
  await pink.setHashCache({
    key: "test",
    field: "test",
    value: "test",
  });

  // Get hash cache
  const data = await pink.getHashCache({
    key: "test",
    field: "test",
  });

  // Check hash cache hit
  await pink.isHashCacheHit({
    key: "test",
    field: "test",
  });

  // Invalidate hash cache
  await pink.invalidateHashCache({
    key: "test",
    field: "test",
  });

  // Invalidate all hash cache
  await pink.invalidateAllHashCache("test");
})();
```

## License

> MIT Licensed