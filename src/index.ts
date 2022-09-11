import type { RedisClientType } from "redis";

export default (redisClient: RedisClientType) => {
  const checkIsNewest = async (options: {
    list: string;
    item: string;
    limit?: number;
    isFirstLoop?: boolean;
  }) => {
    const isListExist = options.isFirstLoop
      ? Number(await redisClient.exists(options.list)) !== 0
      : false;

    if (options.isFirstLoop && !isListExist) {
      await redisClient.lPush(options.list, options.item);
      return true;
    }

    const lastUploadedIndex = await redisClient.lPos(
      options.list,
      options.item
    );
    if (lastUploadedIndex !== null) return false;

    await redisClient.lPush(options.list, options.item);

    if (options.limit)
      await redisClient.lTrim(options.list, 0, options.limit - 1);

    return true;
  };

  const isCacheHit = async (key: string) => {
    const isExist = Number(await redisClient.exists(key)) !== 0;
    return isExist;
  };

  const getCache = async (key: string) => {
    const data = await redisClient.get(key);
    return data;
  };

  const setCache = async (options?: {
    key: string;
    value: string;
    ttl: number;
  }) => {
    const { key, value, ttl } = options || {};
    await redisClient.set(key, value, {
      EX: ttl,
    });
  };

  const invalidateCache = async (key: string) => {
    await redisClient.del(key);
  };

  const setHashCache = async (options?: {
    key: string;
    field: string;
    value: string;
  }) => {
    const { key, field, value } = options || {};
    await redisClient.hSet(key, field, value);
  };

  const getHashCache = async (options?: { key: string; field: string }) => {
    const { key, field } = options || {};
    const data = await redisClient.hGet(key, field);
    return data;
  };

  const invalidateHashCache = async (options?: {
    key: string;
    field: string;
  }) => {
    const { key, field } = options || {};
    await redisClient.hDel(key, field);
  };

  const invalidateAllHashCache = async (key: string) => {
    await redisClient.del(key);
  };

  const isHashCacheHit = async (options?: { key: string; field: string }) => {
    const { key, field } = options || {};
    const isExist = Number(await redisClient.hExists(key, field)) !== 0;
    return isExist;
  };

  const setHashCacheExpire = async (options?: { key: string; ttl: number }) => {
    const { key, ttl } = options || {};
    await redisClient.expire(key, ttl);
  };

  return {
    checkIsNewest,
    isCacheHit,
    isHashCacheHit,
    getCache,
    setCache,
    invalidateCache,
    setHashCache,
    getHashCache,
    invalidateHashCache,
    invalidateAllHashCache,
    setHashCacheExpire,
  };
};
