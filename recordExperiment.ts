import { writeFileSync } from 'fs'
import { ChatCompletion } from 'openai/resources/index.mjs'

import { getInputTokensCount, getOutputMaxTokens, getRequestMaxCost, getResponseCost } from './getCost.ts'
import { CreateParamsBase } from './types.ts'
import { toTitleCase } from './utils/strings.ts'

export const getDate = () => new Date().toISOString().slice(0, 16)

export const formatExperiment = (requestBody: CreateParamsBase, completion: ChatCompletion) => {
  const inputTokensCount = getInputTokensCount(requestBody.messages)
  const outputMaxTokens = getOutputMaxTokens(requestBody.model, inputTokensCount)

  return `# ${toTitleCase(requestBody.model)} - ${getDate()}

## Request

### Request details

Model: ${requestBody.model}  
Max tokens: ${requestBody.max_tokens}  
Input tokens count: ${inputTokensCount}  
Output max tokens: ${outputMaxTokens}  
Temperature: ${requestBody.temperature || 1}  
Presence penalty: ${requestBody.presence_penalty || 0}  

### Messages${requestBody.messages.map(
    ({ role, content }) => `

#### ${toTitleCase(role)}

${content}`,
  )}

### Max cost

${getRequestMaxCost(requestBody)}$

## Response

### Real cost

${getResponseCost(completion)}$

### Response details

Model: ${completion.model}
Tokens: ${completion.usage?.total_tokens} = ${completion.usage?.prompt_tokens} [input] + ${completion.usage
    ?.completion_tokens} [output] (max output tokens: ${getOutputMaxTokens(
    requestBody.model,
    completion.usage?.prompt_tokens || inputTokensCount,
    requestBody.max_tokens,
  )})
${completion.choices.map(
  ({ message, finish_reason }) => `
#### ${toTitleCase(message.role)}'s answer

${message.content}

[${finish_reason}]
`,
)}`
}

export const recordExperiment = (requestBody: CreateParamsBase, completion: ChatCompletion) =>
  writeFileSync(`./experiments/${requestBody.model}-${getDate().replace(':', '-')}.md`, formatExperiment(requestBody, completion))
