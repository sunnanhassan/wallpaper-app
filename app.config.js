export default {
  expo: {
    // ... existing configuration ...
    android: {
      permissions: [
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
};