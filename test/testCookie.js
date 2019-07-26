const Cookie = require("../lib/Cookie");

const assert = require('assert');

const UTC_STRING_RE = /Expires=([a-zA-Z]{3},\s\d{1,2}\s[a-zA-z]{3}\s\d{4}\s\d{1,2}:\d{1,2}:\d{1,2}\s[a-zA-Z]{3});/gi

describe('Cookie', function () {
  it('Instantiation', function () {
    let cookie = new Cookie();
  });
  it('SameSite Static Constants', function () {
    assert(Cookie.SS_LAX !== undefined);
    assert(Cookie.SS_STRICT !== undefined);
    assert(Cookie.SS_NONE !== undefined);
  });
  it('Expires', function () {
    let now = new Date();
    let cookie = new Cookie("name", "value");
    let dateStr = "Thu, 18 Jul 2019 01:54:23 GMT";
    assert(cookie.expires(dateStr).toString().indexOf(`Expires=${dateStr}`) !== -1);
  });
  it('Expire in Days', function () {
    let now = new Date();
    let cookie = new Cookie("name", "value");

    let cookieStr = cookie.expireInDays(1).toString();
    let expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000/60/60/24) === 1);

    cookieStr = cookie.expireInDays(365).toString();
    expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000/60/60/24) === 365);
  });
  it('Expire in Hours', function () {
    let now = new Date();
    let cookie = new Cookie("name", "value");

    let cookieStr = cookie.expireInHours(1).toString();
    let expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000/60/60) === 1);

    cookieStr = cookie.expireInHours(12).toString();
    expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000/60/60) === 12);
  });
  it('Expire in Minutes', function () {
    let now = new Date();
    let cookie = new Cookie("name", "value");

    let cookieStr = cookie.expireInMinutes(1).toString();
    let expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000/60) === 1);

    cookieStr = cookie.expireInMinutes(30).toString();
    expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000/60) === 30);
  });
  it('Expires in Seconds', function () {
    let now = new Date();
    let cookie = new Cookie("name", "value");

    let cookieStr = cookie.expireInSeconds(1).toString();
    let expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000) === 1);

    cookieStr = cookie.expireInSeconds(30).toString();
    expiresDate = new Date(new RegExp(UTC_STRING_RE).exec(cookieStr)[1]);
    assert(Math.ceil((expiresDate - now.getTime())/1000) === 30);
  });
  it('Basic name + value', function () {
    let cookie = new Cookie("some-name", "some-value");

    let cookieStr = cookie.toString();
    assert(cookieStr.indexOf("some-name") !== -1);
    assert(cookieStr.indexOf("some-value") !== -1);
  });
  it('Max-Age', function () {
    let cookie = new Cookie("some-name", "some-value");
    let maxAge = new Date().getTime() + (1000 * 60 * 5);
    let cookieStr = cookie.maxAge(maxAge).toString();

    assert(cookieStr.toLowerCase().indexOf(`max-age=${maxAge}`) !== -1);
  });
  it('Domain', function () {
    let cookie = new Cookie("some-name", "some-value");
    let domain = "mysite.com";
    let cookieStr = cookie.domain(domain).toString();

    assert(cookieStr.toLowerCase().indexOf(`domain=${domain}`) !== -1);
  });
  it('Path', function () {
    let cookie = new Cookie("some-name", "some-value");
    let path = "/private/images";
    let cookieStr = cookie.path(path).toString();

    assert(cookieStr.toLowerCase().indexOf(`path=${path}`) !== -1);
  });
  it('Secure', function () {
    let cookie = new Cookie("some-name", "some-value");

    assert(cookie.secure().toString().toLowerCase().indexOf("secure") !== -1);
  });
  it('HTTP Only', function () {
    let cookie = new Cookie("some-name", "some-value");

    assert(cookie.httpOnly().toString().toLowerCase().indexOf("httponly") !== -1);
  });
  it('SameSite', function () {
    let cookie = new Cookie("some-name", "some-value");

    assert(cookie.sameSite(Cookie.SS_STRICT).toString().toLowerCase().indexOf("samesite=strict") !== -1);
  });
  it('Secure Cookie Factory Function', function () {
    let cookieStr = Cookie.Secure("some-name", "some-value").toString().toLowerCase();

    assert(cookieStr.indexOf("path=/") !== -1);
    assert(cookieStr.indexOf("secure") !== -1);
    assert(cookieStr.indexOf("httponly") !== -1);
    assert(cookieStr.indexOf("samesite=strict") !== -1);
  });
});