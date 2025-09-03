
const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
BlacklistedToken.ensureIndexes()
    .then(() => console.log('Blacklist indexes created successfully'))
    .catch(err => console.error('Error creating blacklist indexes:', err));

module.exports = BlacklistedToken