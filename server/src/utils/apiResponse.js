function success(
    res,
    data = null,
    message = "Success",
    statusCode = 200
) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

function error(
    res,
    message = "Something went wrong",
    statusCode = 500,
    details = undefined
) {
    const response = {
        success: false,
        message
    };

    if (details !== undefined) {
        response.details = details;
    }

    return res.status(statusCode).json(response);
}

module.exports = {
    success,
    error
};