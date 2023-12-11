import dotenv from 'dotenv'
import inquirer from 'inquirer'
import OpenAI from 'openai'
import { CreateParamsBase } from 'types.ts'

import { getRequestMaxCost } from './getCost.ts'
import { recordExperiment } from './recordExperiment.ts'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const requestCompletion = async (requestBody: CreateParamsBase) => {
  const maxCost = getRequestMaxCost(requestBody)
  
  const { confirm } = await inquirer.prompt({
    name: 'confirm',
    type: 'confirm',
    message: `Running this request will cost up to ${maxCost}$. Continue?`,
    default: true,
  })
  
  if (!confirm) {
    throw new Error('Canceled')
  }
  
  const response = await openai.chat.completions.create(requestBody)
  
  recordExperiment(requestBody, response as any)
}

