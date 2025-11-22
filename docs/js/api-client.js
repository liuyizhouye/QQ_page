(function (window) {
  'use strict';

  var config = window.QQStoryApi || {};

  function getBaseUrl() {
    var base = config.baseUrl || '';
    if (!base) {
      base = window.location.origin + '/api';
    }
    return base.replace(/\/$/, '');
  }

  function buildUrl(path, query) {
    var url = getBaseUrl() + path;
    if (query && typeof query === 'object') {
      var params = Object.keys(query)
        .filter(function (key) {
          return query[key] !== undefined && query[key] !== null && query[key] !== '';
        })
        .map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
        });
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
    }
    return url;
  }

  function jsonRequest(path, options) {
    options = options || {};
    var headers = options.headers || {};
    headers.Accept = 'application/json';
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    if (options.auth && config.adminKey) {
      headers['x-api-key'] = config.adminKey;
    }
    // 对于 GET 请求，禁用缓存以确保获取最新数据
    var method = (options.method || 'GET').toUpperCase();
    var addTimestamp = false;
    if (method === 'GET') {
      if (options.cache === undefined) {
        options.cache = 'no-cache';
      }
      // 对于所有数据相关的 GET 请求，添加时间戳参数以确保绕过缓存
      // 包括 comments, moments, milestones, letters
      if (path.indexOf('/comments') !== -1 || 
          path.indexOf('/moments') !== -1 || 
          path.indexOf('/milestones') !== -1 || 
          path.indexOf('/letters') !== -1) {
        addTimestamp = true;
      }
    }
    // 如果 path 是完整 URL，需要解析并添加时间戳
    var finalPath = path;
    if (addTimestamp) {
      // 添加时间戳参数以确保绕过缓存
      var separator = path.indexOf('?') === -1 ? '?' : '&';
      finalPath = path + separator + '_t=' + encodeURIComponent(Date.now());
    }
    return fetch(finalPath, Object.assign({}, options, { headers: headers }))
      .then(handleResponse)
      .catch(function (error) {
        console.error('API request failed', error);
        throw error;
      });
  }

  function handleResponse(response) {
    if (!response.ok) {
      return response.json().catch(function () {
        return {};
      }).then(function (payload) {
        var message = payload && payload.error ? payload.error : ('HTTP ' + response.status);
        var err = new Error(message);
        err.status = response.status;
        err.payload = payload;
        throw err;
      });
    }
    return response.json().catch(function () {
      return {};
    });
  }

  var apiClient = {
    setAdminKey: function (key) {
      config.adminKey = key || '';
    },
    getMilestones: function () {
      return jsonRequest(buildUrl('/milestones'));
    },
    createMilestone: function (payload) {
      return jsonRequest(buildUrl('/milestones'), { method: 'POST', body: payload, auth: true });
    },
    updateMilestone: function (id, payload) {
      return jsonRequest(buildUrl('/milestones/' + encodeURIComponent(id)), { method: 'PUT', body: payload, auth: true });
    },
    deleteMilestone: function (id) {
      return jsonRequest(buildUrl('/milestones/' + encodeURIComponent(id)), { method: 'DELETE', auth: true });
    },
    getMoments: function () {
      return jsonRequest(buildUrl('/moments'));
    },
    createMoment: function (payload) {
      return jsonRequest(buildUrl('/moments'), { method: 'POST', body: payload, auth: true });
    },
    updateMoment: function (id, payload) {
      return jsonRequest(buildUrl('/moments/' + encodeURIComponent(id)), { method: 'PUT', body: payload, auth: true });
    },
    deleteMoment: function (id) {
      return jsonRequest(buildUrl('/moments/' + encodeURIComponent(id)), { method: 'DELETE', auth: true });
    },
    getComments: function (params, options) {
      var opts = options || {};
      return jsonRequest(buildUrl('/comments', params || {}), { auth: opts.auth });
    },
    createComment: function (payload) {
      return jsonRequest(buildUrl('/comments'), { method: 'POST', body: payload });
    },
    deleteComment: function (id) {
      return jsonRequest(buildUrl('/comments/' + encodeURIComponent(id)), { method: 'DELETE', auth: true });
    },
    hideComment: function (id) {
      return jsonRequest(buildUrl('/comments/' + encodeURIComponent(id) + '/hide'), { method: 'POST', auth: true });
    },
    getLoveNotes: function (params) {
      return jsonRequest(buildUrl('/letters', params || {}));
    },
    createLoveNote: function (payload) {
      return jsonRequest(buildUrl('/letters'), { method: 'POST', body: payload, auth: true });
    },
    deleteLoveNote: function (id) {
      return jsonRequest(buildUrl('/letters/' + encodeURIComponent(id)), { method: 'DELETE', auth: true });
    }
  };

  window.QQStoryApiClient = apiClient;
})(window);
