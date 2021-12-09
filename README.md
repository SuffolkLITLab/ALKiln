# docassemble-cucumber
Integrated automated end-to-end testing with docassemble, puppeteer, and cucumber.

## Integration tests
To setup for the integration tests, create the project on the server:
```
npm run setup
```

Use the syntax below to trigger specific tags:
```
npm run cucumber -- "--tags" "@tagname"
```

To run the unit tests in isolation:
```
npm run unit
```
