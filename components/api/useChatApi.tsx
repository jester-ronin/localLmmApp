// src/hooks/useChatApi.ts
import { useState } from "react";
import { LLM_CHAT_COMPLETIONS_URL, LLM_MODEL } from "../../utils/apiConfig";
import extractAnswer from "../../utils/extractAnswer";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type ChatCompletionResponse = {
    choices?: {
        message?: {
            content?: string;
        };
    }[];
};

function getApiErrorMessage(error: unknown) {
    if (error instanceof Error) {
        if (error.message === "Network request failed") {
            return "Не удалось подключиться к серверу. Проверь IP компьютера, Wi-Fi, firewall и запущен ли LLM-сервер.";
        }

        return error.message;
    }

    return "Неизвестная ошибка при получении данных";
}

export const useChatApi = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const sendPrompt = async (prompt: string) => {
        if (!prompt.trim()) return;

        const newUserMessage: Message = {
            role: "user",
            content: prompt
        };

        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);

        setIsLoading(true);
        try {
            const response = await fetch(LLM_CHAT_COMPLETIONS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: LLM_MODEL,
                    messages: updatedMessages
                })
            });

            if (!response.ok) {
                throw new Error(`Сервер ответил с ошибкой: ${response.status}`);
            }

            const data: ChatCompletionResponse = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error("Сервер ответил, но в ответе нет текста от модели");
            }

            setApiResponse(extractAnswer(content));

            setMessages(prev => [
                ...prev,
                { role: "assistant", content }
            ]);
        } catch (error) {
            console.error(error);
            setApiResponse(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return { apiResponse, isLoading, sendPrompt };
};
