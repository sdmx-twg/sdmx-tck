# HISTORY
## sdmx-tck-modules v5.2.1 (2025-07-21)
- Minor fix on data availability tests for API versions <= 1.5.0 (The representation was not set on the request header when running data availability queries.)

## sdmx-tck-modules v5.2.0 (2025-07-21)
- Support JSON v2.0 format for SDMX data messages.

## sdmx-tck-modules v5.1.0 (2025-07-15)
- Support JSON v2.0 format for SDMX structure messages.
### UI Changes/Improvements
- Add a new UI parameter for selecting the SDMX message format (i.e. XML 2.1, XML 3.0, JSON 2.0.0 etc)
- Make improvements in the UI to guide selecting the applicable combination of input parameters based on API version and format
- Abort test execution if data test prerequisites fail, and notify the user with an appropriate message.
- Transform the Redux store content from an array to an object to allow storing additional information.

# HISTORY
## sdmx-tck-modules v5.0.0 (2025-06-24)
- Introduce new tests for `attributes` parameter, e.g. all, none, dsd, msd, dataset, series, obs, {attribute_id} and implement semantic checks that verify whether the returned attributes aling with the specified `attributes` parameter.
- Introduce new tests for the `measures` parameter (e.g., all, none, specific {measure_id}) and implement semantic checks to ensure that the measures in the returned dataset are consistent with the `measures` parameter.
- Adapt SDMX 3.0 dataset reader to handle complex measures and attributes.
- Parse attributeRelationship and measureRelationship from the SDMX 3.0 message; Extract the component's ID - if it's not explicitly defined - from the ConceptIdentity.

## sdmx-tck-modules v4.9.0 (2025-04-14)
- Introduce support for REST API version v2.1.0 and data registrations. A new test index, Registration, has been created, containing 14 tests for data registration functionality.

## sdmx-tck-modules v4.8.0 (2024-12-05)
- Introduce structure tests to support multiple values for AGENCY, ID and VERSION, using the OR separator.
- Handle Geospatial specialised code lists (i.e., GeographicCodelist and GeoGridCodelist) when parsing codelists.
- Support parameter value ancestors for the `references` parameter.

## sdmx-tck-modules v4.7.0 (2024-03-26)

### Details
- Adapt the existing tests and introduce new ones within the "Structure Further Describing Results Parameters" category that work with REST api version 2.0.

## sdmx-tck-modules v4.6.0 (2024-03-07)

### Details

- Adjust data extended identification tests to support REST 2.0 and SDMX 3.0. Added support for many keys using filters for dimension values.

- Introduced key identifier for tests because the existing URL used as identifier was not sufficient to describe the same test for different REST api versions.

- Minor fix in the creation of testId for data availability tests.

- Organised unit tests for SDMX-ML structure parsers.

- Added fix for <code>/hierarchicalcodelist/agency/id/version/items</code> test, as proposed by Oleksandr Buhaiov (buhaiovos)). The test was failing because hierarchies were not parsed and the code was not able to select the two hierarchies required by the specific test in order to run.

- Fix handling of 406 response code for represenation tests with invalid/not supported represenation type (fix proposed by Oleksandr Buhaiov (buhaiovos)).

- Fixed a bug in handling of 'structure' request type parameter. The process of randomly selecting a structure based on its type was not suitable for the 'structure' resource and has been appropriately addressed.

- Resolved a bug affecting the semantic checking of structure identification tests specifically when the requested REST resource is 'structure'.

## sdmx-tck-modules v4.5.0 (2024-02-22)

### Details

//TODO