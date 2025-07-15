var DataStructureComponentObject = require('./DataStructureComponentObject.js');
const ATTRIBUTE_ASSIGNMENT_STATUS = require('../../constants/structure-queries-constants/DSDAttributeConstants.js').ATTRIBUTE_ASSIGNMENT_STATUS;

class DataStructureMeasureObject extends DataStructureComponentObject {
    constructor(id, type, references, representation, assignmentStatus) {
        super(id, type, references, representation)
        /* The assignmentStatus takes values from the "usage" XML attribute */
        this.assignmentStatus = assignmentStatus;
    }
    setAssignmentStatus(assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }
    getAssignmentStatus() {
        return this.assignmentStatus;
    }
    isMandatory() {
        return this.getAssignmentStatus() === ATTRIBUTE_ASSIGNMENT_STATUS.MANDATORY;
    }
}
module.exports = DataStructureMeasureObject;