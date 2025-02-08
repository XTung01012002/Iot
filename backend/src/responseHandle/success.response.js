const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")


class SuccessResponse {
    constructor({ message, status = StatusCodes.OK, reason = ReasonPhrases.OK, data = {} }) {
        this.message = !message ? reason : message
        this.status = status
        this.data = data
        this.success = true
    }
    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, data })
    }
}

class Created extends SuccessResponse {
    constructor({ option = {}, message, status = StatusCodes.CREATED, reason = ReasonPhrases.CREATED, data }) {
        super({ message, status, reason, data })
        this.option = option
    }
}

module.exports = {
    OK, Created, SuccessResponse
}