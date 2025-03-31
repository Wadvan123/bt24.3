let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullName: {
        type: String,
        default: '',
        validate: {
            validator: function (value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: 'fullName chỉ được chứa chữ cái và khoảng trắng!'
        }
    },
    imgURL: {
        type: String,
        default: '',
        validate: {
            validator: function (value) {
                const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
                return urlPattern.test(value);
            },
            message: 'imgURL phải là một URL hợp lệ!'
        }
    },
    status: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0, min: 0 },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role' // Đổi từ 'Role' thành 'role' để khớp với tên model
    }
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
});

module.exports = mongoose.model('user', userSchema);