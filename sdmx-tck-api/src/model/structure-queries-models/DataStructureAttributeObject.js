var DataStructureComponentObject = require('./DataStructureComponentObject.js');
const ATTRIBUTE_ASSIGNMENT_STATUS = require('../../constants/structure-queries-constants/DSDAttributeConstants.js').ATTRIBUTE_ASSIGNMENT_STATUS;

class DataStructureAttributeObject extends DataStructureComponentObject{
    constructor(id,type,references,representation,attributeRelationship,assignmentStatus,measureRelationship){

        super(id,type,references,representation)
        this.attributeRelationship = attributeRelationship;
        /* MeasureRelationship is introduced in SDMX 3.0.
         * Lack of the MeasureRelationship defaults to a relationship to all Measures.
         */
        this.measureRelationship = measureRelationship;
        /* 
         * In SDMX 3.0, the assignmentStatus has been replaced by the "usage" XML attribute.
         * For compatibitlity with the SDMX 2.1 the assignmentStatus is still used here 
         * but it takes values for the "usage" XML attribute.
        */
        this.assignmentStatus = assignmentStatus;
    }
    setAssignmentStatus(assignmentStatus){
        this.assignmentStatus = assignmentStatus;
    }
    getAssignmentStatus(){
        return this.assignmentStatus;
    }
    isMandatory() {
        return this.getAssignmentStatus() === ATTRIBUTE_ASSIGNMENT_STATUS.MANDATORY;
    }
    setAttributeRelationship(attributeRelationship){
        this.attributeRelationship = attributeRelationship;
    }
    getAttributeRelationship(){
        return this.attributeRelationship;
    }
    getAttributeRelationshipOfType(type) {
        return this.attributeRelationship
                .filter(r => r.getRelationshipType() === type)
                .map(r => r.getId())
                .filter(id => id !== undefined);
    }
    hasAttributeRelationshipOfType(type) {
        return this.attributeRelationship.filter(r => r.getRelationshipType() === type).length > 0;
    }
    setMeasureRelationship(measureRelationship) {
        this.measureRelationship = measureRelationship;
    }
    getMeasureRelationship() {
        return measureRelationship;
    }
}
module.exports = DataStructureAttributeObject;