# ALKiln

Formerly named "docassemble-cucumber"

Integrated automated end-to-end testing with docassemble, puppeteer, and cucumber.

Works well with https://github.com/suffolklitlab/docassemble-AssemblyLine but isn't
dependent on it.

## Documentation

Information for using the framework is at https://suffolklitlab.org/docassemble-AssemblyLine-documentation/docs/automated_integrated_testing/

We're currently maintaining two stable versions and to see the status of each of those versions, you have to check those branches:

- [Version 3](https://github.com/SuffolkLITLab/ALKiln/tree/releases/v3)
- [Version 4](https://github.com/SuffolkLITLab/ALKiln/tree/releases/v4)

See their CHANGELOGs at those locations.

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
