# Organizando as conexões

Neste guia você aprende a manter as contas e os modelos em ordem na página **Conexões** (**Biblioteca → Conexões**): dar estrela, ordenar, editar, remover, Shuffle, pastas e exportação. Para adicionar uma conta, veja [Conectando a um provedor de IA](connecting-to-a-provider.md).

## A lista de contas

Abaixo da caixa **Padrões**, a página lista as suas contas em uma tabela com as colunas **Modelos**, **Status** e **Saldo**. **Neste dispositivo** contém o [modelo embutido](local-model.md). Clique em uma conta para mostrar os modelos salvos abaixo dela e clique de novo para recolhê-los. Uma linha de modelo mostra o nome e selos como a tarefa que ele faz (**Principal**, **Agentes**, **Imagens**), **Configurações personalizadas**, o preço ou **Plano**, para os modelos incluídos em uma assinatura. Uma conta local ou auto-hospedada também pode listar **Padrão**, com o texto "Whatever model the server has loaded" e sem estrela. Veja [Usar qualquer modelo que o servidor tenha carregado](local-self-hosted.md#use-whatever-model-the-server-has-loaded).

Acima da tabela:

- **Todos os tipos** limita a lista a contas de **Chat**, **Imagens**, **Vídeo** ou **Voz**.
- **Buscar contas e modelos** filtra a lista conforme você digita.
- O menu de ordenação oferece **Ordenar: Nome**, **Ordenar: Mais modelos** e **Ordenar: Alterados recentemente**.

Algumas contas alcançam modelos de vários criadores, como o NanoGPT ou um proxy. Os modelos delas ficam agrupados em títulos como **via NanoGPT**.

### Ações da conta

Clique em **⋯** na linha de uma conta:

| Ação | O que faz |
| --- | --- |
| **Editar conta** | Abre as configurações dela: **Nome**, **Endereço**, **Chave de API**, **Usar esta conta** (desative sem excluir a conta), **Testar conta**, **Uso e saldo** e **Mais opções**, com **Requisições por minuto** e **Requisições paralelas**. **Excluir** também fica aqui. |
| **Replace key** (substituir a chave) | Cola uma chave nova. Se a chave antiga está em outras contas, Marinara pergunta se deve atualizar essas contas também. |
| **Add model** (adicionar modelo) | Abre a lista de modelos da conta. |

Para excluir uma conta, abra **Editar conta** e clique em **Excluir**. Marinara pede confirmação e lista o que usa os modelos dela, em **Used by** (usado por): chats, agentes, modelos e tarefas. Clique em **Delete with its N models** (excluir com os N modelos dela) para remover a conta e os modelos dela. Esses chats e essas tarefas passam a precisar de outro modelo. Se um modelo não puder ser removido, o editor lista esse modelo em **This account still has models. Remove these first:**. Abra cada um e remova-o.

### Ícones dos provedores

Cada conta mostra o ícone do serviço dela. Os ícones vêm com Marinara e nunca são carregados da internet. Um endereço personalizado mostra o ícone de um servidor ou gateway conhecido quando o endereço ou o nome contém um deles, como Ollama, LM Studio, KoboldCpp, Bifrost ou LiteLLM. Caso contrário, mostra a primeira letra do nome. No layout clássico, você pode escolher uma imagem sua: clique na imagem de uma conta e escolha o logotipo de um serviço, envie uma imagem ou use letras.

## Modelos com estrela

A estrela marca os modelos que você quer encontrar rápido. Os modelos com estrela aparecem em **Starred** (com estrela), perto do topo de todo seletor de modelos. Isso vale para as janelas **Model for** (modelo para) da caixa **Padrões**, para o **Model for this chat** e para os campos de modelo em **Chat Settings** (configurações do chat) e no editor de agente.

Para dar estrela a um modelo, clique na estrela da linha dele ou na lista **Adicionar modelo** da conta. Dar uma tarefa a um modelo também o salva.

Para tirar a estrela de um modelo, clique na estrela de novo. Marinara remove o modelo e mostra **Undo** (desfazer) por alguns segundos. O modelo fica, sem a estrela, quando um chat o usa, quando ele tem uma tarefa em **Padrões**, quando tem configurações próprias ou quando é o último modelo da conta. A mensagem informa o motivo.

## Editar e remover um modelo

Clique na linha de um modelo para abrir **Editar modelo**, com todas as configurações dele. **Exportar modelo** salva o modelo em um arquivo (veja [Exportar e importar](#export-and-import)). Para dar uma tarefa a um modelo, clique nessa tarefa na caixa **Padrões** e escolha o modelo ali.

No computador, você pode arrastar a linha de um modelo para cima de um chat para usar aquele modelo no chat.

### Ações do modelo

Clique em **⋯** no fim da linha de um modelo ou clique com o botão direito na linha:

| Ação | O que faz |
| --- | --- |
| **Editar modelo** | Abre as configurações do modelo. |
| **Tornar padrão para…** | Dá uma tarefa ao modelo, o mesmo que escolhê-lo em **Padrões**. Uma marca de seleção mostra as tarefas que ele já tem. |
| **Mover para a conta…** | Move o modelo para outra conta. Ele passa a usar a chave daquela conta. O nome, a imagem, as tarefas e os chats dele vão junto, e as opções do serviço voltam ao padrão. |
| **Mover para uma pasta** | Coloca o modelo em uma pasta (veja [Pastas](#folders)). |
| **Duplicar** | Faz uma cópia completa, com as mesmas configurações, e a abre. |
| **Adicionar ao Shuffle** / **Remover do Shuffle** | Veja [Shuffle](#shuffle). Um modelo no conjunto mostra a tag **Shuffle** na linha dele. |
| **Exportar** | Salva o modelo em um arquivo. |
| **Remove** (remover) | Exclui o modelo depois que você confirma. A confirmação lista o que usa o modelo. |

<a id="folders"></a>

## Pastas

As pastas agrupam os seus modelos, por exemplo **RP** e **Work**. Um modelo fica em uma pasta só.

1. Clique em **⋯** em um modelo e escolha **Mover para uma pasta**.
2. Escolha uma pasta, ou clique em **New folder…** (nova pasta), digite um nome e clique em **Create** (criar).
3. Para ver as suas pastas, troque **Por conta** por **Por pasta** no menu ao lado do menu de ordenação.

Em **Por pasta**, cada pasta lista os modelos com o nome da conta deles, e os modelos sem pasta ficam em **Sem pasta**. Clique em **⋯** em uma pasta ou clique com o botão direito nela para renomeá-la ou excluí-la. Excluir uma pasta mantém os modelos dela, em **Sem pasta**. O painel clássico mostra as mesmas pastas e também permite dar um ícone e uma cor a uma pasta.

## Shuffle

O Shuffle faz o chat escolher um modelo diferente a cada resposta que escreve. Use-o para dividir as requisições entre vários serviços ou modelos.

1. Clique em **⋯** em cada modelo que você quer no conjunto e escolha **Add to Shuffle**.
2. Em um chat, abra **Model for this chat** pela caixa de mensagem, ou **Chat Settings → Connection → Model**, e escolha **Shuffle** (sortear).

A partir daí, cada resposta sorteia um modelo do seu conjunto do Shuffle.

Se o modelo sorteado para uma resposta falhar e o **Main** (principal) tiver um modelo em **If it fails** (se falhar), esse modelo escreve a resposta no lugar dele. Um aviso mostra o modelo que falhou e um motivo curto, como "key rejected", "rate limited" ou "not found". A resposta fica com um pequeno rótulo **Fallback** (reserva). Toque nele, ou aponte para ele, para ver a mesma linha de novo.

Uma escolha em **Model for this chat** muda só aquele chat. Para mudar o modelo dos chats novos, defina o **Main** na caixa **Padrões**.

## No layout clássico

O painel clássico de Conexões tem mais algumas ferramentas. Mude para ele com **Novo layout** em **Configurações → Aparência → Tema** e volte do mesmo jeito. Os dois layouts usam as mesmas contas.

- **⋯** em um modelo também tem **Alterar imagem**.
- **⋯** em uma conta também tem **Testar**, **Selecionar modelos** (mover ou excluir vários de uma vez), **Duplicar** e **Desligar** / **Ligar**.
- **Mais ações** (três pontos), no topo do painel, tem **Recolher todas as contas**, **Abrir todas as contas**, **Mostrar apenas Desativada ou Precisa de chave** e **Mostrar selos de custo**.

<a id="export-and-import"></a>

## Exportar e importar

Você pode exportar as contas para um arquivo, para fazer backup ou levá-las a outra instalação, e importá-las depois.

> **Aviso:** a exportação nunca inclui as chaves de API. Depois de importar, abra cada conta e digite a chave de novo. Nunca compartilhe uma chave com ninguém.

- **Exportar um modelo:** abra o modelo com **Edit model** e clique em **Export model** (exportar modelo).
- **Exportar tudo:** clique em **Exportar todas as contas** (o ícone de envio ao lado de **Importar**) no topo da página Conexões. Marinara lembra que o arquivo não tem chaves. Clique em **Export** (exportar).
- **Importar:** clique em **Importar** no topo da página Conexões. Solte um ou mais arquivos (`.json`, `.jsonl` ou `.zip`) na janela, ou clique para procurar os arquivos. Isso inclui o `marinara-connections.zip` que você exportou. Cada conta importada fica com a chave vazia até você preenchê-la.

Um modelo sozinho é baixado como um arquivo `.connection.json`. Vários vêm juntos como `marinara-connections.zip`. As estrelas vão junto. O catálogo de modelos do serviço não vai, então ele é carregado de novo na primeira vez que você abrir os modelos da conta.

## Guias relacionados

- [Conectando a um provedor de IA](connecting-to-a-provider.md)
- [Visão geral do painel Chat Settings](../chats/chat-settings.md)
