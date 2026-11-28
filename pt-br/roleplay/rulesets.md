# Roleplay: jogar com um conjunto de regras

Um chat de Roleplay pode ser jogado com um conjunto de regras de mesa, do mesmo tipo que o Game Mode usa. O narrador pede um teste quando acontece algo incerto, o Marinara rola os dados a partir da ficha do personagem e a resposta conta o que a rolagem decidiu. Use isso quando quiser dados de verdade e uma ficha de personagem em um roleplay sem começar uma partida de Game Mode.

Qualquer conjunto de regras que você tenha instalado para o Game Mode funciona, como 5e (SRD 5.1), e as fichas que você já fez para ele no editor de personagens e de personas também.

## Ativar um conjunto de regras em um chat

Antes de começar: instale um conjunto de regras. Veja [Obter um conjunto de regras](../game/rulesets.md#get-a-ruleset).

1. Abra o chat de Roleplay.
2. Abra **Chat Settings** (Configurações do chat) e encontre a seção **Ruleset** (Conjunto de regras).
3. Escolha um conjunto de regras na lista. Ela mostra os conjuntos que você tem instalados.
4. O Marinara dá uma ficha a cada membro do chat e diz quantas acrescentou. Cada membro aparece listado abaixo do conjunto de regras.

Cada membro recebe uma cópia da própria ficha para esse conjunto de regras, vinda do editor de personagens ou de personas (veja [Fichas de conjuntos de regras](../characters/colors-and-stats.md#ruleset-sheets)). Um membro sem ficha recebe uma em branco, marcada como **blank sheet** (ficha em branco) na lista, para montar no chat. Sua persona vem primeiro. As mudanças no chat ficam no chat e nunca voltam para o personagem ou a persona.

Se não funcionou: um conjunto de regras importado precisa de **Allow custom Agent imports** (permitir importações de agentes personalizados) ativado. Veja [Obter um conjunto de regras](../game/rulesets.md#get-a-ruleset).

### Montar uma ficha em branco

1. Na seção **Ruleset**, clique em **Build sheet** (montar ficha) ao lado do membro.
2. A ficha de personagem abre no editor de fichas. Quando o conjunto de regras tem um construtor passo a passo, ele abre ali primeiro, igual ao Game Mode e ao editor de personagens.
3. Faça suas escolhas e clique em **Save sheet** (salvar ficha).

### Acrescentar uma ficha para um novo membro

Quando um personagem entrar no chat mais tarde, clique em **Add missing sheets** (adicionar as fichas que faltam). Os membros que já têm ficha continuam com ela.

### Remover uma ficha

Um membro que não deveria ter ficha, como um card de narrador, pode perdê-la.

1. Na seção **Ruleset**, clique no ícone de lixeira ao lado do membro.
2. Clique em **Remove sheet** (remover ficha).

O chat lembra disso, então **Add missing sheets** e uma versão mais nova do conjunto de regras deixam esse membro de fora. Para dar uma ficha de novo, clique no botão dele depois de **No sheet:** (Sem ficha), como **Give Mira a sheet** (Dar uma ficha a Mira).

### Trocar o conjunto de regras ou desligá-lo

- Escolha **None** (Nenhum) para parar de jogar com o conjunto de regras. As fichas são mantidas, então escolher o mesmo conjunto outra vez continua de onde você parou.
- Escolher outro conjunto recomeça todas as fichas, porque uma ficha feita para um conjunto não significa nada para outro.

## Testes durante o jogo

Você escreve seu turno como de costume. Quando seu personagem tenta algo incerto cujo resultado importa, o narrador escreve um teste em vez de decidir o resultado. O Marinara rola o teste a partir da ficha, e então o narrador escreve o que a rolagem decidiu.

A mensagem pronta mostra um cartão de dados onde o teste aconteceu, com a perícia, a dificuldade, os dados e **Success** (Sucesso) ou **Failure** (Falha). Ações comuns que não podem falhar de verdade não recebem teste.

> **Dica:** Alguns modelos ignoram a instrução de pedir testes e decidem o resultado sozinhos. Se nenhum teste aparecer, tente um modelo mais forte na **Connection** (Conexão) do chat.

Testes não são rolados em turnos de **Impersonate** (Personificar). Uma sala multijogador não pode jogar com um conjunto de regras.

## Usar as fichas de personagem

Clique em **Open sheet** (Abrir ficha) ao lado de um membro na seção **Ruleset**. A ficha é a mesma que o Game Mode mostra. O botão de pergaminho no topo do Tracker Panel abre a ficha da sua persona.

- Clique em **−** e **+** ao lado de uma reserva ou trilha, como pontos de vida ou estresse, para mudá-la. A mudança é salva com a mensagem atual, então acompanha os swipes (respostas alternativas) e as ramificações.
- Clique em **Edit ruleset sheet** (editar a ficha do conjunto) para mudar valores, graduações de perícia, campos e listas, e depois em **Save sheet** (salvar ficha).

O narrador lê as fichas em cada turno e as muda com comandos de ficha na resposta, que o Marinara aplica e esconde da mensagem. Para descansar, diga isso no seu turno, por exemplo "a gente faz um descanso longo". O narrador registra o descanso, e as fichas recuperam o que o descanso do conjunto de regras restaura. Você também pode clicar em **Rest** (Descanso) em uma ficha.

## Crie o seu próprio conjunto de regras

O criador de conjuntos de regras monta um conjunto pequeno a partir de um formulário: como os testes são rolados, o que aparece na ficha e o que o narrador recebe como instrução. Use-o para um sistema que Marinara não tem. Um conjunto de regras que você cria funciona como um instalado, em Roleplay e em Game Mode.

Antes de começar: ative **Allow custom Agent imports**, porque o criador salva o conjunto de regras da mesma forma que uma importação. Veja [Obter um conjunto de regras](../game/rulesets.md#get-a-ruleset).

1. Em **Chat Settings → Ruleset**, clique em **New ruleset…** (novo conjunto de regras).
2. Digite um **Name** (nome).
3. Em **Dice** (dados), escolha como os testes são rolados (veja a tabela abaixo). A escolha preenche atributos, reservas e trilhas iniciais, que você pode mudar.
4. Mude **Difficulties** (dificuldades), **Stats** (atributos), **Skills** (perícias) e o restante do formulário. A maioria das seções se explica em uma linha abaixo do título.
5. Clique em **Create ruleset** (criar conjunto de regras).

Marinara salva o conjunto de regras. Em um chat sem conjunto de regras, também ativa o novo. Um chat que já tem um conjunto de regras mantém esse conjunto e as fichas dele; para trocar, escolha o novo conjunto na lista.

Se um conjunto de regras instalado já rolar da forma que você escolheu, a seção **Dice** mostra o nome dele. Cada conjunto de regras é uma ficha separada em cada personagem, então, para manter uma ficha por personagem, jogue com esse conjunto ou edite-o em vez de criar outro.

| Dados | Como um teste é rolado |
| --- | --- |
| **d20 + modifier** (d20 + modificador) | Um d20 mais o atributo e a perícia, contra um número de dificuldade. |
| **2d6 bands** (faixas de 2d6) | 2d6 mais o atributo: 10 ou mais é um acerto forte, 7 a 9 é um acerto fraco, 6 ou menos é uma falha. |
| **Dice pool** (reserva de dados) | Um dado por ponto de atributo e perícia. Cada dado que alcança o número-alvo conta. Você escolhe d6 ou d10 e o alvo. |
| **Highest d6** (maior d6) | Um d6 por ponto, mantendo o maior: 6 é um sucesso completo, 4 ou 5 é um sucesso parcial, dois 6 são um crítico. |
| **Percentile** (percentual) | Um d100. O teste tem sucesso com um resultado igual ou inferior ao número da perícia. |
| **Hope and Fear** (Esperança e Medo) | Dois d12 mais o atributo. O dado mais alto diz se o resultado vem com Esperança ou com Medo. |
| **No dice** (sem dados) | Nada é rolado. O atributo e a perícia são somados e comparados com a dificuldade. |

### Altere um conjunto de regras que você criou

1. Ative o conjunto de regras em um chat.
2. Em **Chat Settings → Ruleset**, clique em **Edit ruleset** (editar conjunto de regras).
3. Faça as mudanças e clique em **Save new version** (salvar nova versão).

O chat passa para a nova versão e mantém todas as fichas. Renomear um atributo, uma perícia, uma reserva ou uma coluna de lista mantém o que cada personagem tem nela. Outro chat com o mesmo conjunto de regras passa para a nova versão quando você clica em **Add missing sheets** naquele chat.

**Edit ruleset** aparece para um conjunto de regras que você criou ou importou de um arquivo, quando o formulário consegue conter tudo dele: um feito pelo criador, ou um arquivo escrito à mão que usa apenas o que o formulário mostra. Não aparece para um conjunto de regras de um pacote ou repositório. O criador nunca abre um conjunto de regras com algo a mais, como regras de combate ou comentários, então não pode descartar o que não mostra. Também só aparece em um chat que usa a versão mais nova; em um chat com uma versão anterior, clique primeiro em **Add missing sheets**.

### Organize a ficha

| No formulário | Na ficha |
| --- | --- |
| A ordem das linhas | Atributos, perícias, reservas, trilhas, campos e abas de listas aparecem na ordem do formulário. Arraste uma linha pela alça para movê-la, ou coloque o foco na alça e pressione as setas para cima e para baixo. |
| O **Group** (grupo) de um atributo ou perícia | Atributos ou perícias do mesmo grupo aparecem sob um único título. |
| **Skill ranks** (graus de perícia) | Os graus que você escolhe para cada perícia na ficha, cada um com o que acrescenta: ao total de uma rolagem de d20 ou 2d6, dados em uma reserva, pontos em um percentual. |
| **Mostrar graus na ficha como** | O que a ficha mostra ao lado de cada perícia treinada e salvaguarda: **Valor do teste (+2)**, **Nome do grau**, **Pontos (●●○)**, **Números romanos (II)** ou **Número do grau (2)**. Os testes e a cópia da ficha do narrador continuam iguais. |
| **Practice meter** (medidor de prática) | Cada perícia treinada mostra o progresso até o próximo grau, de 0 a 99%. A prática na história aumenta esse valor, e subir de grau o reinicia. Você pode corrigi-lo na ficha. Em **No meter for:** (sem medidor para), marque um grupo para deixar as perícias dele de fora. |
| **Number** (número), **Bar** (barra) ou **Dots** (pontos) em uma reserva ou trilha | Só o número, uma barra de preenchimento ao lado dele ou uma linha de pontos preenchida até ele, um ponto por unidade. Mais de 20 pontos aparecem como uma barra. |
| **Lists** (listas) | Cada lista ganha uma aba própria, com o nome da lista, a menos que você digite outro nome de aba. Listas com o mesmo nome de aba compartilham uma aba. |
| As colunas de uma lista | Cada linha tem um nome, mais as suas colunas: **Text** (texto), **Number** ou **Checkbox** (caixa de seleção). A primeira coluna de caixa de seleção aparece como uma marca ao lado de cada nome. |

### Explique as regras ao narrador

A seção **Prompts** contém o que o narrador recebe como instrução sobre o seu conjunto de regras. **Checks** (testes) e **Keeping the sheets** (manutenção das fichas) mostram um padrão; deixe qualquer um vazio para usá-lo. Quebras de linha viram espaços. Nomes e prompts não podem conter colchetes nem chaves duplas, porque as tags e macros do narrador os usam.

| Caixa | Para que serve |
| --- | --- |
| **Checks** | Quando pedir um teste e como escolher a perícia e a dificuldade. |
| **Keeping the sheets** | Como as fichas mudam durante o jogo. |
| **Rules reference** (referência de regras) | Regras da casa e qualquer outra coisa que o narrador deva ter sempre à mão. |
| **World (Game Mode)** (mundo, Game Mode) | Lido uma vez quando um jogo de Game Mode é criado com o conjunto de regras, para que o mundo combine com as regras. |

## Solução de problemas

| Sintoma | Solução |
| --- | --- |
| **This chat's ruleset is not installed here, so its checks and sheets are paused.** | Instale o conjunto de regras de novo ou escolha outro. |
| O narrador nunca pede testes. | Use um modelo mais forte para o chat. Alguns modelos ignoram a instrução dos testes. |
| Um personagem novo não tem ficha. | Clique em **Add missing sheets**. |

## Guias relacionados

- [Game Mode: jogar com um conjunto de regras](../game/rulesets.md)
- [Game Mode: dados e testes de perícia](../game/dice-and-skill-checks.md)
- [Roleplay Mode: primeiros passos](getting-started.md)
