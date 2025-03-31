let mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9_]+$/.test(value);
            },
            message: 'roleName chỉ được chứa chữ cái, số và dấu gạch dưới!'
        }
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('role', roleSchema); 