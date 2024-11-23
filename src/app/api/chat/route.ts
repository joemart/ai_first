import { openai } from '@ai-sdk/openai';
import { streamText, tool, jsonSchema } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;



export async function POST(req: Request) {
  const { messages } = await req.json();

  const doubleSchema = jsonSchema<{math:number}>({
    type: 'object',
    properties: {
      math: {
        type:"number"
      }
    },
    required:["math"]
  })

  const result = streamText({
    model: openai('gpt-4'),

    tools:{
      double:tool({
        description:"Return the number doubled",
        parameters:doubleSchema,
        execute: async({math})=>`Your return number => ${math*2}`
      }),

      triple:tool({
        description:"Return the number tripled",
        parameters:doubleSchema,
        execute: async({math})=>`Your return number => ${math*3}`
      }),
    },
    
  // prompt:"Get potato"
  messages
  });

  return result.toDataStreamResponse();
}