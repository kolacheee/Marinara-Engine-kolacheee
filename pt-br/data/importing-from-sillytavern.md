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

## Importações rápidas de um arquivo

1. Abra **Configurações → Dados → Importação do SillyTavern**.
2. Clique no botão do seu tipo de arquivo.
3. Escolha o arquivo.

| Botão | Arquivo |
| --- | --- |
| **Import Character (JSON/PNG)** | Um cartão de personagem `.json` ou `.png`. |
| **Import Chat (JSONL)** | Um registro de chat `.jsonl` (um registro JSON por linha, o formato em que o SillyTavern salva os chats). |
| **Import Preset (JSON)** | Um preset `.json`. |
| **Import Lorebook (JSON)** | Um arquivo de World Info `.json`. |

Acima dos botões, **Tag de importado** e **Tag de origem** (ambas ativadas por padrão) adicionam as tags **Imported** e **ST** ao que você importa. Desmarque uma delas para não adicionar essa tag. As importações mantêm o nome e a descrição originais. Fora isso, os botões não têm opções. A importação de um personagem mantém todas as tags de origem e limita os scripts de regex a esse personagem. Um script de regex é uma regra de localizar e substituir em um texto. Para escolher essas opções, use **Importar** na página **Biblioteca → Personagens**. Veja [Importando e exportando cartões de personagem](../characters/import-export.md).

Se um cartão de personagem tem um lorebook dentro dele, o seu navegador pergunta se você quer importá-lo como um lorebook à parte. Clique em **OK** para mantê-lo como um lorebook que você pode reutilizar, ou em **Cancel** para importar só o personagem.

**Import Chat (JSONL)** cria um chat de Roleplay, a menos que o arquivo registre outro modo, e o abre.

### Importar um chat em um modo que você escolhe

Para escolher o modo, use o botão de importação no topo da lista de chats. A dica dele é **Import SillyTavern or Marinara chat JSONL**. Ele importa para a aba de modo que está aberta (Conversation, Roleplay ou Game). Veja [Exportando e importando chats](../chats/export-import.md).

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
7. Quando você vir **Import complete!**, leia a contagem de cada categoria e clique em **Done**. Abaixo das contagens, uma lista curta informa quantos chats mantiveram a nota do autor e a persona, quais nomes de usuário do SillyTavern não tinham persona aqui e quais configurações de preset ficaram de fora.

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

- Arquivos de chat que pertencem a um personagem são importados como ramificações de um só chat. Uma ramificação é uma cópia de um chat que você continua separadamente.
- Chats em grupo são importados como chats de Roleplay.
- Os itens importados mantêm a data da última alteração do arquivo de origem, não a data da importação. Cada mensagem de chat mantém a data com que o SillyTavern a salvou.
- A **Nota do autor** de um chat é trazida com sua profundidade. Se o SillyTavern usava outra frequência, posição ou papel para ela, Marinara ainda a acrescenta a cada resposta nessa profundidade, e a importação informa isso. Uma nota que estava desativada no SillyTavern continua desativada.
- Um chat é vinculado à persona que o SillyTavern usava: a persona fixada nele ou, na falta dela, a persona com o mesmo nome do usuário do chat. Importe as personas na mesma execução ou crie uma com esse nome antes. Quando não há correspondência, o chat fica sem persona e a importação informa o nome da persona que falta.
- Um preset traz as configurações de amostragem: temperatura, Top P, Top K, Min P, penalidade de frequência e de presença e esforço de raciocínio. São os valores iniciais dos chats que usam o preset; os valores próprios de uma conexão ou de um chat ainda prevalecem. O tamanho máximo da resposta e o tamanho do contexto ficam na conexão. Top A e a penalidade de repetição não têm configuração aqui e ficam de fora.
- Personagens, personas, lorebooks, presets e chats recebem as tags **Imported** e **ST**, a menos que você desmarque **Tag de importado** ou **Tag de origem** acima de **Importar selecionados**. Os nomes e as descrições ficam como estavam.

## O que não é transferido

O assistente lê só as categorias da primeira tabela. Outros dados do SillyTavern, como as configurações globais do aplicativo, respostas rápidas, templates de instruct e de contexto e perfis de conexão, não são importados. Chats importados antes desta correção receberam o horário da importação como data das mensagens. Para corrigir um, exclua-o e importe o arquivo de novo (em uma importação de pasta, desmarque **Ignorar o que já está aqui**).

## Guias relacionados

- [Importando e exportando cartões de personagem](../characters/import-export.md)
- [Importando e exportando lorebooks](../lorebooks/import-export.md)
- [Exportando e importando chats](../chats/export-import.md)
- [Scripts de regex](../extending/regex-scripts.md)
