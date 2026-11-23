# Importar do SillyTavern

Traga os seus dados do SillyTavern para o Marinara Engine. Importe um arquivo por vez ou escaneie uma pasta inteira do SillyTavern e importe tudo de uma vez.

## O que você pode trazer

| Dados do SillyTavern | No Marinara |
| --- | --- |
| Characters | Personagens |
| Chats e chats em grupo | Chats |
| Presets | Presets (as seções do prompt e as configurações de amostragem do preset) |
| World Info | Lorebooks (notas que a IA lê quando certas palavras aparecem) |
| Backgrounds | Planos de fundo de chat |
| Personas | Personas (o perfil que representa você) |
| Scripts de regex | Scripts de regex: os de cada card, os de cada preset e os globais de `settings.json` (importação de pasta) |

## Importações rápidas de um arquivo

1. Abra **Configurações → Dados → Importação do SillyTavern**.
2. Clique no botão do seu tipo de arquivo.
3. Escolha o arquivo. **Importar personagem**, **Importar preset** e **Importar lorebook** abrem a mesma janela de **Importar** na Biblioteca, com as mesmas opções e o mesmo relatório do que foi trazido e do que ficou de fora.

| Botão | Arquivo |
| --- | --- |
| **Import Character (JSON/PNG)** | Um cartão de personagem `.json` ou `.png`. |
| **Import Chat (JSONL)** | Um registro de chat `.jsonl` (um registro JSON por linha, o formato em que o SillyTavern salva os chats). |
| **Import Preset (JSON)** | Um preset `.json`. |
| **Import Lorebook (JSON)** | Um arquivo de World Info `.json`. |

Acima dos botões, **Tag de importado** e **Tag de origem** (ambas ativadas por padrão) adicionam as tags **Imported** e **ST** ao que você importa. Desmarque uma delas para não adicionar essa tag. A janela que se abre começa com a mesma escolha. As importações mantêm o nome e a descrição originais. Um script de regex é uma regra de localizar e substituir em um texto. Veja [Importando e exportando cartões de personagem](../characters/import-export.md).

Se um card de personagem tem um lorebook dentro dele, a janela Importar personagem pergunta o que fazer com ele: **Importar lorebook** o mantém como um lorebook que você pode reutilizar, **Importar oculto** o mantém vinculado ao personagem, mas fora da lista de lorebooks, e **Skip lorebook** importa só o personagem.

**Import Chat (JSONL)** cria um chat de Roleplay, a menos que o arquivo registre outro modo, e o abre. Uma mensagem curta informa o que foi trazido: a nota do autor, a persona e as mensagens que continuam ocultas para a IA.

### Importar um chat em um modo que você escolhe

Para escolher o modo, use o botão de importação no topo da lista de chats. A dica dele é **Import SillyTavern or Marinara chat JSONL**. Na janela que se abre, **Abrir como** define Roleplay ou Conversation para um arquivo do SillyTavern. Uma exportação do Marinara mantém o próprio tipo. Veja [Exportando e importando chats](../chats/export-import.md).

## Importar uma pasta do SillyTavern

Antes de começar: o assistente lê arquivos no computador do servidor. Se o SillyTavern está em outro computador, copie primeiro a pasta dele (a pasta em que você instalou o SillyTavern) para o computador do Marinara. No computador do Marinara, o assistente funciona de imediato. Em outro dispositivo, defina o segredo de administrador e digite-o em **Configurações → Avançado → Segurança**. Veja [Fazer backup e restaurar o Marinara](backup-and-restore.md) e a seção "Privileged APIs (ADMIN_SECRET)" da [Referência de configuração do servidor](../CONFIGURATION.md).

1. Abra **Configurações → Dados → Importação do SillyTavern**.
2. Clique em **Import from SillyTavern Folder**.
3. Escolha a sua pasta do SillyTavern. Escolha a pasta principal, normalmente a que contém uma pasta `data/` ou `public/`. Use uma destas formas:
   - Clique em **Browse** e escolha a pasta.
   - Se não houver um seletor de pastas (um servidor remoto), um navegador de pastas do aplicativo se abre. Ele lista só as pastas dentro da pasta pessoal do usuário que executa o servidor. Clique em **Select This Folder**.
   - Digite o caminho em **SillyTavern Folder Path**, por exemplo `/home/you/SillyTavern`. Um caminho digitado funciona se estiver dentro da pasta pessoal do usuário que executa o servidor. Se a configuração `IMPORT_ALLOWED_ROOTS` do servidor estiver definida, ele precisa estar dentro de uma dessas pastas.
4. Clique em **Scan Folder**. O Marinara mostra quantos itens encontrou em cada categoria.
5. Em **Choose exactly what to import**, marque os itens que você quer. Cada categoria tem os botões **All** e **None** e um botão **Show** ou **Hide** para os itens individuais.
6. Clique em **Import Selected**. Uma barra de progresso mostra o item atual e uma contagem por categoria.
7. Quando você vir **Import complete!**, leia a contagem de cada categoria e clique em **Done**. Cada linha informa quantos itens foram importados e quantos foram ignorados porque você já os tinha. Abaixo das contagens, **Não importados** lista o que a pasta contém sem recurso equivalente aqui, e uma lista curta informa quantos chats mantiveram a nota do autor e a persona, quais nomes de usuário do SillyTavern não tinham persona aqui, como os presets posicionam World Info e quais configurações de preset ficaram de fora.

**Ignorar o que já está aqui** (ativado por padrão) deixa de fora personagens, chats e personas que você já tem, tanto de uma importação anterior de pasta quanto de arquivos importados um por vez. Uma persona do SillyTavern com o mesmo nome de uma das suas não é copiada: os chats dela são vinculados à sua. Os chats importados um por vez antes desta mudança não são reconhecidos e são importados mais uma vez.

A maioria dos itens começa selecionada. O Marinara deixa desmarcados os presets de fábrica do SillyTavern, como `deterministic`, `neutral` e os presets `universal-*`, e um aviso informa isso. Deixe-os desmarcados, a menos que você queira cópias.

Se o escaneamento encontrar personagens, mais duas opções aparecem:

**Imported character tags** (padrão **All tags**):

- **All tags** mantém as tags de origem.
- **No tags** as ignora.
- **Existing only** mantém só as tags que você já tem.

**Imported regex scripts** (padrão **Character only**):

- **Character only** aplica os scripts a cada personagem.
- **Global** os adiciona a **Biblioteca → Scripts de regex** (**Presets → Regexes** no layout clássico), onde você pode gerenciar os scripts que são executados em vários chats. Veja [Scripts de regex](../extending/regex-scripts.md#manage-your-scripts).

Se não funcionou:

- "Could not find SillyTavern data directory." significa que o Marinara não consegue ler essa pasta. Escolha a pasta principal do SillyTavern.
- "Marinara só pode ler pastas dentro da sua pasta pessoal" significa que a pasta está fora da pasta pessoal do usuário que executa o servidor. Mova a pasta do SillyTavern para dentro dela ou peça a quem executa o servidor para permitir esse local com a configuração `IMPORT_ALLOWED_ROOTS`. Se ela estiver definida, até uma pasta escolhida precisa estar dentro de uma dessas pastas. Veja a [Referência de configuração do servidor](../CONFIGURATION.md).
- Se **Browse** receber um caminho digitado fora da pasta pessoal, o navegador de pastas abre na pasta pessoal.
- Se um item falhar, o Marinara o pula, continua e o lista em avisos na última etapa, por exemplo `Character "Foo": error message`.

## O que acontece com os seus dados

- Arquivos de chat que pertencem a um personagem são importados como ramificações de um só chat. Uma ramificação é uma cópia de um chat que você continua separadamente. Cada chat recebe o nome do arquivo dele no SillyTavern, como na importação de um arquivo por vez. Um arquivo que ainda se chama "New Chat" recebe o nome do personagem.
- Chats em grupo são importados como chats de Roleplay no modo **Individual**, para que cada personagem responda na sua vez, na ordem de fala do SillyTavern.
- As mensagens ocultas para a IA no SillyTavern continuam ocultas.
- Os itens importados mantêm a data da última alteração do arquivo de origem, não a data da importação. Cada mensagem de chat mantém a data com que o SillyTavern a salvou.
- A **Nota do autor** de um chat é trazida com sua profundidade. Se o SillyTavern usava outra frequência, posição ou papel para ela, Marinara ainda a acrescenta a cada resposta nessa profundidade, e a importação informa isso. Uma nota que estava desativada no SillyTavern continua desativada.
- Um chat é vinculado à persona que o SillyTavern usava: a persona fixada nele ou, na falta dela, a persona com o mesmo nome do usuário do chat. Importe as personas na mesma execução ou crie uma com esse nome antes. Quando não há correspondência, o chat fica sem persona e a importação informa o nome da persona que falta.
- Um preset mantém os dois lugares de World Info do SillyTavern. **World Info (antes)** e **World Info (depois)** viram seções próprias, para que as entradas configuradas para depois do personagem continuem depois dele. Um preset que desativa uma delas deixa essas entradas de fora, como no SillyTavern. Um preset com apenas um lugar para World Info recebe uma seção **World Info** que envia as duas. Um preset importado antes desta mudança tem uma seção **World Info**. Para corrigir isso, importe-o de novo ou, em **Ordem dos prompts**, adicione **Lorebook Marker (Before)** e **Lorebook Marker (After)** onde quiser e remova a seção **World Info** antiga.
- As entradas de World Info posicionadas em torno da nota do autor do SillyTavern entram na profundidade 4 como sistema, onde fica a nota do autor (as entradas depois da nota vêm logo após as que ficam antes dela). As entradas posicionadas em torno das mensagens de exemplo ficam depois das definições dos personagens. A importação informa quantas mudaram de lugar.
- Um preset traz as configurações de amostragem: temperatura, Top P, Top K, Min P, penalidade de frequência e de presença e esforço de raciocínio. São os valores iniciais dos chats que usam o preset; os valores próprios de uma conexão ou de um chat ainda prevalecem. O tamanho máximo da resposta e o tamanho do contexto ficam na conexão. Top A e a penalidade de repetição não têm configuração aqui e ficam de fora.
- Personagens, personas, lorebooks, presets e chats recebem as tags **Imported** e **ST**, a menos que você desmarque **Tag de importado** ou **Tag de origem** acima de **Importar selecionados**. Os nomes e as descrições ficam como estavam.

## O que não é transferido

O assistente lê só as categorias da primeira tabela. Outros dados do SillyTavern, como as configurações globais do aplicativo e os perfis de conexão, não são importados. A lista **Não importados** no resultado da importação da pasta conta o que foi encontrado sem recurso equivalente aqui: conjuntos de Quick Reply, templates de instruct, templates de contexto e prompts de sistema. Chats importados antes desta correção receberam o horário da importação como data das mensagens. Para corrigir um, exclua-o e importe o arquivo de novo (em uma importação de pasta, desmarque **Ignorar o que já está aqui**).

## Guias relacionados

- [Importando e exportando cartões de personagem](../characters/import-export.md)
- [Importando e exportando lorebooks](../lorebooks/import-export.md)
- [Exportando e importando chats](../chats/export-import.md)
- [Scripts de regex](../extending/regex-scripts.md)
