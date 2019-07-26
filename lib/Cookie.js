const SECURE = 'Secure';
const HTTP_ONLY = 'HttpOnly';

const MS_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HR = 60;
const HR_IN_DAY = 24;

const now = () => {
  return new Date().getTime();
};

module.exports = class {
  static get SS_STRICT() { return "Strict"; }
  static get SS_LAX() { return "Lax"; }
  static get SS_NONE() { return "None"; }

  static Secure(name, value) {
    const Cookie = module.exports;
    return new Cookie(name, value)
                  .secure()
                  .httpOnly()
                  .path("/")
                  .sameSite(Cookie.SS_STRICT);
  }

  constructor(name, value) {
    this._name = name;
    this._value = value;
    this._expires = undefined;
    this._maxAge = undefined;
    this._domain = undefined;
    this._path = undefined;
    this._secure = undefined;
    this._httpOnly = undefined;
    this._sameSite = undefined;
  }

  expires(dateStr) {
    this._expires = dateStr;
    return this;
  }

  expireInDays(numDays) {
    this._expires = new Date(now() + (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HR * HR_IN_DAY * numDays)).toUTCString();
    return this;
  }

  expireInHours(numHours) {
    this._expires = new Date(now() + (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HR * numHours)).toUTCString();
    return this;
  }

  expireInMinutes(numMins) {
    this._expires = new Date(now() + (MS_IN_SEC * SEC_IN_MIN * numMins)).toUTCString();
    return this;
  }

  expireInSeconds(numSecs) {
    this._expires = new Date(now() + (MS_IN_SEC * numSecs)).toUTCString();
    return this;
  }

  maxAge(age) {
    this._maxAge = age;
    return this;
  }

  domain(domain) {
    this._domain = domain;
    return this;
  }

  path(path) {
    this._path = path;
    return this;
  }

  secure() {
    this._secure = SECURE;
    return this;
  }

  httpOnly() {
    this._httpOnly = HTTP_ONLY;
    return this;
  }

  sameSite(policy) {
    this._sameSite = policy;
    return this;
  }

  toString() {
    let cookieStr = `${this._name}=${this._value};`;

    if (this._expires) {
      cookieStr += ` Expires=${this._expires};`;
    }

    if (this._maxAge) {
      cookieStr += ` Max-Age=${this._maxAge};`;
    }

    if (this._domain) {
      cookieStr += ` Domain=${this._domain};`;
    }

    if (this._path) {
      cookieStr += ` Path=${this._path};`;
    }

    if (this._secure) {
      cookieStr += ` ${this._secure};`;
    }

    if (this._httpOnly) {
      cookieStr += ` ${this._httpOnly};`;
    }

    if (this._sameSite) {
      cookieStr += ` SameSite=${this._sameSite};`;
    }
    
    return cookieStr;
  }
};