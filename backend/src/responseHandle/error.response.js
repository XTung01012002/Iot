// const statusCode = {
//     FORBIDDEN: 403,
//     CONFLICT: 409
// }
// const reasonStatusCode = {
//     FORBIDDEN: 'Bad request',
//     CONFLICT: 'Conflict error'
// }

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status)
    }
}
class AuthFailureError extends ErrorResponse {
    constructor (message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED){
        super(message,statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor (message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
        super(message,statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor (message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message,statusCode)
    }
}
class InternalServerError extends ErrorResponse {
    constructor (message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR){
        super(message,statusCode)
    }
}
class RedisErrorResponse extends ErrorResponse {
    constructor (message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR){
        super(message,statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    InternalServerError,
    RedisErrorResponse
}