(function (global) {
  // 缓存前缀，后面会拼接 shareId
  const cacheKeyPrefix = 'umami-share-cache-';
  const cacheTTL = 3600_000; // 1h

  function normalizeBaseUrl(baseUrl) {
    return String(baseUrl || '').replace(/\/+$/, '');
  }

  function getApiBaseCandidates(baseUrl) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const candidates = [normalizedBaseUrl];

    if (/cloud\.umami\.is$/i.test(new URL(normalizedBaseUrl).host)) {
      candidates.unshift(`${normalizedBaseUrl}/analytics/us`);
    }

    return [...new Set(candidates)];
  }

  async function fetchShareData(baseUrl, shareId) {
    const key = cacheKeyPrefix + shareId;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheTTL) {
          console.log('[Umami] Using cached token for', shareId);
          return parsed.value;
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
    console.log('[Umami] Fetching new token for', shareId);
    let lastError = null;

    for (const apiBaseUrl of getApiBaseCandidates(baseUrl)) {
      try {
        const res = await fetch(`${apiBaseUrl}/api/share/${shareId}`);
        if (!res.ok) {
          lastError = new Error(`获取 Umami 分享信息失败: ${res.status}`);
          continue;
        }

        const data = await res.json();
        const value = { ...data, apiBaseUrl };
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), value }));
        return value;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('获取 Umami 分享信息失败');
  }

  /**
   * 获取 Umami 分享数据（websiteId、token）
   * @param {string} baseUrl
   * @param {string} shareId
   * @returns {Promise<{websiteId: string, token: string}>}
   */
  global.getUmamiShareData = function (baseUrl, shareId) {
    if (!global.__umamiSharePromise) {
      global.__umamiSharePromise = fetchShareData(baseUrl, shareId).catch((err) => {
        delete global.__umamiSharePromise;
        throw err;
      });
    }
    return global.__umamiSharePromise;
  };

  global.clearUmamiShareCache = function (shareId) {
    const key = cacheKeyPrefix + shareId;
    localStorage.removeItem(key);
    // 兼容旧的 key
    localStorage.removeItem('umami-share-cache');
    delete global.__umamiSharePromise;
  };

  /**
   * 获取 Umami 统计数据
   * @param {string} baseUrl
   * @param {string} shareId
   * @param {object} queryParams
   * @returns {Promise<any>}
   */
  global.fetchUmamiStats = async function (baseUrl, shareId, queryParams) {
    async function doFetch(isRetry = false) {
      const { websiteId, token, apiBaseUrl } = await global.getUmamiShareData(baseUrl, shareId);
      const currentTimestamp = Date.now();
      
      // 构建参数，移除默认的 unit: 'hour'，只在 queryParams 没有指定时使用默认值
      const paramsObject = {
        startAt: 0,
        endAt: currentTimestamp,
        ...queryParams,
      };
      delete paramsObject.timezone;
      delete paramsObject.compare;
      const params = new URLSearchParams(paramsObject);
      
      const statsUrl = `${apiBaseUrl}/api/websites/${websiteId}/stats?${params.toString()}`;
      console.log('[Umami] Fetching stats:', statsUrl);
      
      const res = await fetch(statsUrl, {
        headers: {
          'x-umami-share-token': token
        }
      });

      if (!res.ok) {
        if (res.status === 401 && !isRetry) {
          console.warn('[Umami] Token expired or invalid, retrying...');
          global.clearUmamiShareCache(shareId);
          return doFetch(true);
        }
        throw new Error('获取统计数据失败: ' + res.status);
      }

      const json = await res.json();
      return json;
    }

    return doFetch();
  };

})(window);
