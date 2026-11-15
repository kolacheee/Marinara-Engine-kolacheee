# Como gerenciar a lista de chats

Os seus chats ficam na barra lateral à direita, em **Chats**. Clique em **Biblioteca** no canto superior direito para mostrar ou ocultar a barra lateral e escolha **Chats** no seletor no topo dela (o outro lado é **Biblioteca**). No celular ou tablet, toque no botão de pilha no canto superior direito; a barra lateral desliza sobre a página com o mesmo seletor. Use a lista de chats para começar, encontrar, ordenar, organizar e excluir chats.

## A lista de chats e as abas de modo

No topo ficam **Importar**, **Nova pasta**, **Selecionar chats** e **Novo**. No celular, todos menos **Novo** ficam no menu **⋯** ao lado dele. Abaixo deles há três abas de modo, cada uma com a quantidade de chats que contém (no celular, a primeira aparece como **Conversation**). Cada aba lista apenas os chats daquele modo.

| Aba | Modo |
| --- | --- |
| **Convo** | Conversation: um chat no estilo de aplicativo de mensagens. |
| **Roleplay** | Roleplay: uma cena com personagens e acompanhamento do mundo. |
| **Game** | Game: um RPG para um só jogador, conduzido pela IA. |

Cada linha mostra o nome do chat e os avatares dos personagens dele. Nos chats de Conversation, um ponto colorido em um avatar mostra o status daquele personagem. Um selo vermelho é a quantidade de mensagens não lidas. Uma linha com um pequeno ícone de ramificação e um número é um chat com várias ramificações, agrupadas em uma só linha. Veja [Ramificações de chat](branches.md). No computador, apontar o mouse para uma linha mostra uma prévia do chat e os botões **Renomear chat** e **Tags do chat**.

Os chats fixados ficam no início da lista. Para fixar um, clique nele com o botão direito (ou deslize-o para a esquerda em uma tela sensível ao toque) e escolha **Fixar**.

## Começar um chat

Antes de começar: adicione pelo menos uma conta em **Connections** (Conexões). Veja [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md).

1. Clique na aba do modo que você quer.
2. Clique em **Novo** no topo da lista. A dica do botão é **Nova conversa**, **Novo roleplay** ou **Novo jogo**, conforme a aba. Você também pode começar um em **Conversation**, **Roleplay** ou **Game** na tela inicial.

Marinara cria e abre o chat. **Chat Settings** (configurações do chat) e um assistente de configuração abrem ao lado dele. Até você terminar a configuração, o chat fica fora da lista. Se você sair da configuração e escolher mantê-lo, ele aparece como **Configuração não concluída**, para você voltar depois. O chat começa com o nome **New Conversation**, **New Roleplay** ou **New Game**. Se você salvou um perfil de configurações padrão marcado com estrela para Conversation ou Roleplay, Marinara o aplica ao chat novo. Veja [Perfis de configurações](settings-profiles.md).

Se não funcionou: sem nenhuma conta salva, a janela **Add account** (adicionar conta) abre no lugar de um chat. Escolha um serviço, clique em **Connect** (conectar) e depois escolha um modelo. O passo a passo completo está em [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md).

## Importar um chat

Você pode importar um registro de chat `.jsonl` do SillyTavern ou do Marinara.

1. Clique na aba do modo em que o chat deve entrar.
2. Clique no botão **Importar** (a seta de download) no topo da lista. O rótulo dele é **Importar JSONL de chat do SillyTavern ou do Marinara**.
3. Escolha o seu arquivo `.jsonl`.

Marinara cria o chat, abre-o e mostra **Imported N messages**. Para os formatos de exportação e a exportação em lote, veja [Exportar e importar chats](export-import.md).

Se não funcionou: uma mensagem pequena na parte de baixo da tela diz **Import failed**, com o motivo. Só arquivos `.jsonl` são aceitos.

## Renomear um chat

O nome do chat é só para você. Ele não é enviado ao modelo.

1. Abra o chat e depois abra **Chat Settings**.
2. Em **Chat Name** (nome do chat), clique no nome atual.
3. Digite o nome novo e pressione <kbd>Enter</kbd> ou clique na marca de seleção.

Veja [Chat Settings](chat-settings.md) para saber como abrir o painel.

<a id="delete-a-chat"></a>

## Excluir um chat

1. Clique com o botão direito na linha do chat e escolha **Excluir**. Em uma tela sensível ao toque, deslize a linha para a esquerda, ou pressione e segure, e toque em **Excluir**.
2. Na caixa de diálogo **Delete Chat** (excluir chat), clique em **Delete** (excluir).

A exclusão é definitiva. Ela também interrompe qualquer resposta que ainda esteja sendo escrita para aquele chat. Para excluir vários de uma vez, veja [Como selecionar vários chats](#selecting-multiple-chats).

Se o chat tiver várias ramificações, a caixa de diálogo diz quantas são e oferece duas opções:

- **Delete This Branch Only** (excluir só esta ramificação) remove a ramificação em que você clicou.
- **Delete All N branches** (excluir todas as N ramificações) remove todas as ramificações do grupo.

Para gerenciar as ramificações sem excluir o chat, veja [Ramificações de chat](branches.md).

A configuração geral do aplicativo **Confirm before deleting** (confirmar antes de excluir) controla essas caixas de diálogo. Ela vem ativada por padrão e fica em **Configurações → Geral → Confirmações e ajuda**.

## Pastas de chats

As pastas agrupam chats dentro de uma aba de modo.

1. Abra uma aba que tenha pelo menos um chat.
2. Clique em **Nova pasta** (o botão de pasta no topo da lista). A pasta recebe o nome **unnamed** (depois **unnamed 2**, **unnamed 3**).

| Para fazer isto | Faça isto |
| --- | --- |
| Renomear uma pasta | Dê um clique duplo ou um toque duplo nela, ou coloque o foco nela e pressione <kbd>F2</kbd>. Um nome vazio é ignorado. |
| Excluir uma pasta | Clique no botão de lixeira na linha da pasta. Uma caixa de diálogo **Delete Folder** (excluir a pasta) aparece quando a pasta tem chats. Os chats vão para o nível principal e não são excluídos. |
| Reordenar as pastas | Arraste uma pasta para cima ou para baixo. O menu de ordenação passa para **Custom** (personalizado). |
| Mover um chat para uma pasta | Arraste a linha do chat até a pasta. Em tela sensível ao toque, primeiro pressione e segure o chat por cerca de meio segundo. |
| Tirar um chat de uma pasta | Arraste o chat até a área vazia abaixo das pastas. |

Com vários chats selecionados, arrastar um deles move a seleção inteira. Os chats que estão fora das pastas aparecem abaixo das pastas.

## Buscar, ordenar e filtrar

### Encontrar um chat pelo nome

Cada aba tem uma caixa de busca. O texto de exemplo dela é **Search conversations**, **Search roleplays** ou **Search games**. Digite uma palavra. A busca considera os nomes dos chats, as tags e os nomes dos personagens, não o texto das mensagens.

### Filtrar por tag

Clique em **Tags** (o botão de tag ao lado da caixa de busca). Escolha uma ou mais tags, ou **Sem tags**. O botão mostra quantas você escolheu. Um chat e suas ramificações contam uma vez. Adicione tags a um chat com **Tags do chat** na linha dele, ou **Tags** no menu aberto com o botão direito ou com um swipe.

### Encontrar uma mensagem em todos os chats

Pressione <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> no Mac), ou procure esse recurso pelo botão de busca na barra superior. Ele busca em todos os chats e pode filtrar por modo, personagem, remetente e data.

### Ordenar

O menu de ordenação (**Sort chats**) tem estas opções:

| Opção | Ordem |
| --- | --- |
| **Custom** | A ordem das suas pastas. |
| **Manual order** (ordem manual) | Os chats na ordem em que você os arrasta. Pelo teclado, coloque o foco em um chat e pressione <kbd>Alt</kbd>+<kbd>Up</kbd> ou <kbd>Alt</kbd>+<kbd>Down</kbd>. |
| **Recent** (recentes) | A atividade mais recente primeiro. Este é o padrão. |
| **Newest** (mais novos) | Os criados mais recentemente primeiro. |
| **Oldest** (mais antigos) | Os mais antigos primeiro. |
| **A a Z** e **Z a A** | Por nome. |

A lista mostra 40 chats no início e acrescenta os próximos 40 conforme você rola para perto do fim.

## Quando a lista é atualizada

Para manter o aplicativo rápido, a lista de chats não recarrega o tempo todo:

- Ela é atualizada na hora quando você cria, altera ou exclui um chat neste dispositivo.
- As mudanças de outro dispositivo (um chat que você começou no celular, por exemplo) aparecem quando você volta ao aplicativo depois de usar outro aplicativo ou outra aba do navegador: a lista é atualizada uma vez nesse momento.
- O servidor não consegue enviar mudanças automaticamente ao dispositivo. Se dois dispositivos estiverem abertos lado a lado, saia do aplicativo e volte para ver as mudanças do outro.

<a id="selecting-multiple-chats"></a>

## Como selecionar vários chats

1. Clique no botão de marca de seleção, **Select chats** (selecionar chats), no topo da lista.
2. Clique em cada chat que você quer. As linhas mostram uma caixa de seleção em vez de abrir o chat.
3. Use a barra na parte de baixo, que mostra quantos chats estão selecionados.

**Export** (exportar) baixa os chats selecionados como um único arquivo `.zip` com arquivos `.jsonl`. **Delete** pede a sua confirmação em uma caixa de diálogo **Delete Chats** (excluir chats) e depois remove os chats. Clique de novo no botão de marca de seleção para sair do modo de seleção. Trocar de aba também limpa a seleção.

## Chats recentes na tela inicial

A tela inicial tem um widget **Recent chats** (chats recentes) com os seus chats mais recentes. Cada um mostra o nome, um selo do modo e a última mensagem. Clique em um chat para abri-lo. Sem nenhum chat, o widget mostra **Your chats will show here** (os seus chats vão aparecer aqui). Veja [Widgets da tela inicial](../home/welcome.md#home-widgets).
