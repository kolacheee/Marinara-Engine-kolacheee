# Primeiros passos com Marinara Engine

Marinara Engine é um aplicativo para conversar e fazer roleplay com personagens de IA. Ele roda no seu próprio computador. Este guia mostra a tela inicial e os passos até o seu primeiro chat.

## Comece o seu primeiro chat

Antes de começar: você precisa de uma chave de API (um código secreto, parecido com uma senha) de um serviço de IA, ou do **Built-in model** (modelo embutido) descrito abaixo.

1. Instale Marinara Engine e abra o aplicativo no navegador. Escolha a sua plataforma em [Instalação do Marinara Engine](../INSTALLATION.md).
2. Adicione uma conexão: uma chave de API de um serviço de IA, ou o **Built-in model**. Veja [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md).
3. Escolha os modelos que a conexão deve usar. O mesmo guia mostra como.
4. Crie ou importe um personagem. Abra **Library → Characters** (Biblioteca → Personagens; clique em **Library** no canto superior direito) e clique em **New character** (novo personagem), ou clique em **Import** para trazer um card de um arquivo. Veja [Criando e editando personagens](../characters/creating-and-editing-characters.md).
5. Clique em **Conversation**, **Roleplay** ou **Game** na tela inicial. Ou abra os seus chats: clique em **Library** no canto superior direito, escolha **Chats** no topo da barra lateral, escolha a aba **Convo**, **Roleplay** ou **Game** e clique em **New**.
6. A página de configuração abre na nova aba. Escolha um personagem e a opção de **Conteúdo**, depois clique em **Iniciar roleplay** (ou **Começar a conversar** para um Conversation, **Criar mundo** para um Game).

O que você vê: o chat novo se abre, e você pode escrever a sua primeira mensagem.

Se você ainda não tiver nenhuma conexão, Marinara abre primeiro a janela de adicionar conexão.

Marinara não inclui uma IA online. A maioria das pessoas se conecta a um serviço online. Você também pode baixar o **Built-in model**, um modelo pequeno que roda no seu computador sem chave de API. Ele serve para tarefas auxiliares leves, não para o seu chat principal. Veja [Como configurar o Built-in model](../connections/local-model.md).

Na primeira vez que você abre Marinara, começa um tour guiado curto. Veja [O tutorial da primeira vez](tutorial.md). Travou em algum passo? Pergunte à Professor Mari, a assistente integrada: [Professor Mari, a assistente dentro do aplicativo](professor-mari.md).

## Como se orientar

Marinara tem dois lugares fixos, que ficam na mesma posição seja qual for o tema que você use:

- **A barra superior.** À esquerda, **Home** (Tela inicial) e uma aba para cada chat, personagem ou página que você abre. À direita, o botão de busca (ou <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>⌘</kbd>+<kbd>K</kbd> no Mac) encontra ou abre qualquer coisa: um chat, um personagem, uma configuração, um guia ou uma pergunta para a Professor Mari. Ao lado ficam **Chat settings** (Configurações do chat) enquanto um chat está aberto, **Docs** (Documentação) para estes guias e **Library**, que mostra ou esconde a barra lateral.
- **A barra lateral** à direita, com um seletor **Chats | Library** no topo. **Chats** lista os seus chats nas abas **Convo**, **Roleplay** e **Game** (veja [Como gerenciar a lista de chats](../chats/managing-chats.md)). **Library** lista **Characters**, **Personas**, **Lorebooks**, **Presets**, **Regex scripts** (scripts Regex), **Connections**, **Agents** e **Custom tools** (ferramentas personalizadas), seguidos de **Settings** e **Extensions**. Escolha um item para abrir a página dele no meio.

No computador, você também pode mostrar duas páginas lado a lado. Veja [Visualização dividida](tabs-and-drafts.md#split-view-two-pages-at-once).

No celular ou no tablet, **Home** fica no canto superior esquerdo e **Library** (o botão de pilha) no canto superior direito. Library desliza a barra lateral sobre a página, com o mesmo seletor **Chats | Library**; a visualização Library tem **Settings**, **Docs** e **All Tabs** (todas as abas) na parte de baixo. Toque no título na barra superior para buscar e no botão com um número para ver as abas abertas. Veja [Abas, visualização dividida e alterações não salvas](tabs-and-drafts.md) e [Gestos de toque](../chats/messages.md#touch-gestures).

## A tela inicial em resumo

A tela inicial aparece quando nenhum chat está aberto. No topo ficam uma saudação, o número da versão e **Conversation**, **Roleplay** e **Game**, que começam cada um um chat novo nesse modo. Se nenhum modelo estiver configurado ainda, **Connect a model to start chatting** (conecte um modelo para começar a conversar) abre a página de Conexões. **Professor** abre a Professor Mari em uma aba própria, um aplicativo instalado (como Story Writer) também acrescenta um botão aqui, e **Widgets** organiza os cartões abaixo.

No layout clássico (com **Settings → Appearance → Theme → New layout** (Configurações → Aparência → Tema → Novo layout) desativado), a tela inicial lembra um navegador da web, com abas, uma barra de busca e favoritos para **Discord**, **Support**, **Credits**, **Documentation**, **Tutorial**, **FAQ**, **Achievements** e **Widgets**.

<a id="choose-a-chat-mode"></a>

## Escolha um modo de chat

Você escolhe um modo ao começar um chat.

- **Conversation**: um chat simples com a IA, com visual de aplicativo de mensagens. Veja [Conversation Mode: primeiros passos](../conversation/getting-started.md).
- **Roleplay**: uma história com um ou mais personagens. O aplicativo acompanha a cena, como o lugar e a hora. Veja [Roleplay Mode: primeiros passos](../roleplay/getting-started.md).
- **Game**: um jogo para um jogador. A IA faz o papel do Game Master, que conta a história. Você tem um grupo de companheiros (a equipe), rolagens de dados, mapas e missões. Veja [Game Mode: primeiros passos](../game/getting-started.md).

<a id="home-widgets"></a>

## Widgets da tela inicial

Widgets são pequenos cartões que você pode mostrar, esconder e mover.

1. Clique em **Widgets** na tela inicial. A janela **Home Widgets** (widgets da tela inicial) se abre. Ela lista os widgets em **Built-in** (integrados), **Agents** (agentes) e **Personal** (pessoais).
2. Clique no botão de olho ao lado de um widget para mostrá-lo ou escondê-lo. Um widget que você volta a mostrar vai para o primeiro lugar livre da tela inicial.
3. Para mover um widget, arraste a alça no canto superior direito dele. No computador, a alça aparece quando você aponta para o widget.

O seu layout fica salvo neste navegador. Os widgets pessoais também têm botões para editá-los ou excluí-los. No layout clássico, **Browser chrome** (moldura do navegador), na parte de baixo da janela, tem um botão liga/desliga: **Show URL bar** (mostrar a barra de endereço) mostra ou esconde a barra de busca da tela inicial no computador.

A Professor Mari pode criar um widget pessoal para você, se você pedir. Os agentes instalados também podem acrescentar widgets.

## Referência: widgets integrados

| Widget | O que faz | Aparece no início |
| --- | --- | --- |
| **Professor Mari** | **Ask Professor Mari** (falar com a Professor Mari) abre o chat dela. | Sim |
| **Recent chats** (chats recentes) | Os seus chats mais recentes. Clique em um para reabri-lo. Vazio: **Your chats will show here** (os seus chats vão aparecer aqui). | Sim |
| **Things to try** (Coisas para experimentar) | As próximas três pequenas tarefas para experimentar, um recurso por vez. Quando você experimenta todas ou desativa as dicas, mostra **Documentation**, **Replay tutorial** (repetir o tutorial) e **Read FAQ** (ler o FAQ). Veja [Coisas para experimentar](#things-to-try). | Sim |
| **What's New** (novidades) | **See what's new** (ver as novidades) e **Read release notes** (ler as notas de versão). | Sim |
| **Community** (comunidade) | Links para **Discord**, **Support** e **Credits**. | Sim |
| **Character Library** (biblioteca de personagens) | Uma seleção nova dos seus personagens a cada dia. | Não |
| **Discovery desk** (mesa de descobertas) | Agentes que você ainda não instalou. **Browse agents** (navegar pelos agentes) abre o catálogo. | Não |
| **Character of the Day** (personagem do dia) | Um personagem da sua biblioteca, com **Start a chat** (começar um chat) e **View character** (ver o personagem). | Não |
| **Clock & calendar** (relógio e calendário) | A data e a hora de hoje. | Não |
| **Achievements** (conquistas) | As suas conquistas mais recentes e as mais perto de sair. Precisa da configuração Achievements ativada. | Não |

## Coisas para experimentar

O widget **Things to try** sugere os próximos três recursos para experimentar. Cada tarefa parte da anterior: uma imagem da galeria vira um adesivo, e o adesivo é enviado em um chat.

- Clique em uma tarefa para abrir o lugar correspondente no aplicativo. Se ela não tiver um lugar, o guia dela se abre.
- Clique na marca de seleção para concluí-la ou no X para pulá-la. Uma tarefa pulada nunca aparece de novo.
- A maioria das tarefas se marca automaticamente quando Marinara vê que você as fez, como um chat naquele modo ou uma etiqueta de adesivo. Marque as outras por conta própria.
- **See all** (ver tudo) lista todas as tarefas por trilha, com **Show me** (mostre-me). As tarefas de uma trilha aparecem quando aquelas das quais dependem estão concluídas. As trilhas em **Only in this layout** (só neste layout) cobrem recursos do novo layout.
- Concluir uma trilha desbloqueia a conquista **Explorer** (Explorador) dela.

O widget segue **Feature tips** (Dicas de recursos) em **Settings > General > Confirmations & Help** (Configurações > Geral > Confirmações e ajuda). Com as dicas desativadas, ele mostra os links dos guias. O progresso fica salvo neste navegador.

### Noções básicas de IA e Aprofundamentos

**Ver todos** tem mais duas abas:

- **Noções básicas de IA**: um tour curto para quem está começando com IA. Explica o que é um modelo, os tipos que Marinara usa, tokens e contexto, e ajuda você a configurar um modelo se quiser (essa etapa pode ser pulada). Termina com a Professor Mari. O tour é oferecido uma vez, em uma janela pequena depois do tutorial de boas-vindas. Veja [Noções básicas de IA](ai-basics.md).
- **Aprofundamentos**: configurações em que a escolha não é óbvia e recursos que pouca gente encontra, como CSS nas Notas do criador de um card. Os grupos que você mais usa aparecem primeiro.

Cada item abre o guia no trecho relevante, em destaque, com um cartão abaixo que o explica em palavras simples. Clique em **Entendi** para marcar o item como concluído; em Noções básicas de IA, isso abre a próxima parada. Depois que você termina a trilha Essencial, a última linha do widget sugere um aprofundamento. Concluir Noções básicas de IA ou um grupo de aprofundamentos desbloqueia uma conquista da categoria **Explorador**, e concluir todos os aprofundamentos desbloqueia mais uma. A janela que oferece o tour também segue a configuração **Dicas de recursos**.

## Onde buscar ajuda

- Pergunte à Professor Mari na tela inicial.
- Abra **See all** no widget **Things to try** e depois **Read FAQ** para respostas rápidas.
- Clique em **Docs** na barra superior para ler os guias dentro do aplicativo.
- Clique em **Discord** no widget **Community** para falar com a comunidade, ou em **Support** para apoiar o projeto.

Se algo estiver quebrado, veja [Solução de problemas do Marinara Engine](../TROUBLESHOOTING.md).

## Guias relacionados

- [Instalação do Marinara Engine](../INSTALLATION.md)
- [Conectando a um provedor de IA](../connections/connecting-to-a-provider.md)
- [Criando e editando personagens](../characters/creating-and-editing-characters.md)
- [O tutorial da primeira vez](tutorial.md)
- [Abas, visualização dividida e alterações não salvas](tabs-and-drafts.md)
- [Professor Mari, a assistente dentro do aplicativo](professor-mari.md)
