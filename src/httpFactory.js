export default (config, fetch) => {
  const apiBase = `${config.protocol}://${config.hostname}:${config.port}`;

  const performFetch = (route, options) => fetch(apiBase + route, options)
    .then(response => response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(new Error(`HTTP Error: ${response.status}. ${json.message}`));
      }
      return json;
    }));

  const jsonHeaders = {
    'Content-Type': 'application/json',
  };

  return {
    get: route => performFetch(route, { method: 'GET' }),
    post: (route, data) => performFetch(route, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
    put: (route, data) => performFetch(route, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
    patch: (route, data) => performFetch(route, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
    delete: (route, data) => {
      const options = { method: 'DELETE' };
      if (data) {
        options.headers = jsonHeaders;
        options.body = JSON.stringify(data);
      }
      return performFetch(route, options);
    },
  };
};
