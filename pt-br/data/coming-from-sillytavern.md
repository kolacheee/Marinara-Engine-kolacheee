# Para quem vem do SillyTavern

A maior parte do que você usava no SillyTavern está no Marinara Engine (chamado de Marinara daqui em diante), às vezes com outro nome. Encontre o termo que você conhece na tabela e pressione **Show me** (mostre-me) para abrir esse lugar no aplicativo, ou o nome para ler o guia.

Você também pode digitar o termo do SillyTavern na busca (**Ctrl+K**, ou toque no título no celular). "chat completion preset", "world info", "regex" e "author's note" levam ao recurso correspondente do Marinara.

Para trazer os seus personagens, chats, presets e World Info, veja [Importar do SillyTavern](importing-from-sillytavern.md). Os chats mantêm as datas das mensagens, a nota do autor e a persona, e os presets mantêm as configurações de amostragem.

## A mesma coisa, com o nome do Marinara

| No SillyTavern | No Marinara | Onde | |
| --- | --- | --- | --- |
| Presets de Chat Completion, AI Response Configuration (amostragem) | [Presets](../prompts/presets.md) | Biblioteca → **Presets**. Temperature, Top P/K, Min P e as penalidades ficam em **Parâmetros** do preset | [Mostre-me](#show-presets) |
| Prompt Manager | [Seções do preset](../prompts/presets.md) | Biblioteca → **Presets**, abra um preset → **Seções** | [Mostre-me](#show-presets) |
| Configurações de chat salvas, padrões de chat | [Perfis de configurações](../chats/settings-profiles.md) | Biblioteca → **Perfis de configurações**, ou Novo Roleplay → **Use a Profile** (usar um perfil) | [Mostre-me](#show-settingsProfiles) |
| World Info, World Book | [Lorebooks](../lorebooks/overview.md) | Biblioteca → **Lorebooks** | [Mostre-me](#show-lorebooks) |
| Author's Note | [Notas do autor](../roleplay/getting-started.md) | Configurações do chat (Roleplay) | [Mostre-me](#show-authorsNotes) |
| Regex | [Scripts de regex](../extending/regex-scripts.md) | Biblioteca → **Scripts de regex** | [Mostre-me](#show-regexScripts) |
| Chats em grupo | [Chats em grupo](../chats/group-chats.md) | Adicione dois ou mais personagens a um chat | [Mostre-me](#show-groupChats) |
| Cards de personagem, saudações alternativas | [Cards de personagem](../characters/import-export.md) | Biblioteca → **Personagens** → **Importar**. Você escolhe uma saudação alternativa ao iniciar um chat de Roleplay | |
| Quick Replies, STscript | [Respostas rápidas e comandos de barra](../chats/guided-and-impersonate.md) | Ao lado de **Send** (enviar), ou digite `/` | [Mostre-me](#show-quickReplies) |
| Extensions (Summarize, Image Generation…) | [Agentes](../agents/agents-overview.md) | Biblioteca → **Agents** (agentes), depois ative por chat | [Mostre-me](#show-agents) |
| Summarize, Vector Storage, Data Bank | [Recuperação de memórias e resumos](../agents/memory.md) | Configurações do chat → **Memory Recall** (recuperação de memórias) | [Mostre-me](#show-memory) |
| API Connections, Connection Profiles | [Conexões](../connections/connecting-to-a-provider.md) | Biblioteca → **Connections** (conexões) | [Mostre-me](#show-connections) |
| Prompt Itemization | [Espiar o prompt](../chats/peek-prompt.md) | A resposta mais recente da IA → **Peek prompt** (espiar o prompt) | [Mostre-me](#show-peekPrompt) |
| Checkpoints, ramificações | [Ramificações](../chats/branches.md) | Uma mensagem → **Branch from here** (ramificar a partir daqui) | [Mostre-me](#show-branches) |
| Swipes, rolar de novo | [Swipes](../chats/messages.md) | As setas abaixo de uma resposta, ou dê swipe em uma tela sensível ao toque | [Mostre-me](#show-swipes) |
| Persona Management | [Personas](../characters/personas.md) | Biblioteca → **Personas** | [Mostre-me](#show-personas) |
| UI Themes, Custom CSS | [Temas e temas CSS](../appearance/custom-css-themes.md) | Configurações → **Appearance** (aparência) | [Mostre-me](#show-themes) |

**Show me** abre a página ou inicia a etapa quando possível. Para coisas que ficam dentro de um chat (Peek prompt, Memory), abra um chat primeiro; caso contrário, o botão abre o guia.

## O que funciona de outra forma

- **Sem modelos de instruct ou contexto.** Marinara envia mensagens de chat, e o servidor do modelo aplica o template do próprio modelo, então não há nada para escolher em **Advanced Formatting** do SillyTavern. As seções de um preset fazem o papel da string de história.
- **Amostragem.** As configurações de um preset são os valores iniciais dos chats que o usam. Os valores definidos na conexão ou em um chat prevalecem. O tamanho máximo da resposta e o tamanho do contexto pertencem à conexão. Top A e a penalidade de repetição não têm configuração aqui.
- **Nota do autor.** Ela entra no chat na profundidade definida, a cada resposta. Com **Pós-processamento de mensagens** definido como **Aplicar** (o padrão), ela é enviada dentro da mensagem próxima do usuário. As configurações de frequência, posição e papel do SillyTavern não têm equivalente aqui. **Espiar o prompt** indica onde ela entrou.
- **Chats em grupo.** Em Roleplay, um único narrador dá voz a todos os personagens por padrão, o que usa menos tokens. Para que cada personagem responda na sua vez, como no SillyTavern, abra Configurações do chat → **Chat em grupo** e troque o modo. Os grupos importados do SillyTavern já usam o modo **Individual**.
- **Teclas.** Enter acrescenta uma linha no chat e **Ctrl+Enter** envia. Ative **Enviar com Enter** em Configurações → **Conversando** para enviar com Enter. As teclas de seta só alternam entre swipes depois que você ativa **Navegação intuitiva de swipes** na mesma aba.
- **Respostas rápidas.** Aqui elas são as ações de um clique ao lado de **Send** (personificar, respostas guiadas). Os conjuntos de Quick Replies do SillyTavern não são importados.

- **Três modos de chat.** Marinara divide os chats em **Conversation** (troca de mensagens, como mensagens privadas), **Roleplay** (cenas longas com narração) e **Game** (um mestre de jogo conduz um mundo com regras). Cada chat novo pergunta qual você quer, e a configuração mostra só o que aquele modo usa.
- **Começar um chat.** Um chat novo abre uma configuração curta. Salve uma configuração que você usa com frequência como perfil de configurações, e o próximo chat leva uma única etapa: **Use a Profile** e depois **Apply & Start** (aplicar e iniciar). Marque um perfil com estrela para torná-lo o padrão dos chats novos daquele modo.
- **A busca encontra tudo.** **Ctrl+K** encontra chats, personagens, configurações e guias, executa comandos e responde a perguntas com a ajuda da Professor Mari.
- **Professor Mari.** A assistente integrada do Marinara responde a perguntas sobre o aplicativo e pode criar personagens, lorebooks e agentes para você. Abra-a pela tela inicial.

## Guias relacionados

- [Importar do SillyTavern](importing-from-sillytavern.md)
- [Perfis de configurações](../chats/settings-profiles.md)
- [Configurações do chat](../chats/chat-settings.md)
