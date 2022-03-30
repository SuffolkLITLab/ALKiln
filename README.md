# ALKiln
Integrated automated end-to-end testing with docassemble, puppeteer, cucumber, and chai.

Works well with https://github.com/suffolklitlab/docassemble-AssemblyLine but isn't
dependent on it.

Formerly named "docassemble-cucumber"

## Documentation
Read about how to use this framework at https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/.

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
