const DATA_COMPONENTS_TYPES = require('sdmx-tck-api').constants.DATA_COMPONENTS_TYPES;

var SdmxDataObjects = require('sdmx-tck-api').model.SdmxDataObjects;
var ObservationObject = require('sdmx-tck-api/src/model/data-queries-models/ObservationObject');
var SeriesObject = require('sdmx-tck-api/src/model/data-queries-models/SeriesObject');
var DatasetObject = require('sdmx-tck-api/src/model/data-queries-models/DatasetObject');
var GroupObject  = require('sdmx-tck-api/src/model/data-queries-models/GroupObject');
var UrnUtil = require('sdmx-tck-api/src/utils/UrnUtil');

class SdmxJsonV20DataParser {

    static parseMessage(sdmxJsonObjects) {
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let dataComponents = new Map();

        SdmxJsonV20DataParser.parseDatasets(dataComponents, sdmxJsonObjects.data);

        return new SdmxDataObjects(dataComponents);
    };
  
    static _parseLinkedStructures(structure) {
        
        let urns = structure?.links.map(link => link.urn);
        
        let linkedStructures= [];
        for (let urn of urns) {
            let structureRef = UrnUtil.getStructureIdentityRef(urn);
            if (structureRef) linkedStructures.push(structureRef);
        }
        return linkedStructures; 
    }

    /**
     * Parse datasets
     * @param {*} dataComponents 
     * @param {SDMX-JSON.data} data 
     */
    static parseDatasets(dataComponents, data) {
        let dataComponentType = DATA_COMPONENTS_TYPES.DATASETS
        dataComponents.set(dataComponentType, []);
        
        if (data.dataSets) {
            data.dataSets.forEach(dataset => {

                //find the index of the structure object
                let structureIndex = dataset.structure;
                //get the structure that corresponds to the current dataset
                let structure = data.structures[structureIndex];
                //parse dataset
                var parsedDataset = this._parseDataset(structure, dataset);

                dataComponents.get(dataComponentType).push(parsedDataset);
            });
        }
    }

    /**
     * Parse dataset
     * @param {*} structure 
     * @param {*} dataset 
     * @returns 
     */
    static _parseDataset(structure, dataset) {
        //Parse linked Structrues
        const linkedStructures = this._parseLinkedStructures(structure);
        
        // parse dataset-level attributes (sdmx dataset dimensions + sdmx dataset attributes)
        const datasetAttributes = this._parseDatasetLevelAttributes(dataset, structure);

        //parse series
        var seriesArray = [];
        if (dataset.series) {
            seriesArray = this._parseSeries(dataset.series, structure);
        }

        //parse dimensionGroupAttributes
        var groupsArray = [];
        if (dataset.dimensionGroupAttributes) {
            groupsArray = this._parseDimensionGroupAttributes(dataset, structure);
        }

        //parse dataset observations (case of flat file)
        let datasetObsArray = [];
        if (dataset.observations) {
            datasetObsArray = this._parseObservations(dataset.observations, structure)
        }

        var datasetId = structure.name;//TODO ???

        return new DatasetObject(datasetId, datasetAttributes, seriesArray, groupsArray, datasetObsArray, linkedStructures);
    }

    static _parseDatasetLevelAttributes (dataset, structure) {
        //Parse dimensions at dataset let and add them as attributes
        var datasetDims = structure.dimensions.dataSet;

        // Dataset-level dimensions have (should have) only one value.
        // So we read the dimension values from structure part and add them as
        // dataset attribures in the IM of TCK.
        const datasetAttributes = datasetDims ? Object.fromEntries(datasetDims.map(dim => [dim.id, dim.values?.[0]?.id ?? null])) : {};

        //Parse dataset-level sdmx attributes
        let datasetSdmxAttributes = [];
        if (dataset.attributes) {
            datasetSdmxAttributes = this._parseSdmxAttributes(dataset.attributes, structure, "dataSet");
        }
        
        return {...datasetAttributes, ...datasetSdmxAttributes};
    }

    /**
     * Parse dimension group attributes
     * @param {*} dimensionGroupAttributes 
     * @param {*} structure 
     */
    static _parseDimensionGroupAttributes(dataset, structure) {
        let dimensionGroupAttributes = dataset.dimensionGroupAttributes;

        const allDimensions = [
            ...structure.dimensions.dataSet,
            ...structure.dimensions.series,
            ...structure.dimensions.observation
        ];
        const allDimValues = allDimensions.map(dim => dim.values.map(v => v.id));

        let groupsObjectArray = [];
        for (let dimGroupKey in dimensionGroupAttributes) {
            let groupAttributes = this._parseSdmxAttributes(dimensionGroupAttributes[dimGroupKey], structure, "dimensionGroup")

            //Add dimensions
            const dimIndexes = dimGroupKey.split(":");

            dimIndexes.forEach((valueIndex, dimIndex) => {
                if (valueIndex) {
                    const dimName = allDimensions[dimIndex].id;
                    groupAttributes[dimName] = allDimValues[dimIndex][valueIndex];
                }
            });

            groupsObjectArray.push(new GroupObject("XXXX", groupAttributes));//TODO
        }

       return groupsObjectArray;
    }

    static _parseSeries(series, structure) {
        var seriesArray = [];
        var seriesDims = structure.dimensions.series;
    
        // Prepare value lookup arrays for series dimensions
        const seriesDimValues = seriesDims.map(dim => dim.values.map(v => v.id));
        //seriesDimValues: array of arrays > array of dimensions containng array of values

        //Iterate series
        for (let seriesKey in series) {
            // Example: "0:1:0" split by ":"
            const seriesIndexes = seriesKey.split(":").map(Number);

            let seriesAttributes = {};
            //read dimensions attached to series and save them as series attributes
            seriesIndexes.forEach((valueIndex, dimIndex) => {
                const dimName = seriesDims[dimIndex].id;
                seriesAttributes[dimName] = seriesDimValues[dimIndex][valueIndex];
            });

            // read SDMX attributes attached at series level
            const seriesSdmxAttributes = this._parseSdmxAttributes(series[seriesKey].attributes, structure, "series");

            //add sdmx attributes to the main object holding seriesAttributes
            seriesAttributes = {...seriesAttributes, ...seriesSdmxAttributes};

            var obsArray = this._parseObservations(series[seriesKey].observations,
                structure,
            )
            seriesArray.push(new SeriesObject(seriesAttributes, obsArray));
        }
        return seriesArray;
    }

    /**
     * Parse observations
     * @param {*} observations 
     * @param {*} structure 
     * @returns 
     */
    static _parseObservations(observations, structure) {
        // Prepare value lookup arrays for observation dimensions
        const obsDims = structure.dimensions.observation;
        const obsDimValues = obsDims.map(dim => dim.values.map(v => v.id));

        let arrayOfObs = [];
        //iterate observations
        for (let obsKey in observations) {
            // Example: "0:1:0" split by ":"
            const obsIndexes = obsKey.split(":").map(Number);

            let obsAttributes = {};
            obsIndexes.forEach((valueIndex, dimIndex) => {
                const dimName = obsDims[dimIndex]?.id;
                if (dimName) {
                    obsAttributes[dimName] = obsDimValues[dimIndex][valueIndex];
                }
            });

            
            let obsValues = observations[obsKey];

            // Note: the observations[obsKey] is an array containing:
            // first: the corresponding values of all measures (as presented in the structure.measures.observation array) or the indexes of these values, depending on the presence of the values array in the component definition,
            // followed by: the corresponding values of all attributes presented in the structure.attributes.observation array or the indexes of these values, depending on the presence of the values array in the component definition,
            // and last: the indexes of the values of all annotations of that observation.
            
            const numberOfMeasures = this._getNumberOfMeasures(structure);
            const numberOfObservationLevelAttributes = this._getNumberOfObservationAttributes(structure);

            if (obsValues.length > numberOfMeasures) {//if attributes present
                let attributeValues = obsValues.filter((element, index) => index > numberOfMeasures -1 && index < numberOfMeasures + numberOfObservationLevelAttributes);

                const sdmxAttributes = this._parseSdmxAttributes(attributeValues, structure, "observation");
                
                //add SDMX obs level attributes to the main object with obs level attributes
                obsAttributes = { ...obsAttributes, ...sdmxAttributes };
            }
            
            let measureValues = obsValues.filter( (element, index) => index < numberOfMeasures);
            let measures  = this._parseSdmxMeasures(measureValues, structure);
            if (measures){
                obsAttributes = { ...obsAttributes, ...measures };
            }

            var obsObject = new ObservationObject(obsAttributes);
            arrayOfObs.push(obsObject);
        }
        return arrayOfObs;
    }

    /**
     * Parse SDMX attributes attached to the given level
     * 
     * @param {*} attributes 
     * @param {*} structure 
     * @param {*} level dataSet, series, observation (name of property in strcuture)
     * @returns 
     */
    static _parseSdmxAttributes(attributes, structure, level) {
        const sturcutreAttributesAtLevel = structure.attributes[level];
        
        if (!sturcutreAttributesAtLevel || !attributes) {
            return {};
        }
        return this._parseSdmxComponents(attributes, sturcutreAttributesAtLevel);
    }

    static _parseSdmxMeasures (obsValues, structure ) {

        /*
        * Note from Documentation:
        Structure:
        For backward-compatibility, the measures object can be omitted if there is only one measure with the ID "OBS_VALUE". 
        In this case, the measure values (of an indeterministic type) are written directly into the dataSet. 
        
        SDMX 3+.0.0 implementations should always use the measures object. 
        In case an SDMX 3+.0.0 data structure definition has no measures, 
        the measures object must be present but empty.
        */
    
        // if measures object exists in structure but it IS EMPTY then the Dataset does not have measures
        if (structure.measures && Object.keys(structure.measures).length === 0) {
            return null;
        } 
        
        let sdmxMeasures = {};

        // if measures object is omitted from structure, 
        // then there is only one measure with the ID "OBS_VALUE".
        if (structure.measures === undefined) {
            sdmxMeasures["OBS_VALUE"] = obsValues[0];
            return sdmxMeasures;
        }

        // Case measures are defined in structure    
        const sturcutreMeasures = structure.measures?.observation;
        if (sturcutreMeasures ) {
            sdmxMeasures = this._parseSdmxComponents(obsValues, sturcutreMeasures);
        }
        return sdmxMeasures;
    }

    /**
     * Parse SDMX components (attributes or measures only)
     * @param {*} componentValuesOrIndices
     * @param {*} level 
     * @returns 
     */
    static _parseSdmxComponents(componentValuesOrIndices, structureComponents) {

        // Note from documentation:
        //------------------------
        // ATTRIBUTES should present their values in the values array at least when they are coded,
        // or if they are presented at dataset, group or series level (in order to avoid repetition).
        // If they are non-coded and presented at observation level then instead of using the component's values array,
        // the attribute values can be directly written into the dataSets

        // MEASURES should present their values in the values array when they are coded. 
        // If they are non-coded then the measure values are directly written into the dataSets.

        // Get component values from structure:
        // id should be present if component is coded
        // vaule is used if component is not coded 
        const compValues = structureComponents.map(comp =>
            (comp.values ?? []).map(v => v ? v.id || v.value || v.values : null)
        );

        let sdmxComponents = {};
        componentValuesOrIndices.forEach((valueIndex, compIndex) => {
            const compId = structureComponents[compIndex]?.id;
            if (compId) {
                //if using index; values is present in structure part
                if (compValues[compIndex][valueIndex] !== undefined) {
                    //add component if its value is not null
                    if (compValues[compIndex][valueIndex] !== null) {
                        sdmxComponents[compId] = this._buildComponentValue(compValues[compIndex][valueIndex]);
                    }
                } else {// if component value is written directly in the dataset
                    //add component if its value is not null
                    if (valueIndex != null) {
                        sdmxComponents[compId] = this._buildComponentValue(valueIndex);
                    }
                }
            }
        });

        return sdmxComponents;
    }


    static _getNumberOfMeasures (structure) {
        if (structure.measures?.observation) {
            return structure.measures?.observation.length;
        } else {
            //if measures are omitted from the strucutre the there is only one measure
            return 1;
        }
    }
    static _getNumberOfObservationAttributes(structure) {
        if (structure.attributes?.observation) {
            return structure.attributes?.observation.length;
        }
    }

    static _buildComponentValue (componentValue) {
        if (Array.isArray(componentValue)) {//if complex
            return {
                value: undefined,
                complexValues: componentValue,
                multilingualValues: undefined
            };
        }
        else {
            return componentValue;
        }
    }
}

module.exports = SdmxJsonV20DataParser;