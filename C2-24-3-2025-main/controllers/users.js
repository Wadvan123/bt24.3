let userSchema = require('../models/users');
let role = require('../models/roles'); // Đổi từ roleSchema thành role
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let constants = require('../Utils/constants');

module.exports = {
    getUserById: async function (id) {
        return await userSchema.findById(id).populate("role");
    },
    createUser: async function (username, password, email, roleName) {
        let roleCheck = await role.findOne({ roleName }); // Sử dụng role thay vì roleSchema
        if (roleCheck) {
            let newUser = new userSchema({
                username: username,
                password: password,
                email: email,
                role: roleCheck._id,
            });
            await newUser.save();
            return newUser;
        } else {
            throw new Error("role khong ton tai");
        }
    },
    checkLogin: async function (username, password) {
        if (username && password) {
            let user = await userSchema.findOne({
                username: username
            });
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    return jwt.sign({
                        id: user._id,
                        expired: new Date(Date.now() + 30 * 60 * 1000)
                    }, constants.SECRET_KEY);
                } else {
                    throw new Error("username or password is incorrect");
                }
            } else {
                throw new Error("username or password is incorrect");
            }
        } else {
            throw new Error("username or password is incorrect");
        }
    },
    createUsers: async function () {
        try {
            const adminRole = await role.findOne({ roleName: 'admin' }); // Sử dụng role thay vì roleSchema
            const editorRole = await role.findOne({ roleName: 'editor' });
            const viewerRole = await role.findOne({ roleName: 'viewer' });

            if (!adminRole || !editorRole || !viewerRole) {
                throw new Error("Một hoặc nhiều role không tồn tại!");
            }

            await userSchema.deleteMany();

            const users = [
                {
                    username: 'admin_user',
                    password: bcrypt.hashSync('admin123', 10),
                    email: 'admin@example.com',
                    fullName: 'Nguyen Van Admin',
                    imgURL: 'https://example.com/admin.jpg',
                    role: adminRole._id,
                },
                {
                    username: 'editor_user',
                    password: bcrypt.hashSync('editor123', 10),
                    email: 'editor@example.com',
                    fullName: 'Tran Thi Editor',
                    imgURL: 'https://example.com/editor.jpg',
                    role: editorRole._id,
                },
                {
                    username: 'viewer_user',
                    password: bcrypt.hashSync('viewer123', 10),
                    email: 'viewer@example.com',
                    fullName: 'Le Van Viewer',
                    imgURL: 'https://example.com/viewer.jpg',
                    role: viewerRole._id,
                },
            ];

            const createdUsers = await userSchema.insertMany(users);
            return createdUsers;
        } catch (error) {
            throw new Error(`Lỗi khi tạo user: ${error.message}`);
        }
    }
};