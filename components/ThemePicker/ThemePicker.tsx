import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type GradientColors = [string, string, ...string[]];

export type GradientTheme = {
    name: string;
    colors: GradientColors;
    titleColor: string;
};

export const GRADIENT_THEMES: GradientTheme[] = [
    {
        name: "SolarFlare",
        colors: ["#FFA000", "#E8003A"],
        titleColor: "#20100A",
    },
    {
        name: "NeonTide",
        colors: ["#00F5AA", "#3B00FF"],
        titleColor: "#061827",
    },
    {
        name: "Dusk",
        colors: ["#FF5CBA", "#2B00FF"],
        titleColor: "#21103B",
    },
    {
        name: "Arctic",
        colors: ["#E8F5FF", "#0050D8"],
        titleColor: "#062B4F",
    },
];

export const DEFAULT_GRADIENT_THEME = GRADIENT_THEMES[0];

type ThemePickerProps = {
    selectedTheme: GradientTheme;
    topOffset: number;
    onSelectTheme: (theme: GradientTheme) => void;
};

const ThemePicker: React.FC<ThemePickerProps> = ({
    selectedTheme,
    topOffset,
    onSelectTheme,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    function handleSelectTheme(theme: GradientTheme) {
        setIsOpen(false);
        onSelectTheme(theme);
    }

    return (
        <>
            <Pressable
                style={[styles.paletteButton, { top: topOffset }]}
                onPress={() => setIsOpen(true)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Выбор темы"
            >
                <View style={styles.paletteIcon}>
                    {GRADIENT_THEMES.map((theme) => (
                        <LinearGradient
                            key={theme.name}
                            colors={theme.colors}
                            style={styles.paletteColor}
                        />
                    ))}
                </View>
            </Pressable>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.overlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setIsOpen(false)}
                    />
                    <View style={[styles.panel, { marginTop: topOffset + 50 }]}>
                        {GRADIENT_THEMES.map((theme) => {
                            const isSelected = theme.name === selectedTheme.name;

                            return (
                                <Pressable
                                    key={theme.name}
                                    style={[
                                        styles.themeOption,
                                        isSelected && styles.themeOptionSelected,
                                    ]}
                                    onPress={() => handleSelectTheme(theme)}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: isSelected }}
                                >
                                    <LinearGradient
                                        colors={theme.colors}
                                        style={styles.themeSwatch}
                                    />
                                    <Text style={styles.themeName}>{theme.name}</Text>
                                    {isSelected && <View style={styles.selectedDot} />}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default ThemePicker;

const styles = StyleSheet.create({
    paletteButton: {
        position: "absolute",
        right: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.86)",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.14)",
        elevation: 4,
    },
    paletteIcon: {
        width: 24,
        height: 24,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 3,
    },
    paletteColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    overlay: {
        flex: 1,
        alignItems: "flex-end",
        paddingHorizontal: 12,
        backgroundColor: "rgba(0, 0, 0, 0.18)",
    },
    panel: {
        width: 220,
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        elevation: 5,
    },
    themeOption: {
        minHeight: 46,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    themeOptionSelected: {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    themeSwatch: {
        width: 34,
        height: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.14)",
    },
    themeName: {
        flex: 1,
        color: "#141414",
        fontSize: 15,
        fontWeight: "600",
    },
    selectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#141414",
    },
});
