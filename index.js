import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/* const assistant = await openai.beta.assistants.create({
  name: 'Test assistant',
  instructions:
    'You are a personal math tutor. Write and run code to answer math questions.',
  tools: [{ type: 'code_interpreter' }],
  model: 'gpt-4-1106-preview',
})

const thread = await openai.beta.threads.create()

const message = await openai.beta.threads.messages.create(thread.id, {
  role: 'user',
  content: 'I need to solve the equation `3x + 11 = 14`. Can you help me?',
}) */

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: `
Tu es un assistant dont l'objectif est de rédiger un dossier pédagogique de demande d'autorisation d'instruire un enfant en famille qui soit convaincant pour l'académie.
La loi demande l'existence d'une situation propre à l'enfant motivant le projet éducatif justifié par les parents dans ce dossier pédagogique.
Le dossier comporte plusieurs parties. Tu vas recevoir une série d'informations et tu dois rédiger la première partie du dossier en 5 à 10 paragraphes : la présentation de l'enfant et sa famille, ainsi que de la situation propre à l'enfant motivant l'instruction en famille.
      `,
    },
    {
      role: 'user',
      content: `
Identités de la famille :
Nom : Volant
Prénom : Joseph
Date de naissance : 03/08/2019 (age : 4 ans)
Lieu de naissance : Hsinchu, Taïwan
Nationalité : Française et taïwanaise
Père :
Nom : Volant
Prénom : Corentin
Date de naissance : 25/08/1987
Lieu de naissance : Le Mans, France
Nationalité  : Française
Mère :
Nom : Tsai
Prénom : Wan-Ting
Date de naissance : 23/09/1993
Lieu de naissance : Taipei, Taïwan
Nationalité : Taïwanaise
Parcours, histoire :
Joseph est né à Taïwan, nous sommes rentrés en France quand il avait 4 mois. Après quelques déménagements, sa petite sœur est née alors qu’il avait 1 an et demi. Nous sommes retournés un été à Taïwan pour ses 3 ans. Son petit frère est né quelques mois plus tard.
Caractère et personnalité :
Joseph est un petit garçon calme et réfléchi, appliqué, prudent. Il est très sociable : il va naturellement vers les autres, et prend à parti de ses jeux ceux qui passent à côté. Joseph est aussi très sensible, et aussi un peu rêveur : il prend son temps.
Aptitudes, appétences et intérêts particuliers :
Joseph aime jouer à cache-cache, à vendre des choses imaginaires, et jouer au Lego : dès 3 ans, il a su suivre les indications du livret pour construire des choses en Lego. 
Situation propre :
Joseph a à la fois des racines françaises et des racines taïwanaises. Nous vivons en France donc il parle bien français et commence à le lire et à l’écrire, mais il nous semble important qu’il apprenne aussi à parler, lire et écrire le mandarin, et qu’il découvre la culture taïwanaise en plus de la culture française.
Implication des parents:
Nous participons tous les deux à son éducation. Corentin travaille maintenant à 80% pour cela. Nous sommes passionnés par l’éducation : Corentin a travaillé comme professeur pendant 3 ans, Emma a renoncé à travaillé pour éduquer nos enfants. Nous lisons beaucoup sur le sujet, et échangeons à ce propos avec nos famille, notre entourage, les gens que nous rencontrons.
      `
    },
  ],
  temperature: 0.7,
  max_tokens: 3350,
  top_p: 1,
});

console.log(JSON.stringify(response, null, 4))

// const messages = await openai.beta.threads.messages.list(thread.id)
