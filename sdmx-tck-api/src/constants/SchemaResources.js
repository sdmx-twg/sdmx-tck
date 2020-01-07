const SCHEMA_RESOURCES = {
    datastructure:"datastructure",
    metadatastructure:"metadatastructure",
    dataflow:"dataflow",
    metadataflow:"metadataflow",
    provisionagreement:"provisionagreement"
};

function containsValue(value){
    for (var key in SCHEMA_RESOURCES) {
        if(SCHEMA_RESOURCES[key] === value){
            return true;
        }
    }
}

module.exports.SCHEMA_RESOURCES = Object.freeze(SCHEMA_RESOURCES);
module.exports.containsValue = containsValue;