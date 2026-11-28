# Temas de CSS personalizados

Um tema muda todo o visual do Marinara: cores, fontes, imagens e o formato dos painéis. Marinara tem uma galeria de temas iniciais prontos para baixar. Você também pode importar um tema que alguém compartilhou ou criar o seu próprio.

Para uma mudança rápida sem usar nenhum tema, veja [Configurações de aparência](appearance-settings.md) ou [Estilos prontos para janelas de chat](#ready-made-chat-window-styles). Para criar o seu próprio tema, o [Guia para autores de temas](theme-author-guide.md) explica o processo passo a passo.

## O que é um tema personalizado

Um tema é um bloco de CSS, o código que as páginas da web usam para cores, fontes e espaçamentos, junto com as imagens e fontes que ele inclui. Os temas são salvos no seu servidor do Marinara, então um tema instalado aparece em todos os dispositivos conectados a ele. Só um tema fica ativo por vez, e você pode guardar quantos quiser.

## Onde encontrar temas

Abra **Biblioteca → Configurações → Aparência** e clique em **Temas CSS** na linha de seções. No layout clássico, o caminho é **Configurações → Complementos → Biblioteca de temas**.

A seção tem:

- **Novo tema** e **Importar arquivo** no topo.
- **Permitir temas com HTML (aceito o risco)**, desativado por padrão. Veja [Temas com HTML](#themes-with-html).
- **Temas instalados**: **Tema padrão**, depois os seus próprios temas e, por fim, os temas iniciais que você baixou.
- **Explorar a galeria de temas**: os temas iniciais que você pode baixar.

## Temas iniciais

Os temas iniciais não fazem parte da instalação, então não ocupam espaço até você querer um. Eles ficam na galeria de temas, e Marinara só baixa um tema quando você o escolhe.

1. Clique em **Explorar a galeria de temas** abaixo de **Temas instalados**. Marinara precisa de uma conexão com a internet para isso.
2. Cada tema mostra uma prévia, uma descrição curta, seu tamanho e suas tags.
3. Clique em **Baixar** ao lado dos que você gostar. Eles aparecem em **Temas iniciais**, dentro de **Temas instalados**, prontos para ativar.

| Tema | Visual |
| --- | --- |
| **Apogee Lounge** | O salão de observação de uma nave de passageiros dos anos 1970, com um gigante gasoso pela janela e mensagens em painéis moldados. |
| **Crepuscular** | Um almanaque do mar noturno: figuras encapuzadas fazem vigília em um penhasco sob uma lua atenta (elas estão comendo panquecas), com as mensagens descendo por uma única coluna pautada de livro-razão. |
| **Dewglass** | Vidro brilhante dos anos 2000: as mensagens são gotas de gel sobre uma lagoa ensolarada ou uma noite com aurora. |
| **Granite Watch** | Um posto de comando da Guerra Fria sob a montanha: as respostas aparecem em papel de teletipo e os widgets ficam em pranchetas penduradas. |
| **Gutterlight** | Uma cidade gótica chuvosa desenhada como um quadrinho policial, com quadros a nanquim e caixas de narração. |
| **Lantern Meadow** | Tranquilo e muito legível, sem movimento. |
| **Lantern Path** | Uma coluna de leitura com movimento suave. |
| **Maple's Bramble Cottage** | Uma casa de campo aconchegante, com uma coluna de leitura para respostas longas. |
| **MARI to the Moon** | Um terminal de negociação: cada resposta é uma boleta de ordem, a barra superior exibe um letreiro de cotações e a lista de chats é uma lista de acompanhamento. |
| **NEON//GRID** | Cyberpunk em neon, feito para respostas longas. |
| **Petal OS** | Uma área de trabalho retrô divertida, com fontes em pixels. |
| **Quiet Iris** | Uma inteligência de nave tranquila: instrumentos de grafite fosco, uma única lente vermelho-âmbar e cada chat acoplado ao longo de uma única coluna iluminada. |
| **Rosalind's Folio** | Um layout de livro de histórias com toques de visual novel. |
| **Sanguine Keep** | Um castelo gótico ao luar: veludo carmesim e dourados à noite, mármore claro de dia, com retratos em janelas de lanceta e mensagens em painéis de relicário. |
| **Swiss Poster** | Design de pôster discreto e limpo, sem movimento. |
| **Under Sail** | O convés de um veleiro no mar: cada mensagem é uma vela de lona pendurada em uma verga de madeira. |
| **Velvet Casket** | Gótico em tons pastel de dia e gótico tradicional à noite, com mensagens em formato de caixão. |

Todo tema inicial tem uma versão escura e uma clara. As pequenas tags abaixo de cada nome, como **No motion** (sem movimento) ou **High legibility** (alta legibilidade), indicam o que esperar.

Quando a galeria tem uma versão mais recente de um tema que você baixou, o tema mostra **Atualizar** na lista da galeria. Clique para obter a nova versão.

Os temas iniciais baixados são somente leitura, então sempre ficam como foram criados. Cada um tem quatro botões:

- **(i) Créditos e licenças**: quem criou a arte e as fontes e como você pode reutilizá-las.
- **Clonar e editar** (o ícone de cópia): cria a sua própria cópia, como "Petal OS (minha cópia)", e a abre no editor.
- **Exportar** (o ícone de upload): salva o tema como arquivo.
- **Remover** (o ícone de lixeira): remove o tema desta instalação. Você pode baixá-lo de novo da galeria a qualquer momento.

Você também pode obter os arquivos de tema sem o aplicativo: eles ficam na pasta `themes` da galeria de temas no GitHub ([branch kolacheee-themes](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes)). Baixe um arquivo `.json` de lá e use **Importar arquivo**.

## Ativar um tema

1. Clique no nome de um tema em **Temas instalados**. O tema é ativado nesta aba do navegador.
2. Uma barra pergunta **Manter este tema?** e inicia uma contagem regressiva de 15 segundos. Deixar o ponteiro sobre a barra pausa a contagem.
3. Clique em **Manter tema** para mantê-lo. Ele passa a aparecer nos outros dispositivos também. Clique em **Voltar**, ou deixe a contagem terminar, para voltar ao visual anterior.

Clique em **Tema padrão** para desativar os temas personalizados. **Restaurar a aparência**, no topo de **Configurações → Aparência → Tema**, também desativa o tema.

Para usar um tema diferente em apenas um dispositivo, primeiro defina **Aparência neste dispositivo** como **Apenas neste dispositivo** em **Configurações → Aparência → Tema**.

### Voltar ao visual normal

Se um tema dificultar o uso do Marinara, qualquer uma destas ações o desativa naquela aba:

- Pressione <kbd>Esc</kbd> três vezes.
- Adicione `?safe` ao fim do endereço no navegador.
- Pressione <kbd>Ctrl</kbd>+<kbd>K</kbd> e digite "Tema personalizado".

Marinara também protege a barra superior, as barras laterais, <kbd>Ctrl</kbd>+<kbd>K</kbd> e a caixa de mensagem. Um tema pode mudar o estilo dessas partes, mas, se ocultar, mover ou cobrir alguma delas, Marinara desativa o tema naquela aba e informa o motivo.

## Importar um tema

1. Clique em **Importar arquivo**.
2. Escolha um arquivo de tema `.json` ou `.css`.
3. Uma prévia mostra o nome, o autor, a versão, as imagens e o tamanho do tema, além dos créditos e da licença. Ela lista o que você precisa saber antes de instalar, como imagens em movimento, texto que o tema adiciona ou partes que não vão funcionar.
4. Escolha o que incluir. A prévia oferece as configurações sugeridas pelo tema, como o esquema de cores, a cor de destaque e a fonte, com a maioria já marcada. Ela também pode adicionar os planos de fundo do tema à sua galeria de planos de fundo de chat.
5. Clique em **Instalar e experimentar** para ativá-lo imediatamente, ou em **Instalar** para adicioná-lo à lista.

Se você já tem um tema com o mesmo nome, a prévia oferece a opção de atualizá-lo ou **Manter ambos**. Quando você volta de um tema que está experimentando, Marinara também restaura as configurações que ele mudou.

Um tema não pode ser instalado se escrever texto que pede senhas ou chaves ou se faz passar pelo Marinara. Nunca digite uma chave ou senha porque um tema pediu.

### Temas com HTML

Alguns temas adicionam uma pequena caixa de HTML a cada mensagem, chamada modelo de mensagem. Marinara remove scripts, links, imagens e formulários dela, mas o HTML de outra pessoa ainda pode enganar você. Esses temas só são instalados enquanto **Permitir temas com HTML (aceito o risco)** estiver ativado. Com o botão liga/desliga desativado, um tema instalado aparece sem o HTML.

## Criar um tema

Clique em **Novo tema**, ou em **Clonar e editar** em um tema inicial para partir de algo que já tenha um bom visual. O editor tem uma caixa de nome, uma caixa grande de CSS, **Preview** (pré-visualização) e **Salvar**. Um tema novo é ativado quando você o salva e pergunta **Manter este tema?**

O [Guia para autores de temas](theme-author-guide.md#your-first-theme-step-by-step) tem um passo a passo para o seu primeiro tema.

### Crie um tema com a Professor Mari

Você não precisa escrever CSS por conta própria. Peça à Professor Mari com palavras simples, como "crie um tema de outono aconchegante que funcione no meu celular" ou "o que há de errado com meu tema Harbor?". Ela tem um manual para criar e revisar temas e segue estas etapas:

1. **Ela combina a ideia com você primeiro.** Ela pergunta sobre o clima do tema, modo claro ou escuro (ou ambos), seus dispositivos e se você quer imagens e efeitos de tempo, depois resume um visual em uma frase, como "cápsulas de vidro fosco sobre um fundo de mar".
2. **Ela cria o tema desativado.** Ela indica onde experimentá-lo: escolha o tema em **Temas CSS** e pressione **Manter tema** em até 15 segundos. Se você pedir que ela mesma o ative, a aba pergunta **Manter este tema?** da mesma forma e volta ao visual anterior se ninguém responder.
3. **Ela pede que você confira.** Mari não consegue ver a sua tela, então indica pontos exatos para conferir, nos modos claro e escuro, e pede uma captura de tela do que parecer errado. Se Marinara desativou o tema, informe a mensagem a ela: a mensagem indica o motivo, e ela corrige o problema.
4. **Ela pode criar as imagens.** Com um modelo de imagem configurado em Conexões, ela cria planos de fundo, molduras e ícones, mostra cada um primeiro e salva no tema quando você aprova. Ela também pode mudar as cores dos detalhes desenhados (imagens SVG) de um tema. Veja [Peça à Professor Mari para criar a arte](theme-author-guide.md#ask-professor-mari-to-make-the-art).

Para revisar um tema, ela lista o que não combina (formatos de canto misturados, sombras, rótulos difíceis de ler), tela por tela, e não muda nada até você dizer o que corrigir.

Mari só trabalha nos seus próprios temas. Os temas iniciais são somente leitura, então primeiro clique em **Clonar e editar** em um deles e peça que ela trabalhe na cópia. Você adiciona fontes, créditos e miniaturas em **Imagens e detalhes de compartilhamento (autor, versão, miniatura, fontes)**.

## Editar, exportar e remover os seus temas

Os seus próprios temas têm três botões na linha:

- **Editar o CSS do tema** (o ícone de código) abre o editor. Editar não muda qual tema está ativo.
- **Exportar** (o ícone de upload) baixa um arquivo `.json` que você pode compartilhar ou importar em outro lugar.
- **Remover** (o ícone de lixeira) exclui o tema depois que você confirma. Não é possível desfazer isso, então exporte o tema primeiro se quiser usá-lo mais tarde.

## Um tema para um chat

Um chat pode ter seu próprio tema:

1. Abra o chat e abra **Configurações do chat**.
2. Em **Tema**, escolha um tema. **Seguir o aplicativo** usa o tema do aplicativo, e **Aparência padrão (sem tema personalizado)** desativa os temas naquele chat.
3. Em um chat com um personagem, marque **Usar em todos os chats com este personagem** para definir esse tema como o tema do personagem.

Configurações e a Biblioteca sempre usam o tema do aplicativo.

## Quem pode mudar temas

No computador que roda Marinara, nenhum segredo é necessário. Em outro dispositivo, como um celular, criar, importar, clonar, editar e remover temas exige o segredo de administrador. Informe-o em **Configurações → Avançado → Segurança**. Escolher um tema que alguém já instalou não exige segredo. Veja [O segredo de administrador](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions).

## Estilos prontos para janelas de chat

Antes de começar: isto não precisa de CSS.

1. Abra **Configurações → Aparência → Botões e janelas do chat**.
2. Em **Estilo dos widgets do chat**, escolha um estilo.

| Estilo | Visual |
| --- | --- |
| **Default** | O visual original. |
| **Dottore** | Molduras de instrumentos em azul-gelo, bordas de metal claro e cantos recortados. |
| **Prof. Mari** | Molduras de livro de histórias com detalhes dourados, azuis de pedras preciosas e Gemas Essenciais nos títulos das janelas. Os botões usam o mesmo fundo das janelas. |

Cada estilo tem sua própria fonte, funciona nos modos claro e escuro e muda juntos os botões, as janelas e as seções expansíveis. Escolher um estilo redefine **Font**, **Shape** e as três cores. As posições das janelas continuam como estão.

Você pode mudar estes itens separadamente:

- **Font** e **Shape** seguem o estilo (**Preset font**, **Preset shape**) até você escolher outra opção.
- **Border & Buttons Color** muda os contornos e os ícones dos botões. Os ícones usam a primeira cor do gradiente.
- **Background Color** preenche botões, janelas, seções expansíveis e campos editáveis.
- **Text Color** muda o texto dos widgets. Os gradientes aparecem nos títulos e rótulos, e os campos editáveis usam a primeira cor.

Cada cor tem um seletor de cor sólida e uma opção de gradiente. **Reset color**, ao lado de um controle, volta a seguir as cores claras ou escuras do estilo. Os brasões decorativos mantêm as cores originais.

### Levar o estilo para o chat

Três botões liga/desliga abaixo dos seletores de cor estendem o estilo. Cada um começa desativado e funciona de forma independente. Desativar um deles restaura o estilo habitual do chat naquela parte, e escolher outro estilo mantém as suas escolhas nesses botões.

| Botão liga/desliga | O que ele aplica |
| --- | --- |
| **Apply preset font** (aplicar fonte do preset) | A fonte dos widgets, nas mensagens, nos campos de entrada e nos controles do chat. |
| **Apply preset shape** (aplicar forma do preset) | A forma da moldura, nas mensagens de Roleplay (clássico e visual novel), na caixa de diálogo de Game, nos campos de entrada e nos controles. As mensagens de Conversation mantêm sua própria forma. |
| **Apply preset colors** (aplicar cores do preset) | As cores de borda, fundo e texto nessas áreas, incluindo as mensagens de Conversation. Suas cores e gradientes personalizados também se aplicam. As falas entre aspas mantêm a Dialogue Highlight Color própria de cada personagem ou persona. Uma mensagem feita de HTML, como o card estilizado de um agente, mantém as cores de texto que ela mesma define. |

Os botões de histórico, **Load More** (carregar mais) e **Show older** (mostrar mais antigas), seguem esses botões liga/desliga como os outros controles do chat. No Game Mode, os botões liga/desliga também se aplicam aos comentários laterais, aos widgets do HUD, ao painel do mapa, às fichas de personagem, aos registros, ao inventário, aos painéis de combate e às janelas de diálogo. Professor Mari também pode criar temas personalizados para essas áreas.

Um tema personalizado ainda pode substituir os estilos. As variáveis de janelas e gavetas em [Estilizar janelas e gavetas do chat](#styling-chat-windows-and-drawers) têm prioridade sobre as cores do estilo. Use `--mari-window-font-family` para as letras das janelas, `--mari-drawer-radius` para os cantos das seções e `--mari-window-ornament: none` para ocultar o ornamento do título. Para remover toda a decoração do estilo, escolha **Default** primeiro.

## Para autores de temas

O restante deste guia é material de referência para quem escreve o CSS de temas à mão. Comece pelo [Guia para autores de temas](theme-author-guide.md), que lista todos os tokens estáveis, ganchos de partes e regras de segurança.

## Temas e Card CSS

Marinara tem duas formas de adicionar CSS personalizado, e as duas podem ficar ativas ao mesmo tempo.

- Um tema personalizado repinta o aplicativo inteiro. Ele pode substituir as variáveis centrais do Marinara, usar `!important` e usar `position: fixed`.
- O Card CSS fica embutido em um card de personagem ou de persona e é ativado por chat. A limpeza dele é mais rígida: ele não pode substituir as variáveis centrais, o `!important` é removido e `position: fixed` vira `position: absolute`. Ele estiliza as mensagens do chat, não o aplicativo inteiro. Veja o [Guia de temas com Card CSS](card-css-theming.md).

## Limites de tamanho e de nome

O nome do tema aceita até 200 caracteres. O CSS aceita até 256 KiB, medidos em bytes UTF-8. Um tema maior é recusado quando você o salva ou importa. O CSS do tema personalizado também é limpo antes de rodar: estilos que carregam um arquivo de outro site não funcionam. Em vez disso, incorpore a imagem ou a fonte como uma URI `data:`.

## Referência das variáveis de CSS

O editor de temas tem uma seção retrátil chamada **CSS Variable Reference**. Clique nela para ver as variáveis mais úteis que podem ser substituídas. Um tema muda o aplicativo definindo essas variáveis em um bloco `:root`. A referência lista estas variáveis:

| Variável | O que ela controla |
| --- | --- |
| `--background` | Plano de fundo da página |
| `--foreground` | Texto principal |
| `--primary` | Destaque e botões |
| `--primary-foreground` | Texto sobre a cor primária |
| `--secondary` | Cards e campos |
| `--card` | Plano de fundo do card |
| `--border` | Bordas |
| `--muted-foreground` | Texto esmaecido |
| `--sidebar` | Plano de fundo da barra lateral |
| `--sidebar-border` | Borda da barra lateral |
| `--marinara-shell-edge-border` | Borda esquerda e direita da moldura |
| `--destructive` | Erro e exclusão |
| `--popover` | Plano de fundo do menu suspenso |
| `--accent` | Realce ao passar o mouse |

Um tema pode definir qualquer variável de CSS que Marinara usa, não só estas. Alguns efeitos têm variáveis próprias. Por exemplo, `--marinara-theme-accent-pulse: enabled` pede a animação de pulso do destaque.

## Estilizar janelas e gavetas do chat

No computador, **Chat Settings** abre como uma janela móvel. Suas seções recolhíveis são chamadas de **drawers** (gavetas). Uma gaveta pode sair para uma janela própria e depois se minimizar em um pequeno botão móvel, chamado **bubble** (bolha).

Outras ferramentas do chat também usam essas janelas e botões, incluindo Game controls, Session, Volume, Game Assets, chats conectados e controles de pacotes. No celular, a maioria das janelas abre como painéis de largura total; Echo Chamber continua sendo uma janela compacta que você pode mover e redimensionar. As ferramentas retiradas de Chat Settings ficam no menu móvel de três pontos **Chat tools** (ferramentas do chat); os botões dos trackers continuam separados.

As classes, os atributos de dados e as variáveis abaixo permitem que um tema estilize essas partes juntas. As regras do seu tema substituem os padrões sem `!important`.

### Classes

| Parte | Classe |
| --- | --- |
| Janela | `.mari-window` |
| Barra de título | `.mari-window__header` |
| Título e seu ícone | `.mari-window__title-row` |
| Título | `.mari-window__title` |
| Botões da barra de título (Reset View, estrela de layout favorito, Tracker Panel, fixar, travar, fechar, Put back) | `.mari-window__controls` (cada botão é `.mari-window__control`) |
| Conteúdo da janela | `.mari-window__body` |
| Bordas e cantos de redimensionamento | `.mari-window__resize-handle` |
| Marca no canto exibida quando o ponteiro ou o foco está na janela | `.mari-window__resize-grip` |
| Gaveta | `.mari-drawer` |
| Cabeçalho e título da gaveta | `.mari-drawer__header`, `.mari-drawer__title` |
| Ícone, contador e **?** da gaveta | `.mari-drawer__icon`, `.mari-drawer__count`, `.mari-drawer__help` |
| Prévia de uma gaveta recolhida (widget pequeno do tracker) | `.mari-drawer__summary` |
| Botões ao lado da seta e botão para destacar a gaveta | `.mari-drawer__actions`, `.mari-drawer__popout` |
| Seta e conteúdo da gaveta | `.mari-drawer__arrow`, `.mari-drawer__body` |
| Prévia que segue o ponteiro ao arrastar uma gaveta para fora | `.mari-drawer-ghost` |
| Botão de uma janela minimizada (bolha) | `.mari-window-bubble` |
| Resumo ao vivo que uma bolha mostra no lugar do ícone (o banner de World State) | `.mari-window-bubble__banner` |
| Linha exibida quando uma bolha arrastada se alinha a outra | `.mari-window-snap-guide` |
| Ponto exibido enquanto os agentes trabalham (botão Chat Settings, janela Trackers) | `.mari-agents-running-dot` |

### Atributos de dados

- `data-window` identifica uma janela e sua bolha: `chat-settings`, `trackers`, as janelas de controles `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` e `control:beholder:<package>`, e `drawer:<window>:<drawer>` para uma gaveta destacada, por exemplo `drawer:chat-settings:chat-name`.
- `data-drawer` identifica uma gaveta, por exemplo `chat-name`. Alguns nomes começam com o modo do chat, como `roleplay-agents` ou `conversation-agents`. Os trackers usam `tracker-world`, `tracker-persona`, `tracker-characters`, `tracker-quests`, `tracker-inventory`, `tracker-custom` e `agent-activity`.
- `data-presentation` vale `"window"` em uma janela de computador ou `"sheet"` em um painel de celular.
- `data-pinned` e `data-locked` valem `"true"` enquanto a janela está fixada ou travada.
- `data-window-control` identifica cada botão da barra de título: `"pin"`, `"lock"`, `"close"` ou `"put-back"`. Um botão de fixar ou travar ativado também tem `aria-pressed="true"`.
- `data-chat-settings-control` identifica os botões extras da barra de título de Chat Settings: `"reset-view"`, `"favorite-layout"` e `"tracker-panel"`. A estrela favorita tem `aria-pressed="true"` e um ícone preenchido quando o layout atual corresponde ao favorito salvo.
- `data-edge` vale `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"` ou `"sw"` em cada alça de redimensionamento.
- O botão de abrir e fechar de uma gaveta aberta, dentro de `.mari-drawer__header`, tem `aria-expanded="true"`.
- `data-drawer-control="pop-out"` marca o botão para destacar uma gaveta.
- `data-outside="true"` marca uma prévia de arraste longe o bastante da janela para se destacar ao soltar.
- `data-axis` vale `"x"` em uma guia de alinhamento vertical e `"y"` em uma horizontal.
- `data-detached` vale `"true"` quando uma gaveta aparece em sua própria janela, tanto na janela quanto na gaveta dentro dela. A janela de uma gaveta destacada é identificada por `data-window="drawer:<window>:<drawer>"`, por exemplo `data-window="drawer:chat-settings:chat-name"`, e `data-drawer-host` indica a janela de origem.
- `data-dragging` vale `"true"` em uma gaveta enquanto seu título é arrastado, e `data-drop-target` vale `"true"` em uma janela quando uma gaveta destacada fica sobre ela, pronta para voltar.
- Uma bolha tem o `data-window` da sua janela e `data-minimized="true"`, por exemplo `.mari-window-bubble[data-window="control:volume"]`. As janelas de controles se chamam `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` e `control:beholder:<package>`. `data-dragging` vale `"true"` em uma bolha durante o arraste. Uma bolha que mostra um resumo ao vivo no lugar do ícone, como um tracker World State minimizado, tem `data-banner="true"` e fica tão larga quanto o resumo.
- Uma bolha travada tem `data-locked="true"`, inclusive o botão Chat Settings. Ela continua abrindo sua janela, mas não pode ser movida até a janela ser destravada. Use `.mari-window-bubble[data-locked="true"]` para dar uma aparência diferente a esses botões.
- No celular, as janelas têm `data-presentation="sheet"`, assim como suas bolhas, que são um pouco maiores. A bolha de Tracker Panel é `.mari-window-bubble[data-tracker-panel-toggle="bubble"]`.
- O botão Chat Settings também é uma bolha: `.mari-window-bubble[data-chat-settings-button]`, com `data-open="true"` enquanto Chat Settings está aberto.
- Uma seção destacada se reduz a uma bolha com `data-drawer-host` (a janela de origem), e o botão **Put back** da sua janela é `[data-window-control="put-back"]`.

### Variáveis

Cada variável usa as cores compartilhadas dos controles do chat quando não é definida, então o tema só precisa das que você quer alterar.

| Variável | O que controla |
| --- | --- |
| `--mari-window-bg` | Fundo da janela |
| `--mari-window-text` | Texto da janela |
| `--mari-window-border`, `--mari-window-border-width` | Borda da janela |
| `--mari-window-radius` | Arredondamento dos cantos da janela |
| `--mari-window-shadow` | Sombra da janela |
| `--mari-window-backdrop-filter` | Desfoque atrás da janela |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | Cores da barra de título |
| `--mari-window-header-padding` | Espaçamento da barra de título |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | Botões da barra de título, incluindo a estrela favorita |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | Botões da barra de título ativados, incluindo fixar, travar e a estrela favorita preenchida |
| `--mari-window-control-radius`, `--mari-window-control-gap` | Arredondamento e espaçamento dos botões |
| `--mari-window-focus-ring` | Contorno do foco do teclado e da janela para onde uma gaveta vai voltar |
| `--mari-window-resize-handle-size` | Largura das bordas de redimensionamento |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | Tamanho, arredondamento e sombra das bolhas |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | Fundo e borda das bolhas |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | Cor do ícone da bolha |
| `--mari-window-snap-guide` | Cor da guia de alinhamento |
| `--mari-drawer-bg`, `--mari-drawer-border` | Fundo e separador da gaveta |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | Cores do cabeçalho da gaveta |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | Espaçamento da gaveta |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | Texto e ícones do cabeçalho da gaveta |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | Contador da gaveta |

Defina uma variável em `:root` para mudar todas as janelas, ou em um seletor para mudar uma:

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

## Estilizar mensagens, campos de entrada e controles do chat

Os três botões **Apply preset** também permitem que um tema personalizado use o design dos widgets no restante do chat. Um tema pode substituir cada parte com as variáveis abaixo. Peça à Professor Mari um tema de chat que combine se preferir não escrever o CSS por conta própria.

| Parte | Classe |
| --- | --- |
| Caixas de mensagem de Roleplay e Game, comentários laterais de Game, widgets do HUD, painel do mapa e fichas de personagem, e campos de entrada do chat | `.mari-chat-style-surface` |
| Registros, inventário, painéis de combate, escolhas e janelas de diálogo de Game; os painéis também têm `data-game-section` com o nome deles, como `logs`, `inventory` ou `combat-actions` | `.mari-game-section.mari-chat-style-surface` |
| Conteúdo de Game dentro de uma janela, como o Journal, que segue as cores da janela | `.mari-game-section` |
| Mensagens de Conversation (somente fonte e cores) | `.mari-chat-style-conversation` |
| Texto de mensagens de Conversation sem caixa | `.mari-chat-style-text` |
| Controles do chat, incluindo Calls e controles de grupo de Conversation | `.mari-chat-style-control` |
| Botões de histórico: **Load More**, **Show older**, **Show newer**, **Latest** e, nos registros do Game, **Older**, **All** e **Show more older logs**. Eles também têm `.mari-chat-style-control` | `.mari-chat-history-pager` |
| Uma mensagem feita de HTML, como o card estilizado de um agente. As cores de texto definidas dentro dela são mantidas quando **Apply preset colors** está ligado | `.mari-html-content` |

| Variável | O que controla |
| --- | --- |
| `--mari-chat-font-family` | Fonte das áreas correspondentes do chat |
| `--mari-chat-bg` | Fundo da caixa; aceita uma cor ou um gradiente |
| `--mari-chat-text` | Cor sólida e legível do texto |
| `--mari-chat-border` | Contorno da caixa; aceita uma cor ou um gradiente |
| `--mari-chat-border-color` | Cor sólida de reserva para a borda |
| `--mari-chat-radius` | Arredondamento da caixa, exceto nas mensagens de Conversation |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | Fundos dos botões do chat |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | Cor dos ícones e arredondamento dos botões do chat |
| `--mari-chat-input-bg` | Fundo dentro dos campos editáveis |

Por exemplo, com **Apply preset font** e **Apply preset colors** ativados:

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

As variáveis não definidas seguem as configurações e o preset dos widgets. O botão correspondente precisa estar ativado para essas variáveis se aplicarem pelo estilo integrado. As mensagens de Conversation mantêm sua própria forma mesmo com **Apply preset shape** ativado. Os temas personalizados também podem usar as classes diretamente; mantenha os contornos de foco, os menus e o conteúdo das mensagens fora de qualquer recorte decorativo.

No celular, o menu de três pontos se expande em botões redondos. Seu acionador é `[data-chat-tools-menu-button]`, a pilha aberta é `[data-chat-tools-menu]` e cada item da lista tem `data-chat-tools-menu-item` definido com o ID de sua janela. Os botões de ferramentas usam `.mari-window-bubble.mari-chat-tools-button` e `data-chat-tools-menu-tool` com esse mesmo ID. A pilha não tem moldura de janela; seus botões seguem as cores dos widgets e o tamanho dos botões, independentemente dos três botões liga/desliga para o restante do chat, mantendo sua forma redonda.

<a id="styling-character-sheets"></a>
## Estilizar fichas de personagem

A ficha de um conjunto de regras tem o mesmo visual em Roleplay e Game. Estas classes e atributos permitem estilizá-la com um tema.

| Parte | Classe | Atributos de dados |
| --- | --- | --- |
| Ficha inteira | `.mari-ruleset-sheet` | `data-ruleset` (ID das regras, como `local/my-rules`), `data-rank-display` (`value`, `label`, `dots`, `roman` ou `number`), `data-editing="true"` durante a edição |
| Título e **Editar ficha** | `.mari-ruleset-sheet__header` | |
| Abas | `.mari-ruleset-sheet__tabs` | Cada aba tem `data-tab-id` e `aria-selected` |
| Título de grupo | `.mari-ruleset-sheet__heading` | |
| Campo no topo | `.mari-ruleset-sheet__field` (em `.mari-ruleset-sheet__fields`) | `data-field`, ou `data-derived` para valor calculado |
| Atributo | `.mari-ruleset-sheet__ability` (em `.mari-ruleset-sheet__abilities`); pontuação e valor do teste: `__ability-score` e `__ability-value` | `data-ability`; o grupo tem `data-section` |
| Reserva, como Saúde | `.mari-ruleset-sheet__pool` (em `.mari-ruleset-sheet__pools`) | `data-pool`; o grupo tem `data-pool-group` |
| Medidor | `.mari-ruleset-sheet__track` (em `.mari-ruleset-sheet__tracks`) | `data-track`; o de feridas também tem `data-wound="true"` |
| Condições | `.mari-ruleset-sheet__conditions` | |
| Perícia treinada ou salvaguarda | `.mari-ruleset-sheet__rank` (em `.mari-ruleset-sheet__trained`, por grupo em `.mari-ruleset-sheet__rank-group`); grau, ou valor do teste com `data-rank-display="value"`: `__rank-value`; valor ao lado no celular: `__rank-check`; prática: `__practice` | `data-skill` ou `data-save`, `data-tier` (ID do nível), `data-rank` (`0` não treinado, `1` próximo nível etc.) |
| Perícia ou salvaguarda em edição | `.mari-ruleset-sheet-editor__rank` | `data-skill` ou `data-save`, `data-tier`, `data-rank` |
| Lista, como Equipamento | `.mari-ruleset-sheet__list`; cada linha: `.mari-ruleset-sheet__list-row` | `data-list`; linha marcada tem `data-marked="true"` |

O exemplo mostra o grau 2 de um conjunto como duas estrelas. Adicione um par de regras assim para cada grau a mudar. Use só em regras que mostram graus como pontos, nomes, algarismos romanos ou números: se mostram valores de teste, `__rank-value` contém o valor e isso o ocultaria.

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## Guias relacionados

- [Guia para autores de temas](theme-author-guide.md)
- [Efeitos de tempo no seu tema](theme-weather.md)
- [Guia de temas com Card CSS](card-css-theming.md)
- [Configurações de aparência](appearance-settings.md)
- [Referência de configuração do servidor](../CONFIGURATION.md)
- [Acesso remoto: login e lista de IPs permitidos](../REMOTE_ACCESS.md)
