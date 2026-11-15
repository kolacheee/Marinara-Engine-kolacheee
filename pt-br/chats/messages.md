# Ações de mensagem: editar, excluir, swipe e regenerar

Toda mensagem, sua ou da IA, tem uma barra de ferramentas. Use-a para editar, excluir, regenerar ou ocultar uma mensagem, ou para criar uma ramificação a partir dela.

No computador, aponte o mouse para uma mensagem para ver a barra de ferramentas. No celular ou tablet, pressione e segure uma mensagem: as mesmas ações abrem em um painel.

## A barra de ferramentas da mensagem

Os mais usados:

- **Edit** (editar) muda o texto da mensagem.
- **Regenerate** (regenerar) pede ao modelo uma nova versão de uma resposta da IA. Cada versão se chama swipe.
- **Delete** (excluir) remove a mensagem.

Os botões são ícones. Os nomes deles estão abaixo. Alguns só aparecem em certas situações.

| Botão | O que faz |
| --- | --- |
| **Copy** (copiar) | Copia o texto da mensagem. |
| **Edit** | Abre a mensagem para edição. |
| **Regenerate** | Cria um novo swipe (outra versão da resposta). Só em mensagens da IA. Também nas suas mensagens no Roleplay e nas suas mensagens do Impersonate no Conversation. |
| **Delete** | Exclui a mensagem. |
| **Translate** / **Hide translation** (traduzir / ocultar a tradução) | Traduz a mensagem para o seu idioma e depois esconde a tradução. |
| **Add reaction** (adicionar reação) | Abre um seletor de emoji. Só no Conversation. |
| **Hide from AI** / **Unhide from AI** (ocultar da IA / mostrar para a IA) | Interrompe ou retoma o envio desta mensagem para o modelo. Em um chat em grupo de Roleplay, abre um seletor de personagens. |
| **Bookmark, pin or note** (marcar, fixar ou adicionar nota) | Marca a mensagem como favorita, fixa a mensagem para que ela continue no prompt além do limite do histórico (até 10 por chat) ou adiciona uma **Private note** (nota privada). O modelo nunca vê uma nota, a menos que você ative **Show the note to the narrator character** (mostrar a nota ao personagem narrador), que funciona em chats com um só personagem e em chats em grupo com respostas individuais. |
| **Branch from here** (ramificar a partir daqui) | Copia o chat até esta mensagem para uma nova ramificação. Não aparece em chats de cena. |
| **Clone from here** (clonar a partir daqui) | Copia um chat de cena até esta mensagem para um novo Roleplay. Só em chats de cena. |
| **Peek prompt** (espiar o prompt) | Mostra o prompt exato desta resposta. Só na mensagem mais recente da IA. |
| **Stored guidance** (orientação salva) | Mostra a direção que guiou esta resposta. Só em respostas feitas com orientação ou com o Impersonate. |
| **View model thoughts** (ver o raciocínio do modelo) | Abre o raciocínio oculto do modelo. Só se o modelo devolveu o raciocínio. |
| **Show original before rewrite** / **Show rewritten version** (mostrar o original antes da reescrita / mostrar a versão reescrita) | Alterna entre o texto original e o reescrito quando um agente (um ajudante que roda junto com as respostas) reescreveu a mensagem. |
| **Mark as new start** (marcar como novo início) | Só no Roleplay. Faz a memória do modelo sobre o chat começar nesta mensagem, quando o Advanced Memory (o recurso de memória de longo prazo do Marinara) está ativado. Veja [Advanced Memory](../agents/memory.md). |
| **Pause speaking** / **Resume speaking** / **Restart speaking** (pausar / retomar / reiniciar a fala) | Controla o áudio falado quando o Text to Speech (uma voz lê as mensagens em voz alta) está ativado e falando. |

Saiba mais: [Peek Prompt](peek-prompt.md), [Ramificações de chat](branches.md), [Cenas](../roleplay/scenes.md) (um chat de cena é um Roleplay curto ramificado a partir de um chat), [Tradução de mensagens](../integrations/message-translation.md), [Configuração de Text to Speech (TTS)](../media/tts-setup.md), [Geração guiada e Impersonate](guided-and-impersonate.md), [notas privadas](../roleplay/getting-started.md#your-private-notes).

## Editar uma mensagem

1. Clique em **Edit** na mensagem. O texto vira uma caixa editável.
2. Altere o texto.
3. Clique em **Save** (salvar) ou pressione <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (<kbd>Cmd</kbd>+<kbd>Enter</kbd> no Mac).
4. Para sair sem salvar, clique em **Cancel** (cancelar) ou pressione <kbd>Esc</kbd>.

Duas configurações em **Configurações → Conversando → Edição e swipes** abrem a edição mais rápido. As duas vêm ativadas por padrão.

- **Up Arrow edits last message** (seta para cima edita a última mensagem): pressione <kbd>Up</kbd> com a caixa de entrada vazia.
- **Double-click edits messages** (clique duplo edita as mensagens): dê um clique duplo ou um toque duplo em uma mensagem de Roleplay.

## Excluir uma mensagem

1. Clique em **Delete** na mensagem. A caixa de diálogo **Delete message** (excluir mensagem) abre.
2. Escolha uma opção.

| Opção | O que faz |
| --- | --- |
| **Delete only this swipe (1/3)** | Remove o swipe que você está vendo. Só aparece quando há mais de um swipe. |
| **Delete all other swipes** | Mantém o swipe que você está vendo e remove os outros. Só aparece quando há mais de um swipe. |
| **Delete this message** | Remove a mensagem e todos os swipes dela. |
| **Delete more** | Seleciona esta mensagem e todas as que estão abaixo dela e abre a barra de seleção. |
| **Cancel** | Fecha a caixa de diálogo. |

Na barra de seleção, clique nas mensagens para adicioná-las. **Select all messages above** (selecionar todas as mensagens acima) e **Select all messages below** (selecionar todas as mensagens abaixo) ampliam a seleção. **Unselect all** (desmarcar todas) limpa a seleção, e **Delete selected** (excluir selecionadas) remove as que restam selecionadas. A barra mostra quantas estão selecionadas.

Mensagens do sistema, como uma linha "joined the chat", são excluídas com um clique, sem caixa de diálogo.

## Swipes: respostas alternativas

Um swipe é uma versão de uma resposta da IA. Uma mensagem pode guardar vários, então você compara as respostas e fica com a que preferir. Um controle de swipe aparece assim que a mensagem tem dois ou mais. Ele mostra o swipe ativo e o total, por exemplo "2/4".

- **Previous swipe** (swipe anterior) e **Next swipe** (próximo swipe) passam de um swipe para outro.
- A caixa numérica vai direto até um swipe. Digite um número e pressione <kbd>Enter</kbd>. O rótulo dela é **Jump to swipe 1-N**.
- No swipe mais novo, o botão de avançar vira **Generate next swipe** (gerar o próximo swipe) e cria um novo swipe.

Não é possível excluir o último swipe. O aplicativo avisa "Cannot delete the last remaining swipe". Use **Delete this message** no lugar.

## Gestos de toque

No novo layout no celular ou tablet, swipes e toques longos substituem os botões que aparecem ao passar o mouse no computador.

- **Deslize a resposta mais recente** para a esquerda ou para a direita para trocar entre os swipes dela. Deslizar para a esquerda além do último mostra a pergunta "Gerar uma nova resposta?" antes de gerar uma, porque uma nova resposta custa uma requisição.
- **Deslize o título** na barra superior para a esquerda ou para a direita para trocar entre as abas abertas. A tela inicial conta como a aba anterior à primeira. Isso funciona no layout de celular, que um tablet usa na vertical; na horizontal, o tablet mostra a barra de abas.
- **Deslize um chat** na lista de chats para a esquerda para mostrar **Fixar**, **Renomear**, **Tags** e **Excluir**.
- **Pressione e segure uma mensagem** para ver as ações dela: Regenerar, Editar, Copiar, Ramificar e as demais.
- **Pressione e segure um chat** na lista de chats para ver as mesmas ações.

Desative os swipes com **Gestos de swipe em telas sensíveis ao toque** em Configurações > Conversando > Edição e swipes. O toque longo continua funcionando em qualquer caso.

Na primeira vez que Marinara abre em um celular, tablet ou computador, um tutorial curto mostra onde as coisas ficam naquele tipo de dispositivo, incluindo esses gestos nas telas sensíveis ao toque. Cada modo de chat também mostra dicas na primeira vez que abre ali. Repita qualquer um deles em Configurações > Geral > Tutoriais.

## Regenerar, continuar e tentar de novo

Estas três ações parecem iguais, mas fazem coisas diferentes.

| Ação | Resultado |
| --- | --- |
| **Regenerate** | Um novo swipe. O original é mantido. Em tela sensível ao toque, o aplicativo primeiro pergunta "Regenerate this message as a new swipe?". Com uma orientação preparada, o botão passa a dizer **Regenerate (guided)**. |
| `/continue` | Mais texto na mesma mensagem, sem um novo swipe. |
| **Send** (enviar) com a caixa vazia | Uma resposta nova. |

### Continuar uma resposta

Digite `/continue` (ou `/cont`) na caixa de entrada e envie. O modelo retoma de onde a última resposta parou.

```text
/continue
```

Marinara insere uma linha em branco antes do texto novo. Para que ele fique grudado no último caractere, desative **Configurações → Conversando → Respostas → Adicionar uma nova linha antes do texto de /continue**.

### Tentar de novo com um Send vazio

Se a última mensagem for sua e a caixa de entrada estiver vazia, **Send** tenta de novo em vez de enviar. No Roleplay, um **Send** com a caixa vazia também começa um novo turno depois que a IA já respondeu. Ele nunca acrescenta texto à resposta anterior. Veja [Enviar mensagens e streaming](sending-and-streaming.md#retry-without-retyping).

## Ocultar uma mensagem da IA

Clique em **Hide from AI** para deixar uma mensagem fora do prompt nos turnos seguintes. A mensagem continua visível para você, com a etiqueta **Hidden from AI** (oculto da IA). Clique em **Unhide from AI** para voltar a enviá-la.

Em um chat em grupo de Roleplay, **Hide from AI** abre um seletor de avatares. Escolha o avatar do grupo para ocultar a mensagem de todo mundo, ou escolha um ou mais personagens para ocultá-la só deles. Um marcador de olho riscado na mensagem mostra quem não consegue vê-la. Em um chat com um só personagem, o botão oculta ou mostra a mensagem diretamente.

Se você ocultar uma mensagem de um personagem, ele ainda recebe um sussurro que estiver nela, mas nada do restante. Ocultar de todo mundo também remove os sussurros. Veja [Sussurros e segredos](../roleplay/getting-started.md#whispers-and-secrets).

Para ocultar um intervalo de mensagens, use `/hide` e `/unhide`. Veja [Referência de comandos de barra](slash-commands.md). A numeração das mensagens começa em 1, na primeira mensagem.

Quando a opção **Decide who sees new messages** (decidir quem vê as novas mensagens) do Advanced Memory está ativada, as novas mensagens de um chat em grupo em que os personagens respondem um de cada vez ficam ocultas automaticamente dos personagens ausentes. A sua própria escolha sempre prevalece. Veja [Decidir quem vê as novas mensagens](../agents/memory.md#deciding-who-sees-new-messages).

<a id="message-display-toggles"></a>

## Botões de exibição das mensagens

Eles ficam em **Configurações → Conversando → Informações da mensagem**.

| Botão liga/desliga | Padrão | O que mostra |
| --- | --- | --- |
| **Show message numbers** | Desligado | Um número em cada mensagem, os mesmos números que `/goto`, `/hide` e `/unhide` usam. |
| **Show token usage on messages** | Desligado | Os tokens do prompt e os da resposta, em cada resposta da IA (tokens são pedacinhos de texto que o modelo conta), além dos acertos de cache e do tempo da resposta quando disponíveis. |
| **Show model name on messages** | Desligado | O modelo que escreveu cada resposta. |
| **Show "older messages not sent" note** | Ligado | Um aviso abaixo da resposta, por exemplo "1109 older messages not sent", quando as mensagens mais antigas não couberam no prompt. Os avisos sobre uma resposta cortada ou vazia sempre aparecem. |
