import { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import AnimatedGradientBackground from "./components/AnimatedGradientBackground/AnimatedGradientBackground";
import PromptScreen from "./components/PromptScreen/PromptScreen";
import ThemePicker, {
  DEFAULT_GRADIENT_THEME,
  type GradientTheme,
} from "./components/ThemePicker/ThemePicker";

const statusBarTop = StatusBar.currentHeight ?? 0;

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState<GradientTheme>(DEFAULT_GRADIENT_THEME);

  return (
    <AnimatedGradientBackground theme={selectedTheme}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: selectedTheme.titleColor }]}>
          Local Language Model
        </Text>
        <PromptScreen />
      </View>
      <ThemePicker
        selectedTheme={selectedTheme}
        topOffset={statusBarTop + 12}
        onSelectTheme={setSelectedTheme}
      />
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: statusBarTop,
  },
  title: {
    position: "absolute",
    top: statusBarTop + 18,
    left: 20,
    zIndex: 9,
    maxWidth: "72%",
    fontSize: 26,
    fontWeight: "800",
  },
});
