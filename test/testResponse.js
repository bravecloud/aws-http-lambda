const Response = require("../lib/Response");
const Cookie = require("../lib/Cookie");

const assert = require('assert');
describe('Response', function () {
  it('Instantiation', function () {
    let response = new Response();
  }); 
  it('Status Code', function () {
    let response = new Response();
    //default code
    assert(response.json().statusCode === 200);
    assert(response.status(302).json().statusCode === 302);
  }); 
  it('Headers', function () {
    let response = new Response();
    response
      .header("h1", "v1")
      .header("h2", "v2")
      .header("h3", "v3");
    let built = response.json();
    assert(built.headers["h1"] === "v1");
    assert(built.headers["h2"] === "v2");
    assert(built.headers["h3"] === "v3");
  });
  it('Headers - adding multiple headers', function () {
    let response = new Response();
    response
      .header("h1", "v1")
      .header("h2", "v2")
      .header("h3", "v3");
    response.headers({
      "h4": "v4",
      "h5": "v5"
    });
    let built = response.json();
    assert(built.headers["h1"] === "v1");
    assert(built.headers["h2"] === "v2");
    assert(built.headers["h3"] === "v3");
    assert(built.headers["h4"] === "v4");
    assert(built.headers["h5"] === "v5");
  });
  it('Multi Value Headers', function () {
    let response = new Response();
    response
      .multiValueHeader("h1", ["v1", "v2", "v3"])
      .multiValueHeader("h2", ["v4", "v5", "v6"])
      .multiValueHeader("h3", ["v7", "v8", "v9"]);
    let built = response.json();
    assert(built.multiValueHeaders["h1"].toString() === ["v1", "v2", "v3"].toString());
    assert(built.multiValueHeaders["h2"].toString() === ["v4", "v5", "v6"].toString());
    assert(built.multiValueHeaders["h3"].toString() === ["v7", "v8", "v9"].toString());
  });
  it('Body', function () {
    let response = new Response();
    let jsonBody = {
      "users": [
        {
          "id": 1,   
          "username": "Alice"
        },
        {
          "id": 2,   
          "username": "Body"
        }
      ]
    };
    response.body(jsonBody);
    let built = response.json();
    assert(built.body === JSON.stringify(jsonBody));
    
    let strBody = "Some string message for the body";
    response.body(strBody);
    built = response.json();
    assert(built.body === strBody);

    let numBody= 12345;
    response.body(numBody);
    built = response.json();
    assert(built.body === numBody);
  });
  it('Cookie(s)', function () {
    let response = new Response();
    response.cookie(new Cookie("c1", "v1"));
    let setCookieKey = Object.keys(response.json().multiValueHeaders).filter(key => key.toLowerCase() === "set-cookie")[0];
    assert(setCookieKey);
    assert(response.json().multiValueHeaders[setCookieKey][0] === 'c1=v1;')

    response.cookie(new Cookie("c2", "v2"));
    response.cookie(new Cookie("c3", "v3"));
    response.cookies([
      new Cookie("c4", "v4"),
      new Cookie("c5", "v5"),
      new Cookie("c6", "v6")
    ]);

    let allCookies = response.json().multiValueHeaders[setCookieKey].reduce((acc, curr) => {
      return acc + curr;
    });
    for (let i = 1; i < response.json().multiValueHeaders[setCookieKey].length; i++) {
      let expectedCookie = `c${i}=v${i}`;
      assert(allCookies.indexOf(expectedCookie) !== -1, `missing cookie ${expectedCookie}`);
    }
  });
  it('Cookies added after existing multiheader', function () {
    let response = new Response();
    response.multiValueHeader("Set-Cookie", ["c1=v1;"]);
    response.cookie(new Cookie("c2", "v2"));
    response.cookies([
      new Cookie("c3", "v3"),
      new Cookie("c4", "v4"),
    ]);

    let setCookieKey = Object.keys(response.json().multiValueHeaders).filter(key => key.toLowerCase() === "set-cookie")[0];
    let allCookies = response.json().multiValueHeaders[setCookieKey].reduce((acc, curr) => {
      return acc + curr;
    });

    for (let i = 1; i < response.json().multiValueHeaders[setCookieKey].length; i++) {
      let expectedCookie = `c${i}=v${i}`;
      assert(allCookies.indexOf(expectedCookie) !== -1, `missing cookie ${expectedCookie}`);
    }
  });
  it('isBase64Encoded', function () {
    let response = new Response();
    let json = response.base64().json();
    assert(json.isBase64Encoded);
  });
});