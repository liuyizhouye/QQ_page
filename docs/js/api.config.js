// Configure the backend API endpoint (override these values in production).
window.QQStoryApi = window.QQStoryApi || {};

(function () {
  var host = (window.location && window.location.hostname) || '';
  // 临时使用 ECS 的 API（注意：HTTPS 网站访问 HTTP API 会有混合内容警告）
  var defaultBaseUrl = 'http://47.115.72.187:8080/api';
  if (!host || /^(localhost|127(?:\.\d{1,3}){3})$/i.test(host)) {
    defaultBaseUrl = 'http://47.115.72.187:8080/api';
  }

  window.QQStoryApi.baseUrl = window.QQStoryApi.baseUrl || defaultBaseUrl;

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

    var persist = (options && options.persist) || 'session';
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
