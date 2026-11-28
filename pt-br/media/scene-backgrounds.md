# Planos de fundo criados pelo Illustrator

O agente **Illustrator** pode pintar fundos para sua história: quando você pede, a cada novo lugar, versões de chuva, neve ou neblina quando o clima muda e versões de amanhecer, dia, pôr do sol ou noite quando a hora muda. Este guia cobre tudo isso e como ele reutiliza imagens existentes em vez de pintar novas.

Para as imagens que você envia e escolhe à mão, veja [Biblioteca de planos de fundo](../appearance/chat-backgrounds.md). Para saber como um chat escolhe qual imagem mostrar (o agente Background, lugares fixados e imagens da galeria), veja [Planos de fundo que acompanham a história](../roleplay/backgrounds.md).

## Antes de começar

- Instale o **Illustrator** em **Biblioteca → Agentes**. Veja [Agente Illustrator](illustrator-agent.md).
- Dê a ele um modelo de imagem: defina a tarefa **Imagens** em **Padrões** na página Conexões, ou escolha um na tela **Abrir a configuração** do Illustrator. Veja [Provedores de geração de imagens e configuração](image-providers.md).

Os planos de fundo pintados funcionam em chats de Roleplay e Game, mas não de Conversation. No Conversation, o aplicativo diz "Scene background generation is available in Roleplay and Game modes."

## Pintar um plano de fundo agora

1. Abra **Configurações do chat** com o botão de controles deslizantes no chat e expanda **Galeria**.
2. Clique em **Plano de fundo**. O botão mostra **Gerando...** enquanto trabalha.
3. Quando termina, a nova imagem é adicionada à sua Biblioteca de planos de fundo e mostrada atrás do chat. "Background generated." confirma isso.

Você não precisa adicionar o Illustrator ao chat para isso. Ele roda uma vez e não inicia execuções automáticas.

Marinara monta o prompt a partir da cena: em um jogo, isso inclui o gênero, a ambientação, o lugar, o clima e a hora do dia. A imagem usa o tamanho de tela **Planos de fundo**, de 1280 por 720 pixels, a menos que você o mude em **Configurações → Mídia → Geração de imagens**.

Se não funcionou: "Choose an image generation connection for the Illustrator agent, or mark one as the default image connection." significa que nenhum modelo de imagem foi encontrado. Defina um como descrito em **Antes de começar**. Se o botão **Plano de fundo** não aparecer, o Illustrator não está instalado.

## Um novo plano de fundo para cada novo lugar

Com essa opção ativada, o Illustrator pinta um plano de fundo quando a história chega a um lugar que não tem um, salva a imagem na sua biblioteca e a mostra.

1. Adicione o **Illustrator** ao chat: em **Configurações do chat → Agentes**, ative **Ativar agentes** e adicione o **Illustrator** em **Agentes diversos**.
2. No cartão do **Illustrator**, ative **Gerar planos de fundo de cena**.

O Illustrator examina a cena no **Intervalo de execução de imagem** (a cada 5 mensagens, a menos que você mude esse valor). Para verificar a cada resposta, use as [verificações do modelo de decisão](#check-every-reply-with-a-decision-model). No Game Mode, o botão liga/desliga **Game Illustrator** também cobre os planos de fundo.

### Reutilizar as imagens que você já tem

Antes de pintar um novo lugar, o Illustrator procura uma imagem que você já tem, nesta ordem:

1. Um plano de fundo fixado nesse lugar, no chat ou na galeria de um personagem. Veja [Fixar um plano de fundo em um lugar](../roleplay/backgrounds.md#pin-a-background-to-a-place).
2. Uma imagem da biblioteca cujo nome, ou uma tag de duas ou mais palavras, apareça no local do World State. Por exemplo, `generated-guest-bedroom.png`, ou uma imagem com a tag `guest bedroom`, serve para "Smith House, guest bedroom".
3. Sem um local no World State, o nome do lugar escrito pelo modelo de prompt do Illustrator é comparado da mesma forma.

Maiúsculas, minúsculas, acentos e "'s" não fazem diferença, e o nome mais específico tem prioridade sobre um simples `bedroom.png`. Se uma imagem corresponder, ela é mostrada (com o clima da história, quando essa versão existe) e nada é pintado. Só um lugar sem correspondência recebe uma nova imagem.

Se nenhum nome corresponder e você tiver ativado **Reutilizar um plano de fundo da biblioteca parecido com o local** no cartão do Illustrator, um [modelo de decisão que lê imagens](../connections/decision-models.md#features-that-look-at-pictures) analisa até 4 imagens da biblioteca que compartilhem uma palavra com o lugar e mostra uma que corresponda. Só quando nenhuma corresponde é que uma nova imagem é pintada. A opção vem desativada por padrão e fica em cinza sem um modelo desse tipo.

Para garantir que um lugar mantenha a imagem, dê ao arquivo o nome do lugar (`kitchen.png` para "Kitchen") ou adicione uma tag de duas ou mais palavras, como `smith house kitchen` (veja [Adicionar tags a um plano de fundo](../appearance/chat-backgrounds.md#tag-a-background)). Tags de uma palavra só, como `kitchen` ou `night`, são ignoradas aqui, porque geralmente descrevem a aparência de uma imagem.

## Versões dos planos de fundo para cada clima

Com essa opção ativada, o plano de fundo acompanha o clima da história. Quando começa a chover na estalagem, o Illustrator repinta o plano de fundo dela com chuva nas janelas. Em ambientes internos, a chuva em movimento cai apenas atrás dos vidros das janelas, nunca pelo cômodo.

1. Abra **Configurações do chat → Agentes → Illustrator**.
2. Ative **Weather Versions of Backgrounds**.

É preciso um modelo de imagem que possa partir de uma imagem. A maioria pode, incluindo OpenAI, Gemini, NovelAI e ComfyUI com uma entrada de imagem. Com um modelo que não pode, a imagem fica como está.

O que acontece:

- Cada combinação de imagem e clima é pintada **uma vez**. Quando o clima volta, ou a história retorna à estalagem na chuva, a versão salva é mostrada de novo sem custo.
- A versão é salva ao lado da original como `name--wx-rain.png`. Os outros tipos são `storm`, `snow`, `blizzard`, `hail`, `fog`, `sand`, `ash`, `embers`, `blossom` e `aurora`, além de `clear` para uma cópia sem precipitação de uma imagem criada originalmente com mau tempo. Um clima incomum recebe uma versão com as palavras da própria história: uma chuva de meteoros vira `name--wx-meteor-shower.png`.
- Tempo limpo, ensolarado, nublado, com vento e outras condições leves mantêm a imagem comum.
- O clima é lido do agente **World State** ou de uma verificação do modelo de decisão (abaixo).
- Isso cobre todos os planos de fundo da sua biblioteca, sejam escolhidos por você ou pelo agente Background, ou pintados pelo Illustrator, além dos lugares fixados e dos planos de fundo da galeria que acompanham um personagem. O agente **Background** escolhe entre as imagens comuns, e a versão com o clima correspondente é mostrada quando existe.

### Janelas: onde o clima em movimento aparece

Na primeira vez que uma imagem de ambiente interno recebe uma versão de clima, o Illustrator também pergunta ao modelo de imagem onde estão as janelas da imagem. Ele salva a resposta como uma pequena máscara em preto e branco, compartilhada por todas as versões de clima daquele cômodo. O clima em movimento (riscos de chuva, flocos de neve, pétalas) é então desenhado só no vidro.

- Um cômodo sem janelas não recebe clima em movimento, apenas a cor do clima e os clarões dos relâmpagos.
- Uma aurora, uma chuva de meteoros e outros climas sem nada caindo ficam estáticos: a imagem os mostra e nada se move sobre ela.
- As máscaras ficam em `backgrounds/weather-masks` na sua pasta de dados.

### Refazer uma imagem de clima ou suas janelas

Enquanto o chat mostra uma versão de clima, **Configurações do chat → Agentes → Illustrator** tem uma linha abaixo de **Weather Versions of Backgrounds** com o nome do clima, como **This rain picture**:

- **Remake picture** pinta essa versão de clima de novo a partir da imagem comum.
- **Remake windows** pede de novo ao modelo de imagem a máscara das janelas. Use quando a chuva cair nas almofadas ou deixar uma janela de fora.
- **No moving weather** desativa a máscara para esse cômodo. As versões de clima dele mostram apenas a cor do clima e os relâmpagos. **Remake windows** reativa a máscara.

Se não funcionou: confira se o World State do chat mostra um **Clima** (ou se a verificação de clima abaixo está ativada) e se o **Illustrator** está adicionado ao chat com um modelo de imagem.

## Versões dos fundos por hora do dia

Com a opção ativada, o fundo acompanha o relógio da história. Quando anoitece na estalagem, Illustrator repinta o fundo à noite: céu escuro lá fora, lampiões e velas acesos. O lugar, a disposição e a câmera ficam iguais; só muda a luz.

1. Abra **Configurações do chat → Agentes → Illustrator**.
2. Ative **Versões de fundos por hora do dia**.

Como as versões de clima, precisa de um modelo que possa partir de uma imagem.

O que acontece:

- Há quatro horários: **Amanhecer**, **Dia**, **Pôr do sol** e **Noite**. A hora de World State decide: um horário numérico (`7:40 PM`, `21:15`) tem prioridade; caso contrário, palavras como "crepúsculo", "meia-noite" ou "de manhã cedo". Antes das 5h e a partir das 20h é noite; das 5h às 7h, amanhecer; das 7h às 17h, dia; das 17h às 20h, pôr do sol.
- Considera-se que uma imagem mostra a hora em que foi pintada. Illustrator guarda isso para suas próprias imagens. Nas outras, vale uma palavra de horário no nome ou em uma tag (`tavern-night.png`, `#sunset`); o restante conta como dia. Assim uma imagem diurna recebe versão noturna, e uma pintada à noite recebe versão diurna, nunca outra noturna.
- Cada combinação de imagem e horário é pintada **uma vez** e depois mostrada de novo sem custo. As versões ficam junto da original como `name--tod-night.png` (também `--tod-dawn`, `--tod-day` e `--tod-sunset`).
- Com versões de clima também ativadas, uma imagem cobre os dois: chuva à noite é `name--wx-rain--tod-night.png`, pintada uma vez a partir da imagem simples. Quando só muda o clima, o horário fica, e vice-versa.
- O horário é verificado após cada resposta, não só no intervalo do Illustrator. A imagem noturna aparece assim que o relógio de World State chega à noite. Isso só vale para o horário: um lugar novo ainda espera a execução do Illustrator ou a verificação de lugar abaixo.
- A tonalidade do céu, o sol, a lua e as estrelas sobrepostos ficam menos evidentes nas versões de horário, porque a imagem já tem seu próprio céu.
- Sem hora de World State, uma verificação do modelo de decisão pode identificá-la (abaixo).

Enquanto o chat mostra uma versão de horário, aparece a mesma linha das imagens de clima, como **Esta imagem de Noite**, com **Refazer imagem**.

Na biblioteca de fundos, as versões ficam sob sua imagem simples: o cartão mostra a quantidade e, ao abrir, lista em **Versões de clima e horário**.

## Verificar cada resposta com um modelo de decisão

O Illustrator normalmente só examina a cena no intervalo de execução dele, então um novo lugar pode esperar algumas respostas pelo plano de fundo. Um [modelo de decisão](../connections/decision-models.md), um modelo pequeno de sim ou não, pode verificar cada resposta.

Antes de começar: escolha um modelo de decisão em **Padrões** na página Connections e ative **Gerar planos de fundo de cena**, **Versões climáticas dos planos de fundo**, **Versões de fundos por hora do dia** ou qualquer combinação.

1. Abra **Configurações do chat → Agentes → Illustrator**.
2. Em **Verificações do modelo de decisão**, escolha uma verificação, como **A cena mudou para um novo lugar**, **O clima mudou** ou **A hora do dia mudou**, ou todas as ativadas, como **Novo local, mudanças de clima e horário**. Só aparecem verificações de configurações ativadas. O padrão é **Desativado**.

Depois de cada resposta:

- A verificação de novo lugar pergunta se a última mensagem move a cena para um novo lugar. Um sim dá ao lugar um plano de fundo, reutilizando um que você já tem quando possível. O modelo de prompt só escreve um novo plano de fundo depois de um sim.
- A verificação de clima pergunta se o clima muda na última mensagem. Um sim mostra ou pinta a versão de clima do plano de fundo atual. Sem um clima no World State, o modelo de decisão também escolhe o tipo de clima.
- A verificação de hora pergunta se a hora do dia muda na última mensagem. Um sim mostra ou pinta a versão de horário do fundo atual. Sem hora de World State, o modelo de decisão também escolhe amanhecer, dia, pôr do sol ou noite.
- As verificações apenas acrescentam oportunidades de agir. A execução do próprio Illustrator e as mudanças de local do World State continuam valendo.
- Sem resposta (sem modelo, por tempo limite esgotado ou por erro), a verificação é ignorada.

Se não funcionou: sem um modelo de decisão escolhido, a lista fica desativada e indica onde escolher um.

## Revisar o prompt antes do envio

1. Abra **Configurações → Mídia → Padrões de geração**.
2. Ative **Mostrar os prompts de mídia antes de enviar**.

Uma janela **Revisar prompt de imagem** passa a abrir antes de cada requisição de imagem, incluindo os planos de fundo pintados. Edite o prompt e o prompt negativo e clique em **Gerar** para enviar ou em **Cancelar** para parar. O texto que você digita é enviado exatamente como está.

## Guias relacionados

- [Planos de fundo que acompanham a história](../roleplay/backgrounds.md): qual imagem um chat mostra, lugares fixados e planos de fundo da galeria.
- [Biblioteca de planos de fundo](../appearance/chat-backgrounds.md): enviar, adicionar tags e organizar imagens, além do desfoque.
- [Agente Illustrator](illustrator-agent.md): ilustrações de cena, clipes e o intervalo de execução.
- [A galeria do chat](../chats/chat-gallery.md): a seção Gallery e seus botões.
- [Modelos de decisão](../connections/decision-models.md)
