import { invokeLLM } from "./_core/llm";

/**
 * Transcreve áudio usando OpenAI Whisper API
 * @param audioUrl URL do arquivo de áudio (base64 ou URL pública)
 * @param language Idioma do áudio (ex: 'pt')
 */
export async function transcribeAudio(
  audioUrl: string,
  language: string = "pt"
): Promise<string> {
  try {
    // Se for base64, converter para URL de arquivo
    let finalUrl = audioUrl;
    if (audioUrl.startsWith("data:")) {
      // Para base64, vamos usar a transcrição via LLM
      // Nota: Whisper funciona melhor com URLs públicas
      // Aqui fazemos um placeholder que será melhorado
      return "Transcrição de áudio (placeholder)";
    }

    // Usar a função de transcrição disponível no servidor
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: createFormData(audioUrl, language),
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const data = await response.json() as { text: string };
    return data.text;
  } catch (error) {
    console.error("Erro ao transcrever áudio:", error);
    throw error;
  }
}

/**
 * Sintetiza texto em voz usando OpenAI Text-to-Speech
 * @param text Texto a ser convertido em voz
 * @param voice Voz a usar (alloy, echo, fable, onyx, nova, shimmer)
 */
export async function synthesizeSpeech(
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "nova"
): Promise<ArrayBuffer> {
  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice,
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`);
    }

    return response.arrayBuffer();
  } catch (error) {
    console.error("Erro ao sintetizar voz:", error);
    throw error;
  }
}

/**
 * Cria FormData para upload de áudio
 */
function createFormData(audioUrl: string, language: string): FormData {
  const formData = new FormData();

  // Aqui você adicionaria o arquivo de áudio
  // formData.append("file", audioFile);
  formData.append("model", "whisper-1");
  formData.append("language", language);

  return formData;
}

/**
 * Processa um ciclo completo de chat de voz:
 * 1. Transcreve o áudio do usuário
 * 2. Envia para IA
 * 3. Sintetiza a resposta em voz
 */
export async function processVoiceChat(
  audioUrl: string,
  aiResponse: string,
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
): Promise<{
  transcription: string;
  audioResponse: ArrayBuffer;
}> {
  try {
    // Transcrever áudio do usuário
    const transcription = await transcribeAudio(audioUrl, "pt");

    // Sintetizar resposta da IA
    const audioResponse = await synthesizeSpeech(aiResponse, voice || "nova");

    return {
      transcription,
      audioResponse,
    };
  } catch (error) {
    console.error("Erro ao processar chat de voz:", error);
    throw error;
  }
}
