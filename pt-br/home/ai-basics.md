# Noções básicas de IA: modelos, tokens e contexto

Está começando a conversar com IA? Esta página explica os poucos termos que os outros guias usam. Você não precisa de uma conta para lê-la. O tour **Noções básicas de IA**, na tela Início, apresenta tudo passo a passo.

## O que é um modelo de IA

Um modelo de IA (também chamado de modelo de linguagem de grande porte, ou LLM) é um programa que leu uma quantidade enorme de texto e aprendeu a prever o que vem a seguir. Quando você envia uma mensagem, ele escreve a resposta um pedacinho por vez, sempre escolhendo um próximo pedaço provável.

Ele não pesquisa enquanto escreve. Tudo que sabe vem do que leu antes de ficar pronto e do que Marinara envia junto com a sua mensagem. É por isso que um personagem só sabe o que está no card dele, no chat e nas informações de lore que Marinara acrescenta.

## Onde um modelo roda

Marinara é o aplicativo em que você conversa. Ele não traz um modelo grande dentro dele. Ele envia o chat para um modelo:

- **Em um serviço na internet**, como OpenRouter, NanoGPT, OpenAI ou Anthropic. Você cria uma conta lá, obtém uma chave de API (um código secreto que permite que Marinara use a sua conta), e o serviço roda o modelo. A maioria dos serviços cobra por uso. Alguns têm modelos gratuitos.
- **No seu próprio computador**, como o [Modelo embutido](../connections/local-model.md). Ele não precisa de conta e não custa nada, mas é menor e mais lento que os modelos dos grandes serviços, e o seu computador faz o trabalho.

Veja [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md) para adicionar qualquer uma das opções.

## Tokens

Os modelos leem e escrevem em tokens, pequenos pedaços de texto. Um token equivale a cerca de três quartos de uma palavra em inglês, então 100 tokens são cerca de 75 palavras. Os serviços contam tokens para definir preços e limites: normalmente, você paga pelos tokens que envia e pelos que recebe de volta.

## A janela de contexto

Um modelo só consegue ler uma quantidade limitada de tokens de uma vez. Esse limite é a janela de contexto dele. A cada resposta, Marinara envia ao modelo as instruções, o card de personagem, a sua persona, as informações de lore e o máximo do chat que couber.

Em um chat longo, as mensagens mais antigas deixam de caber, então o modelo se esquece delas. Marinara pode trazer de volta as partes importantes com resumos e Recuperação de memórias. Veja [Recuperação de memórias e resumos do chat](../agents/memory.md).

## Modelos diferentes para tarefas diferentes

Marinara pode usar mais de um tipo de modelo:

| Tipo | O que faz | É necessário? |
| --- | --- | --- |
| **Modelo de chat** | Escreve as respostas. | Sim, um basta para começar. |
| **Modelo de decisão** | Responde a perguntas simples sobre o chat: sim ou não, qual entre algumas opções ou quanto. Alguns também conseguem analisar imagens. | Opcional. |
| **Modelo de embedding** | Transforma texto em números que representam o significado dele, para que Marinara encontre informações de lore e memórias pelo sentido. Nunca escreve texto. | Opcional. Já vem um pequeno embutido. |
| **Leitura de imagens** | Um modelo que consegue olhar uma imagem e descrevê-la. | Opcional. |
| **Imagem, vídeo e voz** | Serviços separados que criam imagens, clipes e fala. Um modelo de chat não faz isso. | Opcional. |

Você pode usar um modelo de chat para tudo no começo e adicionar os outros quando algum recurso pedir. Veja [Como escolher o modelo de cada tarefa](../connections/connecting-to-a-provider.md#choosing-the-model-for-each-job).

## Prompts e presets

O prompt é tudo que Marinara envia ao modelo para uma resposta. Um preset decide o que entra no prompt e em que ordem. **Espiar o prompt**, dentro de um chat, mostra o prompt exato que foi enviado. Veja [Editor de presets e gerenciador de prompts](../prompts/presets.md).

## Guias relacionados

- [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md)
- [Modelos de decisão](../connections/decision-models.md)
- [Busca semântica para lorebooks](../lorebooks/semantic-search.md)
- [Professor Mari](professor-mari.md)
