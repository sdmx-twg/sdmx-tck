export default class TckError extends Error {
    constructor(errorMessage, errorCode) {
        super(errorMessage);

        this.errorCode = errorCode;
    }
};