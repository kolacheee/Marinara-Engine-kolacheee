# Geração guiada e Impersonate

Duas formas de conduzir um chat. A geração guiada aponta a próxima resposta em uma direção sem publicar uma mensagem visível. O Impersonate faz o modelo escrever a sua própria resposta. O menu Quick replies (respostas rápidas) coloca os dois ao lado de **Send** (enviar).

## Conduzir uma resposta com /guided

A sua direção fica fora do personagem. Ela molda a resposta, mas não aparece como mensagem do chat.

1. Digite `/guided` e a sua direção na caixa de mensagem.
2. Pressione <kbd>Enter</kbd> ou clique em **Send**.

O modelo escreve a próxima resposta seguindo a sua direção. Por exemplo:

```text
/guided make him admit he is lying
```

Você pode digitar `/narrator`, `/narrate` ou `/nar` no lugar de `/guided`. Em um chat em grupo, aponte a direção para um personagem com `respond as`, `reply as` ou `respond for`:

```text
/guided respond as Alice make her admit she is lying
```

## Guiar uma regeneração

Isto reaproveita o texto da sua caixa de mensagem como uma direção de uso único para uma regeneração.

1. Abra **Configurações → Conversando → Edição e swipes** e ative **Guiar swipes e novas gerações com a caixa de mensagem**. A opção vem desativada por padrão.
2. Em um chat, digite uma direção na caixa de mensagem, mas não envie.
3. Clique em **Regenerate** (regenerar) na mensagem da IA. Com texto na caixa, o botão se chama **Regenerate (guided)**.

A sua direção continua na caixa depois disso, então você pode ajustá-la e regenerar de novo. Para limpar a caixa em vez disso, desative **Manter a orientação depois de gerar de novo** em **Configurações → Conversando → Caixa de mensagem**.

Se não funcionou: o botão precisa se chamar **Regenerate (guided)**. Se ele diz só **Regenerate**, a configuração está desativada ou a caixa está vazia.

<a id="read-stored-guidance"></a>

## Ler a orientação salva

Marinara salva a direção que moldou uma resposta.

1. Clique no ícone **Stored guidance** (orientação salva), um pergaminho, na mensagem da IA.
2. Uma janela com o título **Stored guidance** mostra a direção.

A janela indica de onde a direção veio: **/guided**, **Guided regenerate** (nova geração guiada) ou **Game start** (início do jogo: a configuração do Game Mode). Para direções de `/guided` e de regeneração guiada, **Copy /guided** (copiar /guided) copia um comando `/guided` pronto para usar, que você pode colar em outro chat.

## Escrever a sua resposta com o Impersonate

O Impersonate faz o modelo escrever a sua próxima mensagem com a voz da sua persona. A persona é o personagem que você interpreta, escrito como `{{user}}`. Veja [Personas do usuário](../characters/personas.md).

Antes de começar: o Impersonate só funciona em chats de Roleplay. No Conversation, você vê "Impersonate is not available in Conversation mode." Ele também não está disponível no Game.

1. Digite `/impersonate` na caixa de mensagem. Se quiser, acrescente uma direção depois dele.
2. Pressione <kbd>Enter</kbd> ou clique em **Send**.

O modelo publica uma mensagem de usuário como a sua persona. Por exemplo, isto escreve uma mensagem que pergunta sobre o tempo:

```text
/impersonate ask about the weather
```

O apelido curto é `/imp`. **Regenerate** funciona em uma mensagem que o Impersonate escreveu, então você pode conseguir outra versão.

Uma mensagem publicada conta como seu turno, então agentes e trackers são executados como em uma mensagem que você digita, a menos que **Pular os agentes** esteja ativado. Escolher uma opção CYOA com **Usar o CYOA como direção** ativado também pede a resposta do personagem logo depois. Para ler e editar a mensagem antes disso, peça ao Impersonate para escrever um rascunho.

### Escrever um rascunho primeiro

O rascunho vai para a caixa de mensagem em vez do chat. Não é salvo e nada é executado até você enviar: nem resposta do personagem, nem agentes, nem trackers, nem mudanças no estado do mundo.

1. Abra **Configurações do chat** em um chat de Roleplay e encontre **Personificar**.
2. Defina **Destino do resultado** como **Rascunho de mensagem**. O padrão é **Publicar**.
3. Digite `/impersonate` e uma orientação, se quiser, e pressione <kbd>Enter</kbd>.

O rascunho aparece aos poucos na caixa de mensagem. Uma linha acima mostra **Escrevendo sua próxima mensagem…** durante a escrita; clique em **Parar** ali ou no botão de parar da caixa para manter o texto já escrito. Quando terminar, edite e clique em **Enviar**. Até enviar, a linha oferece:

| Botão | O que faz |
| --- | --- |
| **Refazer** | Escreve o rascunho de novo com a mesma orientação e substitui o da caixa. |
| **Desfazer** | Descarta o rascunho e restaura o conteúdo anterior da caixa. |

A escrita continua se você mudar de chat ou aba. Ao voltar, o rascunho estará na caixa daquele chat. Cada chat tem seu próprio rascunho.

Para escolher uma vez sem mudar a configuração:

| Comando | O que faz |
| --- | --- |
| `/impersonate_draft` | Escreve um rascunho. Também `/impd` e `/imp_draft`. |
| `/impersonate_post` | Publica a mensagem. Também `/impp` e `/imp_post`. |

Com **Respostas rápidas** ativado, o menu ao lado de **Enviar** também oferece os dois: **Personificar** segue a configuração e a segunda ação faz o contrário. Um rascunho pode começar com a caixa vazia; nesse caso, o modelo escolhe o que você diz.

Com **Usar o CYOA como direção** ativado e **Destino do resultado** em **Rascunho de mensagem**, clicar em uma opção CYOA escreve um rascunho usando essa opção como orientação. As opções continuam na tela até o envio.

### As configurações do Impersonate

Estas configurações se aplicam a todo `/impersonate` em todos os seus chats, janelas e dispositivos. Abra **Configurações do chat** em um chat de Roleplay e encontre **Personificar**. Veja [Configurações do chat](chat-settings.md) para abrir o painel.

| Controle | O que faz |
| --- | --- |
| **Destino do resultado** | **Publicar** adiciona a mensagem imediatamente ao chat. **Rascunho de mensagem** a escreve na caixa para você editar e enviar. Veja [Escrever um rascunho primeiro](#write-a-draft-first). Padrão: **Publicar**. |
| **Prompt Template** (modelo de prompt) | Uma instrução opcional enviada toda vez que você usa o Impersonate. Se ficar vazio, usa o prompt do próprio chat ou o padrão embutido. Ele aceita `{{user}}`, `{{persona_description}}` e `{{impersonate_direction}}`, marcadores que Marinara substitui por texto real. Escolha **Built-in default** (padrão embutido) para ler o padrão. **Copy built-in default to edit** (copiar o padrão embutido para editar) começa uma cópia. **Save as** (salvar como) salva um modelo com nome, e **Delete template** (excluir o modelo) remove um. |
| **Preset** | Um preset de prompt só para as respostas do Impersonate. Padrão: **Use chat default** (usar o padrão do chat). Veja [Presets](../prompts/presets.md). |
| **Connection** (conexão) | O modelo das respostas do Impersonate, por exemplo um mais barato ou mais rápido. Padrão: **Use chat default**. Você também pode escolher **Random** (aleatório). Veja [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md). |
| **Pular os agentes** | Pula os agentes (trackers, roteadores de lorebook e ajudantes semelhantes) durante impersonate. Isso mantém a rapidez e evita mudar o estado do mundo. Desativado por padrão. Um rascunho sempre os pula. Veja [Agentes](../agents/agents-overview.md). |
| **Send Public Faces** (enviar faces públicas) | Nos chats de Roleplay, um personagem com **Public Face** (face pública) aparece no prompt do Impersonate só com o nome e o Public Face, para que a sua resposta saiba apenas o que você poderia saber. Isso substitui tudo o mais que o card envia: Descrição, Personalidade, História do personagem, Aparência, Cenário, Prompt de sistema, diálogo de exemplo, atributos de RPG, Instruções pós-histórico e Prompt de profundidade. Um personagem com Public Face vazio mantém o card completo. As macros que você coloca em um preset ou modelo de prompt do Impersonate, como `{{description}}`, continuam enviando os campos que nomeiam. **Regenerar** mantém a configuração usada para escrever a mensagem. Desativado por padrão. Veja [A aba Card](../characters/creating-and-editing-characters.md#card-tab). |
| **Usar o CYOA como direção** | Clicar em uma opção CYOA (choose your own adventure, escolha a sua própria aventura) usa essa opção como direção do Impersonate em vez de publicá-la. Desativado por padrão. Se **Adicionar as escolhas CYOA à caixa de mensagem em vez de enviá-las** estiver ativado em **Configurações → Conversando → Caixa de mensagem**, um clique só acrescenta o texto à sua caixa de mensagem, e esta configuração não tem efeito. |

### Definir um prompt para um chat

1. Digite `/impersonate_prompt` e o seu prompt entre aspas.
2. Pressione <kbd>Enter</kbd>.

```text
/impersonate_prompt "You will now play as my OC:"
```

Para voltar ao padrão, digite `/impersonate_prompt reset`. O apelido é `/imp_prompt`.

## Adicionar os Quick replies ao lado de Send

Os Quick replies acrescentam alternativas de um clique ao **Send**, para você não precisar digitar um comando de barra.

1. Abra **Configurações → Conversando → Caixa de mensagem**.
2. Ative **Quick replies**. A opção vem desativada por padrão.
3. Expanda a opção para escolher quais ações aparecem. Quando ela está ativada, as três ações vêm ativadas por padrão.

| Ação | O que faz |
| --- | --- |
| **Post only** (só publicar) | Adiciona a mensagem digitada ao chat sem uma resposta. O comando `/send <message>` faz o mesmo. |
| **Guide reply** (guiar a resposta) | Envia o texto digitado como uma direção do `/guided`. |
| **Personificar** | Gera uma resposta da sua persona usando o texto digitado como orientação. Segue **Destino do resultado** e, em Roleplay, uma segunda ação ao lado faz o contrário (**Personificar como rascunho** ou **Personificar e publicar**). Fica oculto nos chats de Conversation. |

Com uma ação ativada, o botão dela fica ao lado de **Send**. Com mais de uma, elas se agrupam em um botão de três pontos (**Quick replies**) que abre um menu.
