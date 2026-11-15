# Conectando a um provedor de IA

Para conversar, Marinara Engine precisa de um modelo de IA. Você pode adicionar uma conta de um serviço de IA, colar a chave de API dela e escolher um modelo. A chave de API é um código secreto do serviço que deixa Marinara usar a sua conta naquele serviço. Trate a chave como uma senha. Você também pode usar o [Built-in model](local-model.md) (modelo embutido), um modelo pequeno que roda no seu computador sem chave.

## Como adicionar uma conta

Antes de começar, consiga uma chave de API de um serviço que você quer usar. Depois de escolher um serviço, a etapa da chave tem um link **Onde encontro a minha chave?**. Estas são as páginas que ele abre para os serviços mais comuns.

- OpenRouter (tem modelos gratuitos): `openrouter.ai/keys`
- NanoGPT: `nano-gpt.com/api`
- OpenAI: `platform.openai.com/api-keys`
- Anthropic: `console.anthropic.com/settings/keys`
- Google Gemini: `aistudio.google.com/apikey`

A maioria dos serviços pede que você se cadastre, e alguns pedem que você adicione crédito, antes de a chave funcionar. Para outros serviços, veja [Provedores de IA compatíveis](providers-reference.md). Para usar um modelo no seu próprio computador sem chave, veja [Como configurar o Built-in model](local-model.md).

1. Abra **Biblioteca → Conexões**. (Clique em **Biblioteca** no canto superior direito e depois em **Conexões**. Ou pressione <kbd>Ctrl</kbd>+<kbd>K</kbd> e digite `connections`.)
2. Clique em **Adicionar conexão** (no celular, **Novo**). Abre uma lista de serviços, dividida em **Texto**, **Imagem**, **Vídeo**, **Voz** e **Decisão**. Para um modelo de chat normal, fique em **Texto**.
3. Clique no serviço que você quer. Digite em **Buscar serviços** para encontrar um que não está na lista.
4. Cole a sua chave em **Chave de API**. Clique no botão de olho para conferir se você colou a chave inteira.
5. Clique em **Connect** (conectar). Marinara testa a chave. Quando ela funciona, aparece **Connected** com o número de modelos encontrados.
6. Em **Found in … — use it for:**, cada linha é uma tarefa, como **Principal** ou **Imagens**. Marque as tarefas que devem usar o modelo que Marinara encontrou. Se o serviço não tiver uma lista de modelos, digite o ID do modelo na linha. Clique em **Concluir**, ou em **Pular** para manter a conta sem atribuir uma tarefa.
7. O que acontece depois depende de você já ter um modelo Main. Main (principal) é a tarefa de escrever as respostas dos seus chats.
   - **Ainda não há modelo Main, ou você abriu o Add em um chat novo:** a janela mostra os modelos do serviço. Os modelos **Recommended** (recomendados) ficam no topo. Clique em um modelo para adicioná-lo, ou digite um nome em **Search or enter model ID…** (buscar ou digitar o ID do modelo). Se você não sabe qual escolher, fique com um **Recommended**. Dá para trocar depois. Deixe **Make … my Main model** (definir como o meu modelo principal) marcado. Essa opção só aparece quando você não tem um modelo Main. Quando você abriu o Add em um chat novo e já tem um modelo Main, aparece no lugar dela um botão **Set … as Main** (definir como principal). Depois clique em **Done** (concluir), ou em **Start chatting** (começar a conversar) se você veio de um chat novo.
   - **Você abriu Adicionar em um seletor de tarefas:** a janela fecha e Marinara leva você de volta àquela tarefa, com o modelo novo na lista.
   - **Você já tem um modelo Main:** a janela fecha e uma mensagem diz que a conta foi adicionada, com o número de modelos dela. Para adicionar mais modelos, clique em **⋯** na conta e escolha **Add model** (adicionar modelo).

A página Conexões mostra a sua conta. O **Connected** do passo 5 já quer dizer que a chave funciona. Se o modelo novo é o seu modelo Main, comece um chat e envie uma mensagem: uma resposta quer dizer que tudo funciona. Se você já tinha um modelo Main, os chats novos continuam usando esse modelo. Para usar a conta nova, adicione um modelo a ela (**⋯** → **Add model**) e escolha esse modelo para um chat ou uma tarefa (veja [Como escolher o modelo de cada tarefa](#choosing-the-model-for-each-job)).

Se não funcionou:

- **The key was not accepted. Check that you copied all of it.** Cole a chave de novo e clique em **Try again** (tentar de novo). A chave precisa vir do serviço que você escolheu.
- **The service is busy, or your credit is used up.** Adicione crédito no site do serviço, ou espere e tente de novo.
- **Marinara could not reach** o serviço. Confira a sua conexão com a internet e clique em **Try again**.

### Campos opcionais da conta

Clique em **Mais opções** na etapa da chave para ver estes campos. Deixe-os vazios, a não ser que você precise deles.

- **Name (optional)** (nome, opcional): o nome mostrado na página Conexões. Vazio, fica o nome do serviço. Uma segunda conta do mesmo serviço recebe os 4 últimos caracteres da chave, como `OpenAI · …a1b2`.
- **Address** (endereço): para onde Marinara envia as requisições. Quando ele está vazio, Marinara usa o endereço do próprio serviço. Preencha só para um proxy, um gateway ou um servidor que você roda. Os serviços que fazem login no seu computador não mostram esse campo.
- **Requests per minute** (requisições por minuto): reduz o ritmo do Marinara nesta conta. Vazio quer dizer sem limite. Os valores permitidos vão de 1 a 600.
- **Parallel jobs** (tarefas em paralelo): quantas requisições rodam ao mesmo tempo. Vazio quer dizer sem limite. Os valores permitidos vão de 1 a 16. Em **Edit account** (editar conta), a mesma configuração se chama **Parallel requests** (requisições em paralelo).

Alguns serviços usam um login no seu computador no lugar da chave. Eles mostram a etiqueta **Sign in** (entrar) e não têm campo de chave. Veja [Conexões por assinatura do Claude, do ChatGPT e do Grok](subscription-clis.md). Para um servidor no seu próprio computador, veja [Conectar um modelo local ou auto-hospedado](local-self-hosted.md). Depois de um teste que falhou, aparece **Continue anyway** (continuar mesmo assim). Ele salva a conta sem um teste aprovado.

### Como começar um chat sem conta

Se você começar um chat antes de ter um modelo, Marinara abre primeiro a janela **Add account**. Depois do **Connect**, clique em um modelo e depois em **Start chatting**.

## A página Conexões

Você gerencia as contas na página **Conexões** (**Biblioteca → Conexões**). De cima para baixo, ela mostra:

- **Importar** (carregar um arquivo de conta) e **Adicionar conexão**.
- **Todos os tipos**, que restringe a lista a contas de **Chat**, **Imagens**, **Vídeo** ou **Voz**, uma caixa de busca (**Buscar contas e modelos**) e o menu de ordenação.
- **Padrões**, a caixa que diz qual modelo faz cada tarefa. Veja [Como escolher o modelo de cada tarefa](#choosing-the-model-for-each-job).
- A tabela de contas, com as colunas **Modelos**, **Status** e **Saldo**. **Neste dispositivo** lista o [modelo embutido](local-model.md). Clique em uma conta para mostrar os modelos salvos abaixo dela.

Cada conta tem um botão **⋯** com **Editar conta**, **Substituir chave** e **Adicionar modelo**. **Editar conta** também contém **Testar conta**, **Usar esta conta** (desativar sem excluir) e os [campos opcionais](#optional-account-fields). Para agrupar contas em pastas, veja [Organizando as conexões](organizing-connections.md).

Uma **conta** é uma chave, um login ou um endereço salvo para um serviço. Se você usa duas chaves do mesmo serviço, tem duas contas. Um **modelo** é um modelo de IA que você salvou a partir de uma conta. Cada modelo salvo guarda as próprias configurações.

<a id="choosing-the-model-for-each-job"></a>

## Como escolher o modelo de cada tarefa

Uma tarefa é algo que um modelo faz por você. A caixa **Padrões** lista as tarefas:

| Grupo | Tarefas |
| --- | --- |
| **Chat** | **Main** escreve as respostas dos seus chats. **Agents** (agentes) roda os agentes auxiliares. **Impersonate** escreve como você. |
| **Omnibar** | **Professor Mari** e **Quick answers** (respostas rápidas). |
| **Pictures & sound** (imagens e som) | **Images**, **Video**, **Voice (Text to Speech)** (voz: texto para fala) e **Dictation (Speech to Text)** (ditado: fala para texto), quando disponível. |
| **Behind the scenes** (nos bastidores) | **Decision**, **Embeddings** e **Image reading** (leitura de imagens). |

Cada tarefa mostra o modelo que a executa, ou o que ela faz sem um modelo, como **Segue Principal** ou **Desativado**. Uma tarefa que precisa de um modelo mostra **Não definido**, e a caixa conta quantas precisam de atenção. Clique em **Padrões** para recolher a caixa.

Para trocar o modelo de uma tarefa, clique nela. Abre **Model for** (modelo para) aquela tarefa, exceto em três linhas. **Decision** e **Embeddings** abrem os próprios controles (veja [Modelos de decisão](decision-models.md) e [Provedores de IA compatíveis](providers-reference.md#embeddings)). **Dictation (Speech to Text)** abre a configuração de fala.

Em **Model for**:

1. Olhe a lista.
2. Clique em um modelo. A lista mostra esse modelo em **Now** (agora), depois os seus modelos em **Starred** (com estrela) e depois os seus modelos salvos por conta. **All models** (todos os modelos), abaixo de uma conta, abre a lista completa dela. Digite em **Search all models or paste a model ID** (buscar em todos os modelos ou colar o ID de um modelo) para buscar em todas as contas ao mesmo tempo. Não é preciso salvar um modelo antes.

**If it fails** (se falhar), no topo da janela, escolhe um segundo modelo, que responde quando o primeiro falha. **Add account**, embaixo, abre a janela Add.

### Quando um recurso precisa de um modelo

Um recurso que não funciona sem um certo tipo de modelo mostra o rótulo **Needs an image model** (ou o equivalente para vídeo, áudio, decisão ou chat). Você vê o rótulo no card do agente na página **Agentes**, em **Chat Settings** (configurações do chat), no editor de agente e nas janelas de imagem e de vídeo. Clique em **Set up** (configurar) ao lado dele e escolha um modelo ou clique em **Add account**. O rótulo some quando a tarefa ganha um modelo.

## Como testar uma conta

O **Conectar** já testa a chave. Para testar de novo depois, clique em **⋯** na conta, escolha **Editar conta** e clique em **Testar conta**. Ele verifica a chave e o endereço do jeito que você digitou, antes de salvar.

<a id="choosing-a-model-for-one-chat"></a>

## Como escolher um modelo para um chat

Um chat novo usa o seu modelo **Main**. Para dar a um chat um modelo diferente, clique no botão de modelo na caixa de mensagem (o ícone de link, com o nome do modelo atual), ou use o campo **Model** (modelo) em **Chat Settings → Connection**. Os dois abrem **Model for this chat** (modelo para este chat):

- **Now** mostra o modelo que o chat usa. **This chat only** quer dizer que o chat tem uma escolha própria. **follows Main** quer dizer que ele usa o Main.
- **Recent** (recentes) e **Starred** listam os seus modelos por conta.
- **Search models or paste an ID…** (buscar modelos ou colar um ID) busca em todas as contas. **Browse** (navegar) abre a lista completa de uma conta.
- **Follow Main** (seguir o principal) desfaz a escolha própria do chat. **Shuffle** (sortear) escolhe um modelo diferente a cada vez.

Uma escolha muda só aquele chat. A mensagem que aparece depois de uma escolha oferece **Make it my Main model** (tornar este o meu modelo principal) e **Undo** (desfazer). No Game Mode, o campo aparece como **Game Master model**.

## Erros comuns

Se um teste ou uma mensagem falhar, comece verificando estes pontos:

- Uma chave errada ou vencida. Clique em **⋯** na conta, escolha **Replace key** (substituir a chave) e cole a chave de novo. Uma conta sem chave mostra **Needs key**.
- Uma conta desligada. Ela mostra **Desativada**. Clique em **⋯**, escolha **Editar conta** e ative **Usar esta conta**.
- Uma chave de outro serviço. Cada serviço precisa da própria chave.
- Um **Address** bloqueado. Vazio, o campo usa o endereço do próprio serviço.

Para mais soluções, veja [Solução de problemas do Marinara Engine](../TROUBLESHOOTING.md).

## Guias relacionados

- [Organizando as conexões](organizing-connections.md)
- [Provedores de IA compatíveis](providers-reference.md)
- [Conexões por assinatura do Claude, do ChatGPT e do Grok](subscription-clis.md)
- [Conectar um modelo local ou auto-hospedado](local-self-hosted.md)
