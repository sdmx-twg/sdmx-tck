const TEST_STATE = {
    WAITING: "Waiting",
    RUNNING: "Running",
    COMPLETED: "Completed",
    FAILED: "Failed",
    UNABLE_TO_RUN: "Unable to run"
};

module.exports.TEST_STATE = Object.freeze(TEST_STATE);