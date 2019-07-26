module.exports = {
  'strict-transport-security': 'max-age=63072000; includeSubdomains; preload',
  'content-security-policy': "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-xss-protection': '1; mode=block',
  'referrer-policy': 'same-origin'
};
