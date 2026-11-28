# Visualizador de prompts

O visualizador coloca preset, lorebooks, personagens e persona lado a lado e mostra o prompt que formam na ordem de envio. Clique em uma parte para editá-la ali mesmo. As edições salvam no preset, lorebook, card ou persona real e aparecem imediatamente nos outros editores.

Ele começou como a extensão AIO Prompt Viewer and Editor de kolache e agora faz parte do novo layout.

<a id="opening-it"></a>
## Como abrir

- **Computador:** botão do visualizador (🥞) na barra superior, logo após Search.
- **Celular ou tablet:** toque no contador de abas para abrir All Tabs e depois no botão do visualizador (🥞) ao lado de **+**.
- **Em qualquer lugar:** abra Search e digite `prompt viewer`.

Abre em uma aba própria. Trocar de aba mantém escolhas e edições não salvas; ao fechar com uma edição pendente, pede confirmação.

<a id="the-three-columns"></a>
## As três colunas

| Coluna | Finalidade |
| --- | --- |
| **Sources** | Escolha preset, um ou mais lorebooks, personagem (vários para um grupo) e persona. Marque entradas ou pastas para incluí-las no prompt. **+** cria um item; o lápis abre as configurações. |
| **Prompt** | Sua seleção na ordem de montagem: seções do preset, entradas nas posições e profundidades, personagem e persona nos marcadores. **Validate** procura tags XML não fechadas e `{{macros}}` quebradas. Arraste seções para reordenar o preset. |
| **Editor** | Os campos da parte escolhida. **Salvar** salva; **Reverter** descarta a edição. |

No celular ou tablet na vertical, use **Sources / Prompt / Editor** para trocar de coluna. Clicar num bloco abre Editor.

<a id="inspect-summaries-and-settings"></a>
## Inspect, Summaries e Settings

Os botões superiores abrem essas telas na página; **Voltar** retorna às colunas.

- **Inspecionar** mostra o prompt como seria enviado. Com chat aberto, **Include history** pede o prompt exato (macros resolvidas e histórico ajustado); **Omit history** mostra a estrutura com um espaço reservado para o chat. Copie como texto ou lista JSON de mensagens.
- **Summaries** exporta todos os resumos de chats da biblioteca em Markdown ou JSON, inclusive entradas desativadas. Nenhum chat precisa estar aberto.
- **Configurações** define o tratamento do histórico em Inspect, quantos turnos um chat sem conexão mostra, os selos da coluna Prompt e as cores de Inspect.

<a id="what-it-does-not-show"></a>
## O que não aparece

- A coluna Prompt exclui agentes; Inspect inclui porque consulta a Engine.
- Histórico, resumos, exemplos de diálogo e dados de agentes são espaços reservados em Prompt: o conteúdo só existe ao executar um chat.
- O comportamento do grupo por turno (quem responde, “Respond only as…”) é descrito, não montado, até abrir um chat.
