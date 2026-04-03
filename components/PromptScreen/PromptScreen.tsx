import { useState } from "react";
import { TextInput, View, Text, StyleSheet, Button, Image } from "react-native";
import { useChatApi } from "../api/useChatApi";

const PromptScreen: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    // const [imageURL, setImageURL] = useState<string | null>(null);
    const { apiResponse, isLoading, sendPrompt } = useChatApi();


    return (
        <>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Введите запрос"
                    value={prompt}
                    onChangeText={setPrompt}
                />
                <Text>Вы ввели: {prompt}</Text>
                <View style={styles.button}>
                    <Button title="Отправить запрос"
                        onPress={() => sendPrompt(prompt)}
                        disabled={isLoading || !prompt.trim()}
                    />
                    {isLoading && (
                        <Text>Отправляем текст...</Text>
                    )}
                </View>
                <View style={styles.response}>
                    {apiResponse && <Text>Ответ сервера: {apiResponse}
                    </Text>}
                </View>

            </View>
            {/* <View>
                {imageURL && (
                    <Image
                        source={{ uri: imageURL }}
                        style={{ width: 300, height: 300, marginTop: 20 }}
                    />
                )}
            </View> */}
        </>
    )
}

export default PromptScreen;

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 50 },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 10
    },
    response: {
        marginTop: 10
    }
});