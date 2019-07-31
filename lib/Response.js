const SET_COOKIE = "Set-Cookie";

module.exports = class {
  constructor() {
    this._status = 200;
    this._base64 = undefined;
    this._headers = {};
    this._multiValueHeaders = {};
    this._cookies = [];
    this._body = undefined;
  }

  status(code) {
    this._status = code;
    return this;
  }

  header(name, value) {
    this._headers[name] = value;
    return this;
  }

  headers(headers) {
    this._headers = Object.assign(headers, this._headers);
    return this;
  }

  multiValueHeader(name, values) {
    this._multiValueHeaders[name] = values;
    return this;
  }

  body(value) {
    this._body = value;
    return this;
  }

  cookie(cookie) {
    this._cookies.push(cookie);
    return this;
  }

  cookies(cookies) {
    this._cookies.push(...cookies);
    return this;
  }

  base64() {
    this._base64 = true;
    return this;
  }

  json() {
    //initialize with mandatory values
    let response = {
      statusCode: this._status
    };

    if (this._base64) {
      response.isBase64Encoded = true;
    }

    if (Object.keys(this._headers).length) {
      response.headers = Object.assign({}, this._headers);
    }

    if (Object.keys(this._multiValueHeaders).length) {
      response.multiValueHeaders = {};
      //Can't use Object.assign due to shallow copy limitation, so manually copy key and arrays
      Object.keys(this._multiValueHeaders).forEach(key => {
        response.multiValueHeaders[key] = this._multiValueHeaders[key].slice(0);
      });
    }

    if (this._cookies.length) {
      //Since cookies can manually be set via set-cookie, it's important to check if the header key
      //already exists.
      let setCookieKey = Object.keys(this._multiValueHeaders).filter(key => key.toLowerCase() === SET_COOKIE.toLowerCase());
      //If it already exists, append the cookie values to the multi header value array
      if (setCookieKey.length) {
        response.multiValueHeaders[setCookieKey[0]].push(...this._cookies.map(cookie => cookie.toString()));
      }
      //Otherwise 
      else {
        response.multiValueHeaders = {
          [SET_COOKIE]: this._cookies.map(cookie => cookie.toString())
        };
      }
    }

    if (this._body) {
      response.body = (typeof(this._body) === 'object') ? JSON.stringify(this._body) : this._body;
    }

    return response;
  }
};