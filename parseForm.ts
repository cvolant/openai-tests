import { readFileSync } from "fs";

export const parseForm = (formPath: string) => {
  const form = readFileSync('./forms/presentation@0.1.0.md', { encoding: 'utf8' })

  if (!form) {
    throw new Error("Form not found at path: " + formPath)
  }

  const [_title, systemTitle, systemContent, userTitle, userContent] = form.split(/^##\s(\w+)/m)

  if (systemTitle !== 'System' || userTitle !== 'User' || !systemContent || !userContent) {
    throw new Error(`Form parsing error.\nSystem: ${systemTitle}\nUser: ${userTitle}`)
  }

  return { systemContent: systemContent.trim(), userContent: userContent.trim() }
}
