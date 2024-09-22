export default {
  expo: {
    name: "wallpaperapp",
    slug: "wallpaperapp",
    version: "1.0.0",
    sdkVersion: "51.0.0",
    android: {
      package: "com.sunnan.wallpaperapp",
      permissions: [
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      eas: {
        projectId: "b4784ba6-80c1-43a1-8d20-ebae5e2d41e6"
      }
    },
    owner: "sunnan",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
