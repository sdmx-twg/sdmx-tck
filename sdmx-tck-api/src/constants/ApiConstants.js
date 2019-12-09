const SUCCESS_CODE = 1;

const FAILURE_CODE = 0;

const TEST_STATE = {
    WAITING: "Waiting",
    RUNNING: "Running",
    COMPLETED: "Completed",
    FAILED: "Failed",
    UNABLE_TO_RUN: "Unable to run"
};

module.exports.API_CONSTANTS = {
    SUCCESS_CODE: Object.freeze(SUCCESS_CODE),
    FAILURE_CODE: Object.freeze(FAILURE_CODE),
    TEST_STATE: Object.freeze(TEST_STATE)
};