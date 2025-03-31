const mongoose = require('mongoose');
const role = require('../models/roles'); // Đổi tên biến từ Role thành role

mongoose.connect('mongodb://localhost:27017/C2')
    .then(async () => {
        console.log('Kết nối MongoDB thành công!');
        const roles = ['admin', 'editor', 'viewer'];
        for (const roleName of roles) {
            const existingRole = await role.findOne({ roleName });
            if (!existingRole) {
                await new role({ roleName, description: `Role ${roleName}` }).save();
                console.log(`Role ${roleName} created!`);
            } else {
                console.log(`Role ${roleName} already exists.`);
            }
        }
        mongoose.connection.close();
    })
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));