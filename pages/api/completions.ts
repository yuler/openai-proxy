import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const config = {
  runtime: 'edge',
}

export default async function handle(req: Request, res: Response) {
  const decoder = new TextDecoder()
  const { prompt } = (await req.json()) as {
    prompt?: string
  }
  console.log(res)
  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)

  const { value } = await stream.getReader().read()
  const chunkValue = decoder.decode(value)
  console.log(chunkValue)

  return new Response(stream)
}
