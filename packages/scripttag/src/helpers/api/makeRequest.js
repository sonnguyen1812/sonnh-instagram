// packages/scripttag/src/helpers/api/makeRequest.js
/**
 * Wrap XHR in promise
 *
 * @param url
 * @param method
 * @param data
 * @param options
 * @returns {Promise<unknown>}
 */
function makeRequest(url, method, data = null, options = {}) {
  // Create the XHR request
  const request = new XMLHttpRequest();

  // Return it as a Promise
  return new Promise(function(resolve, reject) {
    // Setup our listener to process completed requests
    request.onreadystatechange = function() {
      // Only run if the request is complete
      if (request.readyState !== 4) return;

      // Check status và responseText
      if (request.status >= 200 && request.status < 300 && request.responseText) {
        try {
          const response = JSON.parse(request.responseText);
          console.log('makeRequest response:', response);
          resolve(response);
        } catch (error) {
          console.error('makeRequest parse error:', error);
          reject(error);
        }
      } else {
        const error = new Error(`Request failed with status ${request.status}`);
        console.error('makeRequest error:', error);
        reject(error);
      }
    };

    // Enable CORS
    request.withCredentials = false; // Set false to allow CORS

    // Setup HTTP request
    request.open(method || 'GET', url, true);

    // Add CORS headers
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Send the request
    if (data) {
      const contentType = options.contentType || 'application/json;charset=UTF-8';
      request.setRequestHeader('Content-Type', contentType);
      request.send(JSON.stringify(data));
    } else {
      request.send();
    }
  });
}

export default makeRequest;
