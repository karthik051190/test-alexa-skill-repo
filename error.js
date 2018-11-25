//FILE ErrorFile.js
"use strict";

module.exports = function CustomError(errorName, errorMessage) {

    /*INHERITANCE*/
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object
    //Set the name for the ERROR
    this.name = errorName;
    //Define error message
    this.message = errorMessage;
};

// inherit from Error
//util.inherits(CustomError, Error);
require('util').inherits(module.exports, Error);

//Export the constructor function as the export of this module file.
//exports = module.exports = CustomError;
