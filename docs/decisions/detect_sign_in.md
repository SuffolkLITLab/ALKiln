# Use response data to detect sign-in success

## Context and Problem Statement

What is a robust way to detect whether signing in worked or not?

## Considered Options

- Elements in the DOM.
  - Use some class or ID that only the sign-in page has, so we can detect that a user is on a new page and succeeded.
  - User-facing invalidation message elements in the DOM on failure.
- URL change.
- Response data.

## Decision Outcome

Use a change in the URL to detect sign-in navigation.

## Pros and Cons of the Options

### DOM

Pros:

- It can be easy to do with the tools we are using.

Cons:

- The DOM can, and has been, changed by docassemble and these kinds of changes are made pretty quietly so we find it hard to keep track of them.
- It is pretty easy for site developers to change the HTML of standard pages like the sign-in page.

### URL change

Pros:

- It seems very likely that developers will keep an unsuccessful sign-in on the same page, even if they change some other functionality.
- It seems very likely that developers will change the url when the sign-in succeeds.
- Sticking with checking the url would mesh with how we currently detecting page navigation. See the cons for issues with that.

Cons:

- It seems precarious, though I haven't yet been able to articulate why. I know it hasn't been a sufficient full solution in the past for interview pages. For example, in a `show if` infinite page loop.
- Developers can manipulate a page's url, though it seems unlikely in this situation.

### Response data

Use the response data from the sign in request.

Pros:

- It seems reliable - it seems very likely that developers will re-direct their users to a different page, even if they change some other functionality.
- Less likely to change than the DOM.
- Has some standard values we can expect, like status codes.

Cons:

- DA's responses are not typical. There's no 400's in unsuccessful responses.
- Regular interview page navigation doesn't get a 302, so this method would be a special case for signing in.

Options are:

- 302 redirection status. It seems fairly reliable that a developer will send a user to a different page after they sign in, and also likely that they will keep the user on the same page if the sign-in failed.
- Cache-Control header value that contains "must-revalidate" (See [MDN cache control directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#directives)). It makes sure this data isn't cached. I'm not familiar with this and I'm not sure what might or might not trigger this.
- Cookie with the name "secret". This seems promising, but I don't know much about cookies.

Based on our current knowledge, we think the 302 status response will be most reliable.

Notes for response data:

I have isolated the differences between the sign-in success and failure responses.

Key for following entries:

```
<key of object containing the data>
  🌈 <sign in success data>
vs
  🤕 <sign in failure data>
```

Findings:

```
response
  🌈 "redirectURL": "/path", "headersSize": 552, "bodySize": 0, "_transferSize": 552,
vs
  🤕 "redirectURL": "", "headersSize": 570, "bodySize": 1998, "_transferSize": 2568,
---
response
  🌈 "status": 302, "statusText": "FOUND",
vs
  🤕 "status": 200, "statusText": "OK",

---
headers
  🌈 no cache-control
vs
  🤕 { "name": "Cache-Control", "value": "no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0" },
---
headers
  🌈 { "name": "Content-Length", "value": "209" },
vs
  🤕 { "name": "Content-Encoding", "value": "gzip" },
---
headers
  🌈 { "name": "Location", "value": "/interviews" },
vs
  🤕 no location
---
headers
  🌈 { "name": "Set-Cookie", "value": "secret=secretchars; Secure; HttpOnly; Path=/; SameSite=Lax" },
vs
  🤕 no secret
---
headers
  🌈 no transfer-encoding
vs
  🤕 { "name": "Transfer-Encoding", "value": "chunked" },
---
cookies
  🌈 { "name": "secret", "value": "secretchars", "path": "/", "domain": "site.com", "expires": null, "httpOnly": true, "secure": true, "sameSite": "Lax" },
vs
  🤕 no secret
```
