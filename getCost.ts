import { ChatCompletion } from 'openai/resources/index.mjs'
import { encoding_for_model } from 'tiktoken'

import { getModel } from './models.ts'
import { CreateParamsBase, TModelName } from './types.ts'

export const getTokensCount = (value: string | number, modelName: TModelName) => {
  if (typeof value === 'number') {
    return value
  }

  const enc = encoding_for_model(modelName)

  const result = enc.encode(value)

  enc.free()

  return result.length
}

const getCost = (modelName: TModelName, input: string | number, output: string | number) => {
  const model = getModel(modelName)

  const inputTokensCount = getTokensCount(input, modelName)
  const outputTokensCount = getTokensCount(output, modelName)

  const { inputPrice, outputPrice } = model

  return Math.floor(inputTokensCount * inputPrice + outputTokensCount * outputPrice) / 1000
}

export const getInputTokensCount = (messages: CreateParamsBase['messages']) =>
  messages.reduce((acc, { content }) => acc + (content?.length || 0), 0)

export const getOutputMaxTokens = (
  modelName: TModelName,
  promptTokensCount: number,
  outputMaxTokens?: number | null,
) => {
  const modelMaxTokens = getModel(modelName).maxTokens

  if (promptTokensCount > modelMaxTokens) {
    throw new Error(`Prompt has more tokens (${promptTokensCount}) than model max tokens (${modelMaxTokens})!`)
  }

  const remainingTokens = modelMaxTokens - promptTokensCount

  if (outputMaxTokens && remainingTokens < outputMaxTokens / 2) {
    throw new Error(
      `Prompt has too much tokens (${promptTokensCount}): only ${remainingTokens} are left available for the output (which is required by user to be < ${outputMaxTokens}) before reaching model max tokens (${modelMaxTokens})!`,
    )
  }

  return outputMaxTokens ? Math.min(remainingTokens, outputMaxTokens) : remainingTokens
}

export const getRequestMaxCost = ({ model: modelName, messages, max_tokens }: CreateParamsBase) => {
  const promptTokensCount = getInputTokensCount(messages)
  return getCost(modelName, promptTokensCount, getOutputMaxTokens(modelName, promptTokensCount, max_tokens))
}

export const getResponseCost = ({ usage, model }: ChatCompletion) =>
  usage && getCost(model as TModelName, usage.prompt_tokens, usage.completion_tokens)
