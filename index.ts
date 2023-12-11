import { parseForm } from './parseForm.ts'
import { requestCompletion } from './requestCompletion.ts'

const { systemContent, userContent } = parseForm('./forms/presentation@0.1.0.md')

requestCompletion({
  model: 'gpt-3.5-turbo-16k-0613',
  messages: [
    {
      role: 'system',
      content: systemContent,
    },
    {
      role: 'user',
      content: userContent,
    },
  ],
  temperature: 0.7,
  max_tokens: 800,
  presence_penalty: 0,
})
