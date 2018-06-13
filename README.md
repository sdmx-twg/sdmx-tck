README.md
=========

## What this repository is
The SDMX RESTful API guaranties the interoperability between SDMX compliant Web Services implementations and other services, applications or tools. The rich set of features in the API, allows flexible querying, but also maintenance, of data and metadata.

The API cannot however ensure that a specific implementation of a Web Service supports the set of features required by any client and that its instance is correctly implemented according to the SDMX standard.

The only way a client might find which feature is implemented or if they are compliant would be by going through a test and fail process themselves.

To mitigate the above concerns, the SDMX __T__echnical __W__orking __G__roup (TWG) decided that a __T__echnology __C__ompatibility __T__oolkit (TCK) would be necessary. The TCK would allow the validation, coverage and potentially the certification of a candidate RESTful SDMX Web Services instance.

We aim to provide the following:
* Validate the parts of the API:
  * resources
  * parameters
  * mime-types
  * HTTP return codes
*	The coverage: what percentage the API is supported

## How to contribute

This TCK is released as an open-source repository here on Github. We welcome contributions from other interested parties but ask that the following guidelines  are taken into account when [CONTRIBUTING](CONTRIBUTING.md).

## License

[ICS](LICENSE.md)
