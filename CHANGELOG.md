# HISTORY
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