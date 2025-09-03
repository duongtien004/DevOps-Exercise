const BlacklistedToken = require("../models/blacklistedTokenModel");

const blacklistService = {
  addToBlacklist: async (token) => {
    try {
      await BlacklistedToken.create({ token });
      return true;
    } catch (error) {
      console.error("Error adding token to blacklist:", error);
      return false;
    }
  },

  isBlacklisted: async (token) => {
    try {
      const blacklistedToken = await BlacklistedToken.findOne({ token });
      return !!blacklistedToken;
    } catch (error) {
      console.error("Error checking blacklist:", error);
      return false;
    }
  },

  removeFromBlacklist: async (token) => {
    try {
      await BlacklistedToken.deleteOne({ token });
      return true;
    } catch (error) {
      console.error("Error removing token from blacklist:", error);
      return false;
    }
  },
};

module.exports = blacklistService;
