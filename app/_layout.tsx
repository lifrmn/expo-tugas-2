import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "B612-Italic": require("../assets/fonts/static/B612-Italic.ttf"),
    "Fenix-Regular": require("../assets/fonts/static/Fenix-Regular.ttf"),
    "Gupter-Medium": require("../assets/fonts/static/Gupter-Medium.ttf"),
    "Marvel-Bold": require("../assets/fonts/static/Marvel-Bold.ttf"),
    "Sniglet-ExtraBold": require("../assets/fonts/static/Sniglet-ExtraBold.ttf"),

    "Alkatra-VariableFont": require("../assets/fonts/variable/Alkatra-VariableFont_wght.ttf"),
    "ExpletusSans-VariableFont": require("../assets/fonts/variable/ExpletusSans-VariableFont_wght.ttf"),
    "HostGrotesk-VariableFont": require("../assets/fonts/variable/HostGrotesk-VariableFont_wght.ttf"),
    "InclusiveSans-VariableFont": require("../assets/fonts/variable/InclusiveSans-VariableFont_wght.ttf"),
    "PlaywriteAUSA-VariableFont": require("../assets/fonts/variable/PlaywriteAUSA-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded && !error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack />;
}