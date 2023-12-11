import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { TiktokenModel } from "tiktoken"

export type TModelName = TiktokenModel

export type TModel<Name extends TModelName = TModelName> = {
  name: Name
  maxTokens: number
  contextWindow: number
  inputPrice: number
  outputPrice: number
  shutDownDate: Date
}
export type CreateParamsBase = Omit<ChatCompletionCreateParamsBase, 'model'> & { model: TModelName }
