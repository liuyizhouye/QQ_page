// Configure the backend API endpoint (override these values in production).
window.QQStoryApi = window.QQStoryApi || {};

(function () {
  var host = (window.location && window.location.hostname) || '';
  var defaultBaseUrl = 'https://api.hanbaodoudou.com/api';
  
  // 只有明确是 localhost 或 127.x.x.x 时才使用本地 API
  if (host && /^(localhost|127(?:\.\d{1,3}){3})$/i.test(host)) {
    defaultBaseUrl = 'http://localhost:8080/api';
  }

  window.QQStoryApi.baseUrl = window.QQStoryApi.baseUrl || defaultBaseUrl;
  
  if (window.console && window.console.log && host && /^(localhost|127(?:\.\d{1,3}){3})$/i.test(host)) {
    console.log('[QQ Story API] 当前 API 地址:', window.QQStoryApi.baseUrl);
    console.log('[QQ Story API] 访问域名:', host || '(file:// 或未知)');
  }

  function clearLegacyStoredAdminKey() {
    try {
      window.sessionStorage.removeItem('qqStoryAdminKey');
      window.localStorage.removeItem('qqStoryAdminKey');
    } catch (error) {
      console.warn('Failed to clear legacy stored admin key.', error);
    }
  }

  // 管理员 key 只保留在当前页面内存中；如浏览器里有旧版本遗留值，启动时一并清掉。
  clearLegacyStoredAdminKey();
  window.QQStoryApi.adminKey = window.QQStoryApi.adminKey || '';

  window.QQStoryApi.setAdminKey = function setAdminKey(key, options) {
    var value = key || '';
    window.QQStoryApi.adminKey = value;
    clearLegacyStoredAdminKey();

    if (options && options.persist && options.persist !== 'memory' && window.console && window.console.warn) {
      console.warn('Admin key persistence is disabled; the key stays in memory only.');
    }
    return value;
  };

  window.QQStoryApi.clearStoredAdminKey = function clearStoredAdminKey() {
    window.QQStoryApi.adminKey = '';
    clearLegacyStoredAdminKey();
  };
})();
