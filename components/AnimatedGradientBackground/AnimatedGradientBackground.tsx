import { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Easing,
    Platform,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type GradientColors, type GradientTheme } from "../ThemePicker/ThemePicker";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const WAVE_DURATION_MS = 16000;

type AnimatedGradientBackgroundProps = {
    children: React.ReactNode;
    theme: GradientTheme;
};

function withAlpha(color: string, alpha: string) {
    const normalizedColor = color.replace("#", "");

    if (normalizedColor.length !== 6) {
        return color;
    }

    return `#${normalizedColor}${alpha}`;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
    children,
    theme,
}) => {
    const { width, height } = useWindowDimensions();
    const waveProgress = useRef(new Animated.Value(0)).current;

    const firstWaveColors = useMemo<GradientColors>(() => [
        withAlpha(theme.colors[1], "00"),
        withAlpha(theme.colors[0], "66"),
        withAlpha(theme.colors[1], "00"),
    ], [theme.colors]);

    const secondWaveColors = useMemo<GradientColors>(() => [
        withAlpha(theme.colors[0], "00"),
        withAlpha(theme.colors[1], "55"),
        withAlpha(theme.colors[0], "00"),
    ], [theme.colors]);

    useEffect(() => {
        const waveAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(waveProgress, {
                    toValue: 1,
                    duration: WAVE_DURATION_MS,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: Platform.OS !== "web",
                }),
                Animated.timing(waveProgress, {
                    toValue: 0,
                    duration: WAVE_DURATION_MS,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: Platform.OS !== "web",
                }),
            ])
        );

        waveAnimation.start();

        return () => {
            waveAnimation.stop();
        };
    }, [waveProgress]);

    const firstTranslateX = waveProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.28, width * 0.08],
    });
    const firstTranslateY = waveProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-height * 0.08, height * 0.04],
    });
    const secondTranslateX = waveProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.08, -width * 0.24],
    });
    const secondTranslateY = waveProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [height * 0.06, -height * 0.04],
    });

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={theme.colors}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <AnimatedLinearGradient
                colors={firstWaveColors}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 1, y: 0.75 }}
                style={[
                    styles.wave,
                    {
                        width: width * 1.45,
                        height: height * 1.12,
                        transform: [
                            { translateX: firstTranslateX },
                            { translateY: firstTranslateY },
                            { rotate: "-8deg" },
                        ],
                    },
                ]}
            />
            <AnimatedLinearGradient
                colors={secondWaveColors}
                locations={[0, 0.52, 1]}
                start={{ x: 1, y: 0.15 }}
                end={{ x: 0, y: 0.85 }}
                style={[
                    styles.wave,
                    styles.waveSoft,
                    {
                        width: width * 1.35,
                        height: height * 1.05,
                        transform: [
                            { translateX: secondTranslateX },
                            { translateY: secondTranslateY },
                            { rotate: "10deg" },
                        ],
                    },
                ]}
            />
            <View style={styles.content}>{children}</View>
        </View>
    );
};

export default AnimatedGradientBackground;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        overflow: "hidden",
    },
    wave: {
        position: "absolute",
        top: "-8%",
        left: "-12%",
        opacity: 0.7,
    },
    waveSoft: {
        top: "4%",
        left: "-6%",
        opacity: 0.5,
    },
    content: {
        flex: 1,
    },
});
