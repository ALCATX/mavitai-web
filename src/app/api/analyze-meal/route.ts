import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Chave temporária inserida diretamente para teste
const API_KEY = "AQ.Ab8RN6Ldm5wuDXz5W4d3RHknwSHJZ9iaReO4EbZdbjdMOuiRMQ";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    console.log("-> [BACKEND] Requisição recebida com sucesso!");

    if (!imageBase64) {
      return NextResponse.json({ error: 'Nenhuma imagem foi enviada.' }, { status: 400 });
    }

    // Atualizado para a versão estável mais recente do modelo Flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = "Identifique os alimentos desta imagem e retorne APENAS um JSON no formato: {\"mealName\": \"string\", \"calories\": 0, \"protein\": 0, \"carbs\": 0, \"fat\": 0, \"healthScore\": 0, \"summary\": \"string\"}";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      },
    ]);

    const text = result.response.text();
    console.log("-> [BACKEND] Resposta do Gemini:", text);

    const jsonCleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonCleaned);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('-> [ERRO NO BACKEND]:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno ao analisar imagem.' },
      { status: 500 }
    );
  }
}