const RISK_RULES = {
    amount: {
        medium: 20000,
        high: 50000
    },

    device: {
        newDevicePrefix: "NEW-"
    },

    velocity: {
        high: 5
    },

    location: {
        enabled: true
    },

    scoring: {
        amountMedium: 15,
        amountHigh: 30,
        device: 25,
        velocity: 25,
        location: 20
    }
};

module.exports = RISK_RULES;