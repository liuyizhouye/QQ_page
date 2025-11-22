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
  
  // 调试信息：显示当前使用的 API 地址
  if (window.console && window.console.log) {
    console.log('[QQ Story API] 当前 API 地址:', window.QQStoryApi.baseUrl);
    console.log('[QQ Story API] 访问域名:', host || '(file:// 或未知)');
  }

  var storedKey = '';
  try {
    storedKey =
      window.sessionStorage.getItem('qqStoryAdminKey') ||
      window.localStorage.getItem('qqStoryAdminKey') ||
      '';
  } catch (error) {
    storedKey = '';
  }
  if (!window.QQStoryApi.adminKey && storedKey) {
    window.QQStoryApi.adminKey = storedKey;
  } else {
    window.QQStoryApi.adminKey = window.QQStoryApi.adminKey || '';
  }

  window.QQStoryApi.setAdminKey = function setAdminKey(key, options) {
    var value = key || '';
    window.QQStoryApi.adminKey = value;

    var persist = (options && options.persist) || 'local';
    try {
      if (persist === 'local') {
        if (value) {
          window.localStorage.setItem('qqStoryAdminKey', value);
        } else {
          window.localStorage.removeItem('qqStoryAdminKey');
        }
        window.sessionStorage.removeItem('qqStoryAdminKey');
      } else if (persist === 'memory') {
        window.sessionStorage.removeItem('qqStoryAdminKey');
        window.localStorage.removeItem('qqStoryAdminKey');
      } else {
        if (value) {
          window.sessionStorage.setItem('qqStoryAdminKey', value);
        } else {
          window.sessionStorage.removeItem('qqStoryAdminKey');
        }
        if (persist !== 'session') {
          window.localStorage.removeItem('qqStoryAdminKey');
        }
      }
    } catch (error) {
      console.warn('Failed to persist admin key locally.', error);
    }
    return value;
  };

  window.QQStoryApi.clearStoredAdminKey = function clearStoredAdminKey() {
    window.QQStoryApi.adminKey = '';
    try {
      window.sessionStorage.removeItem('qqStoryAdminKey');
      window.localStorage.removeItem('qqStoryAdminKey');
    } catch (error) {
      console.warn('Failed to clear stored admin key.', error);
    }
  };
})();
