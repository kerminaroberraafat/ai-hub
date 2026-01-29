
import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * API Configurations
 */
const DEFAULT_FAL_KEY = "aa4d2707-bd9c-479c-be71-a16f08497a35:d16d4d78b5419c5feea5314288c9b267";
const IMAGINE_ART_KEY = "vk-Gsyp3aFM2qXqFn2p3m2N6QNYjS9c6CGvOk34jD6tFo1W8ck";
const KLING_API_KEY = "vk-ad08a8e86d1a84404e5837be47d39ab44474f982671c0a";
const OPENROUTER_API_KEY = "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";

// Use a highly stable free model for reliability
const OPENROUTER_MODEL = "qwen/qwen-2-7b-instruct:free";
const PEXELS_API_KEY = '563492ad6f9170000100000155b57223f03b44b98c39e08398036e52';

export type VideoEngine = 'grok' | 'imagine-art' | 'veo' | 'qwen' | 'kling' | 'stock' | 'wan-video';

export const aiService = {
  getFalKey: () => localStorage.getItem('FAL_KEY') || DEFAULT_FAL_KEY,
  setFalKey: (key: string) => localStorage.setItem('FAL_KEY', key),

  // Unified Chat Stream - Now exclusively Gemini
  async *chatStream(message: string, history: any[] = []) {
    yield* this.chatStreamGemini(message, history);
  },

  async *chatStreamGemini(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const ai = getGeminiClient();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'You are an AI Hub assistant. Be helpful, concise, and professional.',
      },
      history: history,
    });
    
    const response = await chat.sendMessageStream({ message });
    for await (const chunk of response) {
      if (chunk.text) yield chunk.text;
    }
  },

  async generateImage(prompt: string, aspectRatio: string = "1:1") {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  },

  async generateVideo(engine: VideoEngine, prompt: string, imageInput?: string) {
    switch (engine) {
      case 'stock':
        return this.generateStockVideo(prompt);
      case 'wan-video':
        return this.generateWanVideo(prompt, imageInput);
      case 'kling':
        return this.generateKlingVideo(prompt, imageInput);
      case 'imagine-art':
        return this.generateImagineArtVideo(prompt, imageInput);
      case 'veo':
        return this.generateVeoVideo(prompt, imageInput);
      case 'qwen':
        return this.generateQwenVideo(prompt, imageInput);
      case 'grok':
      default:
        return this.generateGrokVideo(prompt);
    }
  },

  /**
   * WAN VIDEO 2.5 via Fal.ai
   */
  async generateWanVideo(prompt: string, imageInput?: string) {
    if (!imageInput) throw new Error("Wan Video 2.5 requires a reference image.");
    
    const key = this.getFalKey();
    const response = await fetch("https://queue.fal.run/fal-ai/wan-video/v2.1/image-to-video", {
      method: "POST",
      headers: {
        "Authorization": `Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageInput,
        prompt: prompt || "Cinematic masterpiece, hyper-realistic motion.",
        aspect_ratio: "16:9",
        num_frames: 81
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Network error" }));
      if (err.detail?.includes("Exhausted balance")) throw new Error("FAL_QUOTA_EXHAUSTED");
      throw new Error(err.detail || "Fal.ai Wan Video service unreachable.");
    }

    const { request_id } = await response.json();
    return this.pollFalStatus(request_id, key, "fal-ai/wan-video/v2.1/image-to-video");
  },

  async generateStockVideo(prompt: string) {
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(prompt)}&per_page=1`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    if (!response.ok) throw new Error("Stock Search failed.");
    const data = await response.json();
    if (!data.videos || data.videos.length === 0) throw new Error("No stock video found.");
    return data.videos[0].video_files[0].link;
  },

  async generateKlingVideo(prompt: string, imageInput?: string) {
    if (!imageInput) throw new Error("Kling v2 requires a base image.");
    const base64Data = imageInput.split(',')[1] || imageInput;
    const blob = await (await fetch(`data:image/png;base64,${base64Data}`)).blob();
    const formdata = new FormData();
    formdata.append("style", "kling-1.0-pro");
    formdata.append("prompt", prompt || "Hyper-realistic motion.");
    formdata.append("file", blob, "input.png");
    const response = await fetch("https://api.vyro.ai/v2/video/image-to-video", {
      method: 'POST',
      headers: { "Authorization": `Bearer ${KLING_API_KEY}` },
      body: formdata
    });
    if (!response.ok) throw new Error("Kling API request blocked or failed.");
    const data = await response.json();
    const taskId = data.id || data.task_id;
    for (let i = 0; i < 100; i++) {
      const statusRes = await fetch(`https://api.vyro.ai/v2/video/image-to-video/${taskId}`, {
        headers: { 'Authorization': `Bearer ${KLING_API_KEY}` }
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        const status = statusData.status?.toLowerCase();
        if (status === 'completed' || status === 'success') return statusData.video_url || statusData.result || statusData.url;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error("Kling timed out.");
  },

  async generateQwenVideo(prompt: string, imageInput?: string) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`, 
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ai-hub.io",
          "X-Title": "AI Hub"
        },
        body: JSON.stringify({ 
          model: OPENROUTER_MODEL, 
          messages: [{ role: "user", content: `Write a cinematic script for: ${prompt}` }] 
        })
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty Qwen response");
      return `text_response:${content}`;
    } catch (e) {
      const ai = getGeminiClient();
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a highly detailed cinematic director's script for a video with this prompt: "${prompt}". Describe camera angles and lighting.`
      });
      return `text_response:${res.text || "Script generation unavailable."}`;
    }
  },

  async generateGrokVideo(prompt: string) {
    const key = this.getFalKey();
    const response = await fetch("https://queue.fal.run/xai/grok-imagine/text-to-video", {
      method: "POST",
      headers: { "Authorization": `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, duration: 6 })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (err.detail?.includes("Exhausted balance")) throw new Error("FAL_QUOTA_EXHAUSTED");
        throw new Error("Grok service error.");
    }
    const { request_id } = await response.json();
    return this.pollFalStatus(request_id, key, "xai/grok-imagine/text-to-video");
  },

  async pollFalStatus(requestId: string, key: string, endpoint: string): Promise<string> {
    for (let i = 0; i < 100; i++) {
      const response = await fetch(`https://queue.fal.run/${endpoint}/requests/${requestId}`, {
        headers: { "Authorization": `Key ${key}` }
      });
      if (response.ok) {
        const status = await response.json();
        if (status.status === "COMPLETED") return status.response.video?.url || status.response.url;
        if (status.status === "FAILED") {
            if (status.error?.includes("Exhausted balance")) throw new Error("FAL_QUOTA_EXHAUSTED");
            throw new Error("Generation failed on Fal server.");
        }
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error("Request timed out.");
  },

  async generateImagineArtVideo(prompt: string, imageInput?: string) {
    if (!imageInput) throw new Error("Imagine Art requires an image.");
    const blob = await (await fetch(imageInput)).blob();
    const formData = new FormData();
    formData.append('image', blob, 'input.png');
    formData.append('prompt', prompt || "Cinematic animation");
    const response = await fetch('https://api.vyro.ai/v1/creative/image-to-video', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${IMAGINE_ART_KEY}` },
      body: formData
    });
    const data = await response.json();
    for (let i = 0; i < 60; i++) {
      const s = await fetch(`https://api.vyro.ai/v1/creative/image-to-video/${data.id}`, { headers: { 'Authorization': `Bearer ${IMAGINE_ART_KEY}` } });
      const sd = await s.json();
      if (sd.status === 'completed') return sd.video_url;
      await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error("Imagine Art timeout.");
  },

  async generateVeoVideo(prompt: string, imageInput?: string) {
    const ai = getGeminiClient();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Cinematic movement',
      ...(imageInput && { image: { imageBytes: imageInput.split(',')[1], mimeType: 'image/png' } }),
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    const resp = await fetch(`${uri}&key=${process.env.API_KEY}`);
    return URL.createObjectURL(await resp.blob());
  },

  async searchPexels(query: string, type: 'photos' | 'videos') {
    const endpoint = type === 'photos' 
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`
      : `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15`;
    const response = await fetch(endpoint, { headers: { Authorization: PEXELS_API_KEY } });
    return response.json();
  }
};
