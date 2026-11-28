# Guia para autores de temas

Este guia é para quem cria ou compartilha os próprios temas. A primeira parte orienta você na criação do primeiro tema, sem precisar de experiência com programação. O restante é uma referência: cada cor, imagem e parte que um tema pode alterar, e as regras de segurança que todo tema segue. Para escolher, experimentar, importar ou remover um tema, veja [Temas CSS personalizados](custom-css-themes.md).

**Versão 1 do contrato de tokens** (`--mari-tokens-version: 1` em `:root`). Os nomes deste guia continuam funcionando entre versões. Quando um deles precisa mudar, a versão aumenta e a mudança aparece em [Alterações](#changes), no final. Todo o resto (outras variáveis `--ov-*`, `--mari-*` e `--marinara-*`, classes do Tailwind, estrutura dos elementos) é interno e pode mudar em qualquer atualização.

## Seu primeiro tema, passo a passo

Um tema é uma lista curta de configurações escritas em CSS, a linguagem que as páginas da web usam para cores e fontes. Você não precisa saber CSS para começar. Cada linha tem o formato `--name: value;`: um **token** (uma configuração com nome que começa com `--`), dois-pontos, o valor e um ponto e vírgula.

1. Abra **Biblioteca → Configurações → Aparência** e clique em **Temas CSS** na linha de seções.
2. Para alterar um tema inicial, baixe um de que goste em **Explorar a galeria de temas**, encontre-o em **Temas iniciais** e clique em **Clonar e editar** (o ícone de cópia). Marinara cria uma cópia sua, chamada, por exemplo, "Petal OS (minha cópia)", e a abre no editor. Os temas iniciais continuam somente leitura, então o original sempre fica disponível. Para começar do zero, clique em **Novo tema**. O modelo tem linhas entre `/*` e `*/`, que ficam desativadas. Exclua essas marcas ao redor de uma linha para ativá-la.
3. Digite um nome na caixa de nome.
4. Altere uma cor. Encontre uma linha como `--primary: #3fae7a;` e substitua a cor. `#3fae7a` é um código hexadecimal de cor. Qualquer seletor de cores na web fornece um. Nomes como `teal` também funcionam.
5. Deixe **Pré-visualização** ativada. O aplicativo muda conforme você digita, então você vê cada alteração na hora.
6. Veja abaixo do editor. **Nenhum problema de CSS encontrado.** significa que o CSS está correto. Caso contrário, cada problema aparece com o número da linha, como a falta de um `;` ou `}`.
7. Clique em **Salvar**. O novo tema é ativado, e Marinara pergunta **Manter este tema?** Clique em **Manter tema** em até 15 segundos, ou o visual anterior volta.

Os tokens que a maioria das pessoas altera primeiro:

| Token | O que ele colore |
| --- | --- |
| `--background` | A página atrás de tudo |
| `--foreground` | Texto principal |
| `--primary` | Botões, links e destaques |
| `--card` | Cartões e painéis |
| `--sidebar` | As barras laterais de chats e da Biblioteca |
| `--border` | Linhas ao redor dos elementos |
| `--mari-font-ui` | A fonte do aplicativo, por exemplo `"Georgia", serif` |

Um tema pequeno:

```css
:root {
  --mari-tokens-version: 1;
  --primary: #3fae7a;
  --mari-selected-tint: var(--primary);
  --mari-font-ui: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --background: #0f1712;
  --card: color-mix(in srgb, #0f1712 80%, transparent);
  --sidebar: #0b120e;
}
```

`:root { … }` contém configurações para todos os esquemas de cores. `[data-theme="dark"] { … }` contém configurações só para Escuro, e `[data-theme="light"] { … }` só para Claro. Para ver a lista completa de tokens enquanto trabalha, abra **Referência de variáveis CSS** abaixo do editor ou leia [Tokens de cor](#colour-tokens) abaixo.

### Adicione imagens e fontes

Abra **Imagens e detalhes de compartilhamento (autor, versão, miniatura, fontes)** abaixo do editor e clique em **Adicionar imagens**. Clique no nome de uma imagem para inseri-la no CSS na posição do cursor. Veja [Imagens](#pictures) e [Planos de fundo](#backdrops) para saber onde colocar imagens.

As imagens e fontes precisam estar dentro do tema. Um tema não pode carregar nada de outro site, então um link para uma imagem ou uma fonte do Google no CSS não funciona.

### Peça à Professor Mari para criar a arte

Se você tem um modelo de imagem configurado em **Conexões** (Codex, NovelAI, ComfyUI, um modelo de imagem da OpenAI e assim por diante), a Professor Mari pode criar as imagens de um tema e colocá-las nele. Peça com palavras simples, por exemplo "crie um plano de fundo de céu noturno para o meu tema Harbor" ou "coloque uma moldura de latão nos cartões do Início".

1. Mari só trabalha nos seus próprios temas. Para um tema inicial, clique primeiro em **Clonar e editar** e peça que ela trabalhe na cópia.
2. Ela escreve o prompt da imagem e o envia ao modelo de imagem exatamente como foi escrito. Seus perfis de estilo de imagem e prefixos de prompt (geralmente configurados para arte de personagens) ficam de fora, para que um plano de fundo não acabe virando um retrato.
3. Mari examina cada imagem (as pequenas são ampliadas, as partes transparentes ficam sobre cinza) antes de descrevê-la, e você a vê antes de qualquer alteração. Peça algumas versões para escolher (até 4 por vez), ou ajustes como "recorte só a metade de cima", "deixe o fundo branco transparente" ou "diminua a imagem". Cada ajuste cria uma nova versão, e as anteriores são mantidas.
4. Quando você aprova, Mari salva a imagem no tema (como WebP, da mesma forma que **Adicionar imagens**) e a insere no CSS do tema. Ela aparece em **Imagens e detalhes de compartilhamento**, como qualquer imagem que você adicionou.

Enfeites desenhados, como trilhos, cercas e botões de enviar, são imagens SVG. Mari pode recolori-los diretamente, sem o modelo de imagem, e eles continuam nítidos.

Cada imagem leva o tempo de que o modelo de imagem precisa, muitas vezes de meio minuto a um minuto e meio. Se a conexão de imagem usa um fluxo de trabalho próprio do ComfyUI, o texto incorporado nesse fluxo continua sendo enviado.

### Compartilhe o tema

1. Em **Imagens e detalhes de compartilhamento**, preencha **Autor**, **Versão** (como `1.0`), **Descrição** e **Miniatura**, e escolha **Feito para** (Escuro, Claro ou ambos). Para sugerir suas cores e fonte junto com o tema, clique em **Usar minha Aparência atual** em **Configurações**. Salve.
2. Clique em **Exportar** (o ícone de envio) na linha do tema. Marinara salva um arquivo `.json` com o CSS, as imagens e as fontes dentro dele.
3. Se você usou arte ou fontes de outra pessoa, abra o arquivo em um editor de texto e adicione créditos e uma licença. Veja [Arquivos de tema](#theme-files).
4. Envie esse arquivo. A outra pessoa o importa com **Importar arquivo** e vê seu nome, os créditos e uma lista de tudo o que o tema altera antes de instalá-lo.

### Se algo der errado

Marinara mantém a barra superior, as barras laterais, <kbd>Ctrl</kbd>+<kbd>K</kbd> e a caixa de mensagem utilizáveis, independentemente do que um tema faça. Se o tema ocultar, mover ou cobrir uma dessas partes, Salvar informa o que deu errado. Você ainda pode escolher **Salvar mesmo assim**, mas Marinara desativa o tema em uma aba assim que ele interfere em uma delas. Para voltar ao visual normal a qualquer momento, pressione <kbd>Esc</kbd> três vezes, adicione `?safe` ao final do endereço, ou pressione <kbd>Ctrl</kbd>+<kbd>K</kbd> e digite "Tema personalizado".

Os temas iniciais são bons exemplos para aprender. Clone um e leia o CSS para ver como ele usa os tokens e os pontos de personalização das partes abaixo.

## Como um tema tem prioridade

O CSS do aplicativo fica em camadas de cascata, declaradas logo no início de `index.html`:

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- Um tema fica **fora das camadas**, então um seletor simples no tema tem prioridade sobre qualquer regra do aplicativo sem `!important`, independentemente da especificidade da regra do aplicativo.
- `mari-pickers` contém os seletores de Aparência (plano de fundo, destaque, fontes, cores do chat). Fica acima dos padrões do aplicativo e abaixo de um tema, então as cores do tema têm prioridade sobre os seletores, e Aparência informa quando um tema substitui um seletor.
- `!important` em um tema continua funcionando. Essas regras são copiadas para `mari-theme-important`, que tem prioridade sobre as regras `!important` do aplicativo.
- `mari-protected` mantém a barra superior, a barra lateral de chats, a barra lateral da Biblioteca e Ctrl+K no lugar. Um tema pode reestilizá-los (cores, fontes, bordas, raio, sombras), mas não ocultá-los, movê-los, encolhê-los ou cobri-los. Se tentar, o tema é desativado naquela aba e o usuário recebe uma explicação.
- Uma transição pode esperar no máximo um segundo antes de começar (`transition-delay`, ou o segundo tempo em `transition`). Um tema que adia uma mudança por mais tempo é recusado, para que nada apareça muito depois da verificação da tela. As animações podem usar qualquer atraso.

O caminho de volta sempre funciona: `?safe` na URL, **Escape três vezes**, ou Ctrl+K > "Tema personalizado" desativa o tema. Um tema novo pergunta "Manter este tema?" e volta atrás depois de 15 segundos.

## Tokens de cor

### Básicos (todo estilo visual os define)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`,
`--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`,
`--border`, `--input`, `--ring`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`,
`--sidebar-accent`, `--sidebar-accent-foreground`.

Os valores são cores CSS completas (`#1b1530`, `rgb(…)`, `oklch(…)`). Triplas HSL isoladas, como `270 25% 8%` (a convenção do shadcn), **não** são válidas aqui.

Defina os escopos claro e escuro separadamente com `[data-theme="light"]` e `[data-theme="dark"]`.

### Novo layout

| Token | Uso |
| --- | --- |
| `--ov-line` | Linhas finas e bordas dos painéis |
| `--ov-text`, `--ov-muted`, `--ov-dim` | Texto, texto secundário, texto esmaecido |
| `--ov-accent` | Pontos de destaque (o padrão é `--primary`) |
| `--ov-hover`, `--ov-active-bg` | Fundos ao passar o mouse e ao pressionar |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | Cores dos modos de chat na barra lateral de chats e nos editores |
| `--ov-serif` | Fonte dos títulos (segue `--mari-font-heading`) |
| `--mari-selected-tint` | Linhas, etiquetas arredondadas e botões liga/desliga selecionados. Neutro (`--foreground`) por padrão; defina como `var(--primary)` para tingir a seleção com a cor de destaque |
| `--mari-selected-bg`, `--mari-selected-ring` | Derivados da tonalidade (10% e 18%) |

### Tokens de tema (v1)

Cada um usa o visual do aplicativo por padrão. O modo Claro tem valores próprios que permitem boa leitura.

| Token | Uso |
| --- | --- |
| `--mari-font-ui` | A fonte de todo o aplicativo |
| `--mari-font-heading` | Títulos de páginas e seções |
| `--mari-font-chat` | Texto das mensagens nos chats de Roleplay e Conversation |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game` | Etiquetas do Início, chats recentes, inicializador de novo chat, rótulos acima dos títulos dos widgets do Início |
| `--mari-home-pink`, `--mari-home-violet` | Os outros destaques dos widgets do Início |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline` | Pontos e rótulos de presença |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger` | Medidores de Game e barras de HP. A cor do próprio widget ainda tem prioridade no estado normal; perigo sempre usa o token |
| `--mari-game-combat`, `--mari-game-combat-text` | O botão Combate de Game |
| `--mari-stage-empty-bg` | O cenário de Game antes de carregar uma imagem de cena (qualquer `background`, inclusive gradientes) |
| `--mari-scrim` | O fundo escurecido atrás de Ctrl+K |
| `--mari-user-avatar-placeholder` | Seu avatar quando você não tem imagem (um gradiente) |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | O gradiente dos cartões sem imagem. Cada cartão mantém o próprio matiz; defina estes valores (em porcentagens) para suavizar os gradientes |
| `--mari-app-backdrop` | Uma imagem ou gradiente atrás de todo o aplicativo, desenhado uma vez (veja abaixo) |
| `--mari-accent-fx-animation` | A animação de Pulsação do destaque ou Modo RGB enquanto um deles está ativado; caso contrário, `none` |

### Tokens de tema adicionados na v1.1

Eles não têm valor até que um tema os defina, então a configuração do usuário vale até lá.

| Token | Uso |
| --- | --- |
| `--mari-text-outline` | O contorno do texto das mensagens, por exemplo `0` para desativar ou `1px #3b2a1a`. Caso contrário, usa a configuração Contorno do texto do usuário |
| `--mari-dialogue-color` | Cor do diálogo quando o personagem ou a persona não tem uma própria (a cor própria ainda tem prioridade) |
| `--mari-chat-font-size` | Tamanho do texto das mensagens. O mínimo de Acessibilidade continua valendo |
| `--mari-composer-placeholder` | O texto de exemplo da caixa de mensagem, como uma string entre aspas: `"> waiting for user input..."`. Defina em `:root` ou em um campo de mensagem, como `[data-composer="game"]`. Textos que pedem chaves ou senhas são ignorados |
| `--mari-page-veil` | Uma cor sobre Configurações, a Biblioteca, editores e Documentação, para que textos longos continuem legíveis sobre um plano de fundo. `transparent` por padrão |
| `--mari-page-floor` | A camada quase opaca sobre a qual cada página inteira fica acima de um plano de fundo. Padrão `color-mix(in srgb, var(--background) 94%, transparent)`; `transparent` a remove |
| `--mari-top-bar-bg` | Um valor completo de `background` para a barra superior: uma imagem, um gradiente ou várias camadas. `--mari-top-bar-rendering: pixelated` mantém a pixel art nítida. As abas e os ícones sempre ficam por cima e visíveis |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius` | Sobre a arte da barra superior, cada aba, aba de chat aberto, botão de ícone e o logotipo ficam sobre uma base para continuar legíveis. Estes tokens definem a cor da base e o raio dos cantos (padrão `0.5rem`); defina o raio como `0` para botões quadrados em pixel art. |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | Uma faixa sob as abas da barra superior (um letreiro ou cerca) passa à linha do grupo enquanto ela aparece (`:root[data-ov-tabrow]`; a linha é `[data-tab-row]`). Defina em `[data-tab-row]` um `background`, a altura e o espaço abaixo das abas (padrão: a altura; `0px` deixa atrás). `[data-mari-part="tab-row-strip"]` pode ser animado. Remova você a faixa da barra sob `:root[data-ov-tabrow]`. |
| `--mari-msg-head-rule` | A linha abaixo do nome nas mensagens de Roleplay (um valor de `border-bottom`, como `none` ou `2px dashed currentColor`) |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg` | Moldura e superfície de cada widget do Início, incluindo a Professor Mari |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | Tipografia dos widgets do Início. Os widgets ficam mais altos quando o texto precisa de espaço, em vez de cortá-lo |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale` | O rótulo pequeno acima dos títulos dos widgets, o texto do botão Perguntar da Professor Mari e o tamanho da imagem da Mari (1 = padrão) |
| `--mari-home-wash` | A tonalidade que o Início aplica sobre um plano de fundo (padrão: 65% da cor do cartão); `transparent` mostra a arte com intensidade total |
| `--mari-home-art` | `none` oculta as imagens padrão dos cartões do Início; elas são carregadas sob demanda, então as ocultas nunca são baixadas. São imagens pequenas dentro de cartões individuais (Novidades, Em volta da mesa), não um fundo do Início: a arte atrás do Início é o plano de fundo do aplicativo |
| `--mari-ambient` (e `-opacity`, `-blend`, `-animation`) | A sobreposição ambiente: veja Sobreposição ambiente |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji` | Uma imagem no lugar do ícone da caixa de mensagem (um valor de `background-image`) |
| `--mari-cursor`, `--mari-cursor-pointer` | Um ponteiro de imagem (um valor completo de `cursor`). Tem prioridade sobre Cursor do mouse personalizado enquanto o tema está ativado |

### Tokens de tema adicionados na v1.4

Como os tokens da v1.1, o primeiro grupo não faz nada até que um tema o defina.

| Token | Uso |
| --- | --- |
| `--mari-message-time` | A cor dos horários das mensagens (`[data-mari-part="time"]`) em todos os modos de chat |
| `--mari-chat-wash` | A tonalidade sobre o fundo de um chat de Roleplay, como um valor completo de `background`. O padrão é uma camada escura, branca com tom de lavanda no modo Claro. `none` a remove |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal` | Os pontos de status das entradas de lorebook |
| `--mari-toast-font-size` | Tamanho do texto das notificações temporárias (elas já usam `--mari-font-ui`) |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size` | As linhas de atalhos Conhecer o Engine e Comunidade do Início. Se apenas `--mari-home-widget-text-size` estiver definido, elas o seguem, com descrições em 0,85x |
| `--mari-min-ui-text` | Um limite mínimo para os menores textos do aplicativo (rótulos, contagens e etiquetas de 9 a 12 px). Também é possível definir `--text-xs`, `--text-sm` e `--text-base` do Tailwind |
| `--mari-user-avatar-image` | Uma imagem para seu avatar quando a persona não tem uma. Sem o token, o espaço reservado agora mostra a imagem da própria persona quando ela tem uma |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | Espaços, veja abaixo |

Estes substituem valores que eram fixos no aplicativo e usam o visual padrão como alternativa:

| Token | Uso |
| --- | --- |
| `--mari-chrome-accent` | O sublinhado da aba ativa, estruturas dos editores, seletores e telas de conexão |
| `--mari-chrome-muted` | Texto secundário cinza em painéis, barras laterais e no Início (padrão: 58% do texto da interface) |
| `--mari-resource-accent`, `--mari-resource-<type>` | As cores da Biblioteca por tipo: `characters`, `personas`, `lorebooks`, `presets`, `connections`, `agents`, `settings`, `backgrounds`, `browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game` | Cores das linhas de Ctrl+K por modo |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | O botão Combate de Game (os dois fundos são um `background` completo, então um gradiente funciona; dê a ele também uma camada de cor sólida) |
| `--mari-accent-text` | O destaque quando usado em texto pequeno ou ícone (abas ativas, rótulos de seção, links). Padrão: a cor de destaque, escurecida no modo Claro e clareada no Escuro o suficiente para permitir a leitura |
| `--mari-top-bar-plate-active` | A base atrás de um controle ativo da barra superior quando a barra tem arte (padrão: a base misturada com 20% de destaque) |
| `--mari-chat-header-bg` | O esmaecimento atrás do cabeçalho da conversa (padrão: a cor da página a 88% desaparecendo gradualmente; `none` sob um plano de fundo do aplicativo) |
| `--mari-home-hero-padding`, `--mari-home-widget-glow` | O espaçamento interno da saudação do Início e o brilho atrás do cabeçalho de um widget do Início |

O aplicativo também publica `--mari-top-bar-height` em `<html>` (a altura real da barra superior, que muda quando um tema a deixa mais alta), para que um tema possa deixar espaço nas próprias camadas abaixo dela.

### Tokens de tema adicionados na v1.5

Para respostas longas e partes que antes exigiam classes internas. Cada um não faz nada até que um tema o defina, exceto quando há um valor padrão indicado.

| Token | Uso |
| --- | --- |
| `--mari-chat-column` | A coluna de Roleplay compartilhada pelas mensagens e pela caixa de mensagem (padrão 58rem). A opção Configurações do chat → Largura da área do chat do leitor ainda tem prioridade |
| `--mari-message-measure` | A linha mais longa do texto das mensagens, por exemplo `68ch` (Roleplay e Conversation) |
| `--mari-chat-line-height` | Altura da linha do texto das mensagens em todos os modos de chat (padrão 1,5). Acessibilidade → Espaçamento entre linhas ainda tem prioridade |
| `--mari-dialogue-weight` | O peso da fala entre aspas (`[data-mari-part="dialogue"]`), por exemplo `400` para que uma fala longa não vire um bloco em negrito |
| `--mari-dialogue-color` | Agora também aparece quando as cores `--mari-chat-*` do tema ativam a aplicação de cores do chat, assim como as cores que um tema atribui a itálicos e links |
| `--mari-paragraph-gap` | Espaço entre parágrafos no lugar de uma linha em branco, por exemplo `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg` | `on`: a linha do nome em uma resposta alta de Roleplay fica no topo do chat enquanto você rola por ela (computador e tablet). O fundo usa o do balão por padrão |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | Onde a linha fixada fica (padrão: a borda superior do chat visível) e quanto ela se estende além do texto (padrão 1rem) |
| `--mari-phone-avatar` | `hidden`: celulares removem a coluna do avatar no Roleplay, para que a resposta use toda a largura |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` | A imagem pequena ao lado do nome nos celulares (**Fotos de perfil no celular: Mini**, o padrão): o tamanho e o anel como `box-shadow`. É `[data-mari-part="mini-avatar"]` com `data-role` (`user`, `assistant`) |
| `--mari-phone-convo-avatar` | `full`: chats de Conversation mantêm a coluna completa do avatar nos celulares mesmo quando o usuário escolheu **Mini** |
| `--mari-vn-fade` | O esmaecimento no rodapé da caixa de texto de VN enquanto há mais do parágrafo abaixo (padrão 1,75rem, `0` o desativa) |
| `--mari-message-actions`, `--mari-swipe-counter` | A cor das ferramentas abaixo de uma mensagem e do contador de swipes "2 / 5" |
| `--mari-card-art-placeholder` | Um `background` completo para cartões da Biblioteca sem imagem, no lugar do gradiente de matiz aleatório |
| `--mari-chat-row-art-opacity` | A imagem do chat aberto atrás da linha dele na barra lateral de chats (padrão 0,14; `0` a oculta) |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient` | Agora também chegam às superfícies que leem o destaque de `<html>` (as abas Convo / Roleplay / Game, bordas da interface) |
| `--mari-focus-frame-outset` | Quanto a moldura de foco se estende além da superfície (um comprimento, no máximo 2rem; veja Espaços) |
| `--mari-scrim` | A camada escura atrás das janelas de diálogo |
| `--mari-confirm-scrim` | A camada clara e transparente atrás de janelas curtas de confirmação (mantenha-a suave para que temas claros fiquem tranquilos) |

O aplicativo também publica `--mari-center-x` em `<html>` enquanto um tema tem uma sobreposição ambiente: o centro horizontal do painel de chat, para que uma máscara mantenha a coluna de leitura livre, com as barras laterais abertas ou fechadas. `--mari-gutter-mask` usa esse valor.

## Imagens

Um tema leva suas imagens em `images` no arquivo de tema, e o CSS as usa pelo nome:

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- As imagens contam no limite de 6 MiB do pacote, não no limite de 256 KiB do CSS, então cabe arte em tamanho completo.
- No editor, abra **Imagens e detalhes de compartilhamento** e pressione **Adicionar imagens**. PNG e JPEG são salvos como WebP na entrada (os pequenos sem perda, para manter a nitidez da pixel art e das molduras de 9 fatias; no máximo 2560 px no lado maior). Clique no nome de uma imagem para inserir `url("theme:name")` na posição do cursor.
- Importar um tema faz o mesmo: imagens escritas diretamente como URLs `data:` saem do CSS para `images`, PNG e JPEG estáticos viram WebP, e a prévia lista cada imagem com o tamanho (com uma caixa "Manter os arquivos originais (maiores)").
- Nomes `theme:` também encontram os `backgrounds` do tema pelo nome, então a arte incluída para a galeria de planos de fundo do chat também pode ser usada no CSS, quer o usuário a adicione à galeria ou não.
- Quando o tema é aplicado, cada imagem vira uma URL `blob:` curta da mesma origem: nada é baixado, e uma imagem usada em vários lugares é decodificada uma vez.
- GIF, APNG, WebP animado e SVG com `<animate>` contam como imagens em movimento. A prévia de importação informa isso, e com Reduzir movimento ativado elas aparecem como o primeiro quadro.

## Planos de fundo

Defina `--mari-app-backdrop` em `:root` para desenhar arte atrás do aplicativo:

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

Ela é desenhada uma vez, em uma camada fixa própria abaixo de todo o aplicativo (`[data-mari-part="app-backdrop"]`, para que as decorações do Início e o esquema claro nunca a ocultem), e também aparece atrás dos chats: as superfícies de Roleplay, Conversation e Game ficam transparentes e o fundo padrão do chat sai de cena. Um plano de fundo que o usuário escolheu para um chat continua aparecendo por cima. Os painéis mantêm `--card` e `--sidebar`, então deixe-os translúcidos se quiser que a arte apareça atrás deles, e use `--mari-page-veil` para tingir páginas inteiras. Para dar às páginas um painel próprio, estilize `[data-mari-part="page"]` (veja Pontos de personalização): ele contém cada página da Biblioteca, editor, Configurações e Documentação, então Lorebooks recebe o mesmo painel que Personagens. Sobre um plano de fundo, cada página inteira também fica sobre uma camada quase opaca do seu `--background` (`--mari-page-floor`, 94% por padrão), para que listas longas e editores continuem legíveis. Defina `--mari-page-floor` com outra cor, ou como `transparent` para mostrar mais da arte. Um tema que estiliza `[data-mari-part="page"]` com `!important` troca essa camada pelo próprio painel.

| Token | Padrão |
| --- | --- |
| `--mari-app-backdrop` | Uma imagem ou gradiente |
| `--mari-app-backdrop-size` | `cover` (experimente `auto` ou `64px` para padrões repetidos) |
| `--mari-app-backdrop-position` | `center` |
| `--mari-app-backdrop-repeat` | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering` | `auto` (`pixelated` para pixel art) |
| `--mari-app-backdrop-layers` | Um valor completo de `background` com várias camadas, como `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`. Tem prioridade sobre os tokens de imagem única |

As imagens personalizadas são a parte mais flexível de um tema: planos de fundo, uma faixa na barra superior, molduras de widgets do Início e de mensagens (`border-image`, ou um `background` em qualquer ponto de personalização de parte), padrões repetidos e fontes pixeladas incluídas ficam todos dentro do arquivo do tema, e a prévia de importação os lista. A opção Aparência > Acessibilidade > Intensidade da arte do tema do usuário esmaece o plano de fundo e a sobreposição ambiente, e Alto contraste os mantém em 25% ou menos; um tema não pode desfazer nenhuma dessas escolhas.

## Sobreposição ambiente

`--mari-ambient` recebe um valor completo de `background` para uma camada sobre o chat e as páginas, mas **abaixo** da barra superior e das duas barras laterais: chuva, folhas caindo, linhas de varredura, uma vinheta.

```css
:root {
  --mari-ambient: url("theme:leaves.webp") 0 0 / 512px repeat;
  --mari-ambient-opacity: 0.6;
  --mari-ambient-animation: leaves-fall 30s linear infinite;
}
@keyframes leaves-fall {
  to {
    background-position: 0 1024px;
  }
}
```

`--mari-ambient-blend` define um `mix-blend-mode`, e `[data-mari-part="ambient"]::before` e `::after` ficam livres para mais duas camadas. A camada nunca recebe cliques, para de se mover com Reduzir movimento (suas imagens viram quadros estáticos) e precisa permanecer quase toda transparente: um tema cuja camada ambiente ocultaria o chat é desativado. Use isso no lugar de um `body::after` de tela inteira, que a proteção considera uma cobertura do aplicativo.

A camada fica parada sempre que ninguém pode vê-la: enquanto o aplicativo está em segundo plano (outra aba ou aplicativo tem o foco) e, nos celulares e tablets, enquanto uma página inteira, como uma página da Biblioteca, um editor ou Configurações, cobre o chat. Animações infinitas em outras partes do tema também pausam em segundo plano. Elas continuam de onde pararam, então não sincronize nada importante com elas.

O plano de fundo do próprio chat é um `<img data-mari-part="backdrop">`. O padrão (sem plano de fundo escolhido) também tem `data-default-background="true"`, então um tema pode substituir apenas ele:

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## Clima

Quando a história tem clima (Configurações > Aparência > Efeitos > Efeitos de clima dinâmicos, com o agente World State ativado), o aplicativo desenha chuva, neve, neblina, pétalas, estrelas, um sol ou uma lua sobre o chat. Um tema pode reestilizar tudo isso com tokens `--mari-weather-*` e mudar a própria arte para combinar com o clima.

É a primeira vez? [Clima no seu tema](theme-weather.md) orienta você passo a passo, com imagens.

```css
:root {
  --mari-weather-style: pixel; /* every drop and flake lands on a pixel grid */
  --mari-weather-pixel-size: 3px;
  --mari-weather-rain-color: #ffaacd;
  --mari-weather-petal-image: url("theme:petal-a.png") url("theme:petal-b.png");
  --mari-weather-petal-size: 3;
  --mari-weather-tint-strength: 0.4;
}
:root[data-theme="dark"] {
  --mari-weather-moon: none; /* the night backdrop already has a moon */
}
```

O aplicativo continua fazendo todo o desenho. Ele lê esses tokens quando o tema carrega, quando o esquema de cores muda e quando você edita o tema, verifica cada valor e ignora tudo o que não entende. Assim, o clima de dia e de noite (ou por chat) funciona como qualquer outro token.

| Token | Valores |
| --- | --- |
| `--mari-weather-style` | `smooth` (padrão) ou `pixel`: a camada é desenhada em baixa resolução e ampliada com nitidez, e as partículas viram células quadradas |
| `--mari-weather-pixel-size` | 2 a 6 (px por célula), padrão 3 |
| `--mari-weather-<kind>-color` | Uma cor simples (`#hex`, um nome de cor, `rgb()`, `hsl()`), sem gradientes nem imagens |
| `--mari-weather-<kind>-image` | Até 4 imagens do próprio tema, `url("theme:a.png") url("theme:b.png")`; cada partícula escolhe uma. No estilo suave, folhas, pétalas e cinzas giram enquanto caem |
| `--mari-weather-<kind>-size` | 0,5 a 3 vezes. No estilo pixelado, uma imagem é desenhada no tamanho próprio multiplicado por esse valor, então a pixel art mantém seus pixels (pixel da arte = tamanho x 1 px) |
| `--mari-weather-<kind>-shape` | `round` ou `square` (estilo suave; quadrados para "neve de dados" ou faíscas) |
| `--mari-weather-amount` | 0,25 a 1: um tema pode reduzir a quantidade de partículas do clima, nunca aumentá-la |
| `--mari-weather-speed` | 0,5 a 1,5 vezes |
| `--mari-weather-strength` | 0,5 a 1,5 vezes a intensidade com que as partículas aparecem (chuva fina sobre uma cidade escura) |
| `--mari-weather-tint-strength` | 0 a 1 vez a tonalidade padrão do céu (azul na chuva, escura à noite) |
| `--mari-weather-rain-length` | 0,5 a 3 vezes o comprimento dos riscos de chuva |
| `--mari-weather-sun`, `-moon` | `none` quando o plano de fundo desenha o próprio sol ou lua |
| `--mari-weather-lightning-color` | A cor do clarão. A intensidade e o ritmo mantêm os valores suaves do aplicativo, seguros para pessoas com epilepsia |
| `--mari-weather-lightning-bolt` | `on`, `none` ou 0,5–3 (largura): um raio ramificado pelo lado esquerdo ou direito a cada clarão, desaparecendo junto com ele |

Tipos: `rain`, `snow`, `hail`, `fog`, `dust`, `leaf` (tempo com vento), `petal` (floração), `ember`, `ash`, `sand`, `firefly`, `star`, `aurora`, e `sun` e `moon` (cor, tamanho e uma imagem).

### Arte que acompanha o clima

Enquanto o clima de um chat aparece, `<html>` contém duas palavras de listas fixas (nunca o texto da história):

| Atributo | Valores |
| --- | --- |
| `data-mari-weather` | `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` |
| `data-mari-sky` | `dawn`, `day`, `dusk`, `night` |
| `data-mari-shelter` | `indoors` ou `outdoors` (ausente quando o aplicativo não consegue determinar) |

Em locais internos, o aplicativo não desenha partículas, bancos de neblina, sol, lua nem estrelas, apenas a tonalidade e o clarão dos relâmpagos, então os tokens de clima de um tema só aparecem em locais externos. Eles são definidos com Reduzir animações e efeitos de ambiente ativado ou não (trocar um plano de fundo não produz movimento), e removidos quando o chat não tem clima ou o usuário o desativa. Use-os para acinzentar um plano de fundo ensolarado na chuva, ou para retirar a própria camada ambiente e evitar duplicar o clima:

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### O que continua sob controle do usuário

- Um tema não pode ativar ou desativar o clima; o botão liga/desliga do usuário decide.
- Reduzir animações e efeitos de ambiente (ou a configuração de movimento reduzido do dispositivo) não desenha clima algum.
- Efeitos de pintura reduzidos remove a tonalidade, os brilhos e a camada do pôr do sol e desenha 60% das partículas.
- Intensidade da arte do tema esmaece o clima de um tema como faz com seu plano de fundo, e Alto contraste o mantém em 25% ou menos.
- Em todos os dispositivos, o clima para de ser desenhado enquanto um painel, um editor ou Mari cobre o chat.

Petal OS (clima pixelado e pétalas próprias), NEON//GRID (chuva de riscos ciano) e Lantern Path (folhas pintadas, planos de fundo que ficam cinzentos no mau tempo) são exemplos práticos: use **Clonar e editar** em um deles para ler o CSS.

## Efeitos de destaque

Pulsação do destaque e Modo RGB animam alguns pontos de destaque no novo layout ("+ Novo", botões principais, o bloco do avatar do assistente) com um filtro CSS. Nada é reescrito a cada quadro. Um tema pode:

- ativar Pulsação do destaque para os usuários com `:root { --marinara-theme-accent-pulse: enabled; }`;
- adicionar elementos próprios com `animation: var(--mari-accent-fx-animation);`.

Os dois param com `prefers-reduced-motion` e a configuração "Reduzir animações e efeitos de ambiente" do aplicativo.

## Pontos de personalização

### Em `<html>`

| Atributo | Valores |
| --- | --- |
| `data-theme` | `dark`, `light` |
| `data-visual-theme` | `default` (Marinara), `sillytavern` (Dottore), `stage` |
| `data-overhaul` | `on` (novo layout, computador), `mobile` (novo layout, celular e tablet); ausente no layout antigo |
| `data-custom-theme` | O id do tema ativo |
| `data-seasonal-theme` | O visual sazonal, quando há um ativado |
| `data-mari-accent-fx` | `pulse` ou `rgb` enquanto um efeito de destaque está ativo |
| `data-chat-id` | O id do chat aberto |
| `data-chat-open-mode` | O modo do chat aberto: `roleplay`, `conversation`, `game` |
| `data-chat-tags` | As tags do chat aberto, em minúsculas com espaços como `-`: estilize uma história com `:root[data-chat-tags~="horror"]` |
| `data-mari-chat-art-behind` | Presente enquanto o plano de fundo do chat aparece atrás dos painéis laterais (`--mari-chat-art` é a imagem) |
| `data-marinara-reduced-effects` | Presente quando a animação ambiente é reduzida |
| `data-mari-a11y-line-height` | Presente quando o usuário aumentou o espaçamento entre linhas (`--mari-a11y-line-height`) |
| `data-mari-a11y-letter-spacing` | Presente quando o usuário aumentou o espaçamento entre letras (`--mari-a11y-letter-spacing`) |
| `data-mari-a11y-focus` | Presente quando os anéis de foco fortes estão ativados |
| `data-mari-contrast` | `more` quando o alto contraste está ativado (por escolha do usuário ou solicitação do dispositivo) |
| `data-mari-cvd-safe` | Presente quando as cores acessíveis para daltonismo estão ativadas |
| `data-mari-weather` | O clima da história enquanto aparece: `rain`, `snow`, `fog`… (veja [Clima](#weather)) |
| `data-mari-sky` | `dawn`, `day`, `dusk` ou `night` enquanto o clima da história aparece |
| `data-mari-shelter` | `indoors` ou `outdoors` enquanto o clima da história aparece, quando o aplicativo consegue determinar pelo local |

### Áreas

`[data-component="…"]` nomeia as grandes áreas: `AppShell`, `TopBar`, `ChatSidebar`, `ChatSidebarSlot`,
`RightPanelDesktop`, `RightPanelDesktopSlot`, `CenterContent`, `GlobalOmnibar`, `OverhaulLibraryNav`,
`OverhaulSettingsPage`, `OverhaulLibraryPage`, `OverhaulCardGallery`, `OverhaulEditorHead`,
`OverhaulEditorRail`.

### Partes

| Seletor | O que é |
| --- | --- |
| `[data-mari-part="message"]` | Uma linha de mensagem, em todos os modos de chat: a largura completa do chat, com o avatar, a linha do nome e o balão dentro. Pinte o balão (`bubble` abaixo), não esta linha, ou cada balão ficará dentro de uma segunda caixa. Também tem `data-message-id` e `data-message-role` (`user`, `assistant`, `system`, …) e os dados de mensagem abaixo |
| `[data-mari-part="bubble"]` | O próprio balão da mensagem, em Roleplay e Conversation (`.mari-rp-bubble` / `.texting-bubble`). Fundo, borda, raio e sombra vão aqui |
| `[data-mari-part="message"][data-latest]` | A resposta mais recente do personagem |
| `[data-mari-part="message"][data-streaming]` | Uma resposta que ainda está sendo escrita |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | Dentro de uma mensagem: o avatar, a linha do nome e as ferramentas de mensagem |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]` | O botão liga/desliga (ou caixa) de raciocínio e seu texto, o mesmo ponto de personalização no computador e nos celulares |
| `[data-mari-part="composer"]` | A caixa de mensagem. `data-composer` é `roleplay`, `conversation` ou `game` |
| `[data-mari-part="home-art"]` | As imagens padrão dos cartões do Início |
| `[data-mari-part="message"][data-vn]` | A caixa de diálogo de visual novel: uma mensagem com os mesmos dados (personagem, papel, índice), além das partes `avatar` e `header` dentro |
| `[data-mari-part="vn-sprite"]` | Uma camada vazia atrás da caixa de diálogo de VN, que chega até a parte inferior da cena. Tem `data-vn-speaker` (o nome de quem fala como slug, ou seu papel), `data-vn-speaker-role`, `data-character` e `data-character-id` de quem está falando agora, para que um tema possa colocar a imagem dele ali. `[data-roleplay-vn-media]` tem os mesmos atributos |
| `[data-mari-part="message"][data-game-narration]` | A caixa de narração de Game. `data-message-role` é `narrator`, ou `assistant` com `data-character` e `data-character-name` enquanto um personagem fala; `data-segment-type` e `data-expression` descrevem a linha atual |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]` | As camadas de plano de fundo e ambiente. A posição delas na página é fixa; estilize-as com os tokens |
| `[data-mari-part="home-widget"]` | Um cartão de widget do Início, incluindo a Professor Mari. A moldura tem `data-home-widget-id` (`recent`, `professor`, `whats-new`, `character-library`, …). Dentro: `home-widget-eyebrow`, `home-widget-title`, `home-widget-text` |
| `[data-mari-part="top-bar"]` | A barra superior em todos os dispositivos. O segundo lado da visualização dividida tem uma barra fina própria com os mesmos pontos de personalização (`[data-component="TopBar"]`, `.ov-tab`, `.ov-tab__label`, `.ov-icon-btn`), marcada com `[data-split-bar]`, então a arte e as fontes da barra superior também chegam a ela |
| `[data-mari-part="page-title"]` | O título grande de uma página principal: cada seção da Biblioteca (Personagens, Lorebooks, Conexões, Agentes), Configurações, Extensões e Documentação. Estilize os títulos de página com este único ponto de personalização para que combinem em todas as páginas |
| `[data-mari-part="backdrop"]` | A imagem de fundo de um chat (veja Planos de fundo) |
| `[data-mari-part="stage-empty"]` | O cenário de Game sem imagem de cena |
| `[data-mari-part="time"]` | O horário de uma mensagem, em todos os modos de chat |
| `[data-mari-part="chat-header"]` | O cabeçalho da conversa (`data-chat-mode="conversation"`) |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]` | O painel flutuante de mapa e equipe de Game e a linha de ferramentas da narração |
| `[data-mari-part="avatar-placeholder"]` | O círculo de avatar vazio; `data-role` é `user` ou `assistant` |
| `[data-mari-part="header"][data-placement]` | Nas mensagens de Roleplay: `outside` (nome acima do balão) ou `inside` |
| `[data-mari-part="home-widget-glow"]` | O brilho atrás do cabeçalho de um widget do Início |
| `[data-mari-part="dialogue"]` | Fala entre aspas em uma mensagem |
| `[data-mari-part="paragraph-gap"]` | A linha em branco entre dois parágrafos (vira um bloco quando `--mari-paragraph-gap` é definido) |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav` | A caixa de texto de VN (`data-more-below` enquanto há mais conteúdo para rolar), o contador "3 / 9" e os botões Anterior / Próximo (`data-direction`) |
| `[data-mari-part="card-art"]` | A imagem de um cartão da Biblioteca; `data-placeholder` quando não há imagem |
| `[data-mari-part="page"]` | A superfície em que cada página completa fica: cada página da Biblioteca (Personagens, Lorebooks, Presets, Scripts de regex, Conexões, Agentes, Ferramentas personalizadas), cada editor, Configurações e Documentação. Pinte um painel ou folha aqui, não na classe de uma página específica, para que todas as páginas recebam a mesma superfície legível. Chats e o Início não ficam dentro dela |
| `[data-mari-part="chat-row-art"]` | A imagem do chat aberto atrás da linha dele na barra lateral |
| `[data-mari-part="avatar-placeholder"]` | Agora em todos os lugares onde aparece um avatar vazio: linhas de Conversation, linhas de chats (iniciais), seletor de persona, caixa de mensagem e Game |
| `.ov-lrow__dot[data-status]` | Um ponto de entrada de lorebook: `constant`, `selective` ou `normal` |
| `[data-chat-row]` | Uma linha na barra lateral de chats; `data-selected="true"` no chat aberto |
| `[data-chat-mode]` | A superfície do chat, por modo |
| `.mari-messages-scroll` | A lista rolável de mensagens |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant` | Balões de Roleplay e Conversation |
| `.mari-window`, `.mari-drawer` | Janelas destacáveis e painéis deslizantes |

### Espaços

Eles aparecem apenas enquanto o tema ativo os solicita, então a página padrão não carrega partes extras.

- **Moldura de foco.** `--mari-focus-frame` recebe um valor completo de `border-image`, por exemplo `url("theme:frame.png") 24 fill / 24px / 6px stretch`, e o desenha sobre o que estiver recebendo a atenção do leitor: a resposta mais recente, Ctrl+K, uma janela de diálogo aberta e Chats recentes do Início. Adicione `data-mari-focus-surface` a qualquer outro elemento (em um modelo de mensagem) para emoldurá-lo também. Desde a v1.5, a moldura só se estende além da superfície por meio de `--mari-focus-frame-outset` (no máximo 2rem), e não se estende nada quando o valor tem `fill`, para que não possa cobrir o chat; uma extensão escrita dentro de `--mari-focus-frame` é ignorada. A moldura é um `border-image`: uma propriedade abreviada `border` mais adiante no CSS, no mesmo elemento, a redefine, então defina `border-color`, `border-width` e `border-style` ali.
- **Títulos de janela.** Definir `--mari-window-title` (qualquer valor, como `on`) adiciona uma linha de título no topo de cada mensagem, widget do Início e caixa de mensagem: `[data-mari-part="window-title"]` com `data-window` (`message`, `home-widget`, `composer` e, desde a v1.5, `narration`, `omnibar`, `window` e `dialog`), contendo `window-title-text` (quem fala, o título do widget ou "Mensagem") e um `window-buttons` vazio para suas decorações `_ [] X`.
- **Prévias nas linhas de chats.** Definir `--mari-chat-row-preview` (qualquer valor, como `on`) adiciona a linha mais recente de cada chat abaixo do nome dele na lista de Chats: `[data-mari-part="chat-row-preview"]` com `data-role` (`user`, `assistant`, `narrator`…), começando com `[data-mari-part="chat-row-preview-who"]` ("Você:" para suas próprias linhas, ou o nome de quem fala em um chat em grupo). Ela dá lugar à linha ao vivo ("digitando…", "Rascunho não enviado"), então uma linha nunca mostra as duas. Sem o token, a linha não é buscada nem desenhada.
- **Ambiente atrás dos cartões.** `--mari-ambient-placement: behind-cards` move a camada ambiente para baixo das mensagens, widgets do Início e painéis (ainda sobre o plano de fundo), em vez de sobre o chat. `--mari-ambient-mask` (um valor completo de `mask`) define onde ela aparece, e `--mari-ambient-mask: var(--mari-gutter-mask)` mantém o centro da janela livre, para que a chuva caia nas margens laterais e não sobre o texto. `--mari-gutter-clear` define a meia largura livre (26rem).

### Dados de mensagem

Cada mensagem contém quem a escreveu, seu número e quanto tempo levou, como atributos para seletores e `attr()`, e como variáveis CSS para `content:` e `counter()`:

| Atributo | Variável | Valor |
| --- | --- | --- |
| `data-character-id` | | O id do personagem (ausente nas suas próprias mensagens) |
| `data-character-name` | `--mari-msg-char` | O nome de exibição (`--mari-msg-char` é uma string entre aspas) |
| `data-character` | | O nome em minúsculas com espaços como `-`, para seletores: `[data-character="captain-faye"]` |
| `data-message-index` | `--mari-msg-index` | O número da mensagem mostrado por "Mostrar os números das mensagens" |
| `data-gen-ms` | `--mari-msg-gen` | Tempo de geração em ms (`--mari-msg-gen` é uma string como `"3.2s"`) |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### Modelo de mensagem (HTML)

Quando CSS não basta, por exemplo para uma caixa de status com o nome de quem fala e o número da mensagem, um arquivo de tema pode incluir um pequeno modelo HTML por papel. Ele é preenchido para cada mensagem e mostrado em uma caixa no final da mensagem, `[data-mari-part="message-extra"]`, que o CSS estiliza e posiciona:

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

Chaves: `message` (todos os papéis), `assistant`, `user`, `narrator` (o modelo próprio de um papel tem prioridade sobre `message`). Campos: `{{char}}`, `{{role}}`, `{{index}}`, `{{gen}}`, `{{time}}`, `{{date}}`; campos desconhecidos ficam vazios. Cada modelo tem no máximo 4.000 caracteres. Marinara mantém texto e tags de layout (`div`, `span`, `p`, `b`, `i`, `ul`, `table`, `details`, `progress`, …) com atributos `class`, `title`, `role` e `data-*`, e remove scripts, estilos, `style` em linha, links, imagens, formulários e atributos de evento. Um modelo cujo texto pede chaves ou senhas é descartado.

HTML exige a adesão do usuário: um tema com um modelo só pode ser instalado enquanto **Configurações → Aparência → Temas CSS → Permitir temas com HTML (aceito o risco)** estiver ativado (desativado por padrão). A prévia de importação avisa sobre isso e, com o botão desligado, um tema instalado aparece sem seu HTML.

## Visuais por chat

Configurações do chat > Tema dá a um chat um tema próprio ("Aparência padrão" desativa os temas personalizados naquele chat). Em um chat com exatamente um personagem, a escolha pode virar o padrão desse personagem para os outros chats individuais dele; chats em grupo e equipes de Game nunca usam o padrão de um integrante. A seção Tema informa de onde vem o visual atual: do chat, do personagem ou do aplicativo. Configurações, a Biblioteca, editores e Documentação sempre usam o tema do aplicativo, e `data-chat-id` e `data-chat-tags` só ficam em `<html>` enquanto o próprio chat está sendo exibido.

As tags são a forma portátil de estilizar histórias específicas dentro de um tema: `:root[data-chat-tags~="noir"] { --primary: #c9a227; }`. Adicione tags em Configurações do chat > Nome do chat ("+ Adicionar tag"), pelo botão de tags de uma linha de chat (ou "Tags" no menu de toque longo em telas sensíveis ao toque). As tags ficam em minúsculas com espaços como `-` no atributo, então "Noir Mystery" corresponde a `noir-mystery`.

Definir qualquer variável `--mari-chat-*` (por exemplo `--mari-chat-bg`, `--mari-chat-text`, `--mari-chat-radius`, `--mari-chat-font-family`) ativa por conta própria a estilização correspondente da superfície do chat; os usuários não precisam dos botões "Aplicar preset …" para que as cores de chat de um tema apareçam.

## Dia e noite

Configurações > Aparência > Esquema de cores pode seguir o sistema ou a hora do dia (Claro a partir das 07:00, Escuro a partir das 19:00 por padrão, ambos ajustáveis). De qualquer forma, só alterna `data-theme` em `<html>`, então um tema ganha um visual diurno e um noturno ao estilizar os dois:

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

O esquema é calculado em cada dispositivo pelo próprio relógio (não é sincronizado), então um celular e um PC em lugares diferentes mostram, cada um, a metade certa. Um arquivo de tema pode sugerir a própria alternância: `"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }` (ou `"system"`). A prévia de importação a oferece como qualquer outra configuração.

## Arquivos de tema

Exportar grava um tema como um arquivo JSON:

```json
{
  "kind": "marinara.theme",
  "formatVersion": 2,
  "name": "Forest Glass",
  "author": "You",
  "version": "1.2",
  "description": "Deep greens with frosted panels.",
  "colorScheme": "dark",
  "thumbnail": "data:image/webp;base64,…",
  "settings": { "colorScheme": "dark", "visualStyle": "stage", "accent": "#3fae7a", "fontFamily": "Georgia" },
  "fonts": [{ "family": "My Display", "src": "data:font/woff2;base64,…" }],
  "images": [{ "name": "frame.webp", "src": "data:image/webp;base64,…" }],
  "backgrounds": [{ "name": "forest.webp", "src": "data:image/webp;base64,…" }],
  "css": ":root { --primary: #3fae7a; }"
}
```

Os créditos (v1.5) ficam no mesmo arquivo e aparecem na lista de temas (o botão (i)) e na prévia de importação:

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels` são até quatro tags curtas (40 caracteres cada) mostradas abaixo do nome do tema. Uma fonte ou crédito com licença `OFL-1.1` leva ao texto da SIL Open Font License incluído no aplicativo. Imagens com mais de 1920 px de largura (ou 2560 px no lado maior) são reduzidas quando o tema é importado.

Só `kind`, `name` e `css` são obrigatórios. `templates` está descrito em Modelo de mensagem. Chaves de `settings`: `colorScheme` (`dark`, `light`, `time` ou `system`), `dayStart`, `nightStart`, `visualStyle`, `accent`, `accentLight`, `background`, `backgroundLight`, `fontFamily`, `accentPulse`, `fontSize` (Tamanho de exibição em px: 12, 14, 16, 17, 19, 22, 26, 30 ou 34) e `reduceMotion` (true ou false). A importação mostra primeiro uma prévia com as configurações sugeridas marcadas, exceto Estilo visual, Pulsação do destaque, Tamanho de exibição e Reduzir movimento, que o usuário marca se quiser, e o usuário escolhe se adiciona os planos de fundo à galeria. Imagens menores que 4 KiB continuam em linha e aparecem como uma etiqueta "ícones pequenos". As fontes carregam com o tema (como regras `@font-face`) e saem junto com ele. Importar um tema com o mesmo nome de um já instalado oferece a opção de atualizá-lo, e uma atualização não adiciona o mesmo plano de fundo à galeria duas vezes. O limite de CSS é de 256 KiB de texto CSS; imagens, miniatura, fontes e planos de fundo, juntos, têm 6 MiB. Uma imagem que não cabe é deixada de fora individualmente, com o tamanho informado, e o restante do tema ainda é instalado. Arquivos `.css` simples, `{ "name", "css" }` e a exportação antiga `marinara.theme-folder` continuam sendo importados.

## Como manter um tema rápido

Celulares e tablets, principalmente iPads no Safari, sentem o CSS lento a cada toque. A maioria dos temas funciona bem; estes são os padrões que deixaram temas lentos nos testes:

- **`:has()` em um elemento pai que depois estiliza os filhos**, como `.panel:has(> .row) > *` ou `body:has(.open) .chat *`. O navegador então verifica novamente a página inteira a cada letra digitada e a cada palavra recebida por streaming. Coloque `:has()` no elemento que você estiliza (`.row:has(> img)`), ou use um ponto de personalização `data-mari-part`.
- **`backdrop-filter` em muitos elementos ao mesmo tempo**, como cada mensagem ou cada linha de chat. Um ou dois painéis com efeito de vidro fosco funcionam bem; um desfoque em cada uma de cem linhas, não. Use uma cor transparente no lugar.
- **Animar o layout** (`width`, `height`, `top`, `margin`) ou grandes `box-shadow`. Anime `opacity` e `transform`, ou `background-position` na camada ambiente.

**Configurações → Avançado → Solução de problemas → Mostrar tempos de toque** mostra quanto tempo cada toque leva naquele dispositivo, com e sem o tema. Compare os dois para encontrar uma regra lenta.

## Acessibilidade

Configurações > Aparência > Acessibilidade aplica o espaçamento entre linhas e letras, anéis de foco, alto contraste, cores acessíveis para daltonismo e um mínimo de 12 px para o texto das mensagens escolhidos pelo usuário. Os valores são escritos na camada `mari-protected` como literais em cada elemento (lib/accessibility-css.ts), então um tema não pode desfazê-los, nem redefinindo variáveis. Enquanto uma opção está desativada, um tema pode definir:

| Token | Uso |
| --- | --- |
| `--mari-focus-ring-color` | O anel de foco normal do aplicativo (o padrão é `--primary`) |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | Cores de status e medidores quando você quer seu próprio par azul/laranja |

Com arte, mais três escolhas têm prioridade sobre um tema:

- **Intensidade da arte do tema** (0-100%) esmaece o plano de fundo e a sobreposição ambiente.
- **Alto contraste** também deixa as superfícies opacas nas cores do próprio esquema (`--background`, `--card`, `--popover`, `--sidebar`, `--secondary`, `--muted`, `--mari-rp-bubble-bg`, o véu da página, a camada de cor do Início, os widgets do Início e a base da barra superior) e mantém a arte do tema em 25% ou menos, para que o texto nunca fique sobre uma imagem em tons pastel. Cores que um tema escreve como literais nos próprios seletores não são alteradas, então prefira os tokens.
- **Reduzir movimento** mostra imagens em movimento como o primeiro quadro e para a sobreposição ambiente. Cores forçadas (Alto Contraste do Windows) ocultam a arte e as molduras `border-image`.

Use os tokens de status e medidores acima no lugar de verdes e vermelhos fixos, e o botão de cores acessíveis para daltonismo também passa a afetar seu tema. Links para pular conteúdo (`.mari-skip-link`) continuam acessíveis, independentemente do que um tema faça. A prévia de importação avisa o usuário quando um tema tenta alterar qualquer um deles.

## Segurança

- A barra superior (incluindo o estado de ocultação automática em tela cheia), a barra lateral de chats e suas linhas de chat, a barra lateral da Biblioteca, Ctrl+K e a caixa de mensagem podem ser reestilizados, mas não ocultados, movidos, cobertos, esmaecidos, removidos por filtros ou impedidos de receber cliques. A proteção os mede com e sem o tema depois que ele carrega, aos 2,5 s e 10 s, quando um chat abre, quando um painel abre, quando o esquema de cores muda, ao redimensionar e quando uma animação do próprio tema começa ou termina, e desativa o tema naquela aba quando ele interfere em um deles.
- As imagens contam (proteção v3). Tudo o que é desenhado sobre uma aba, um ícone, uma linha de chat ou a caixa de mensagem é detectado no centro do controle, com ou sem `pointer-events: none` e em qualquer tamanho, e uma camada que o oculta (uma cor, um gradiente ou uma imagem cujos pixels ali são quase todos opacos) conta como cobertura. O mesmo vale para uma extensão de `border-image` que invade um controle e uma `mask` de imagem sobre ele. Dentro da barra superior, cada `::before` e `::after` fica empilhado abaixo dos rótulos e ícones, e máscaras, `list-style-image` e `border-image-outset` não se aplicam. O plano de fundo e a sobreposição ambiente nunca contam: ficam abaixo das barras por construção.
- Proteção v4 (rodada 4). A verificação de contraste lê as camadas atrás do texto na ordem de pintura (um preenchimento de `border-image`, depois cada camada de fundo a partir do topo e depois a cor), pondera cada uma pela parte do texto que ela realmente cobre (tamanho, posição e repetição), e amostra uma imagem apenas sob o texto. Uma linha fina ou um enfeite pequeno no canto não conta mais, e um véu escuro sobre uma página clara é lido como escuro. A barra superior e a caixa de mensagem são verificadas com mais rigor: o texto precisa manter 3:1 no pior ponto quando já tinha esse contraste antes. Uma imagem no `::before` ou `::after` do próprio controle que o cobre conta como cobertura, na barra superior, nas linhas de chat e na caixa de mensagem. Uma imagem com `position: fixed` em um pseudoelemento recebe um aviso no editor; use `position: absolute`, `--mari-ambient` ou `--mari-app-backdrop` no lugar. Quando a arte da barra superior é encontrada em um pseudoelemento, as abas e os ícones recebem suas bases, como com `--mari-top-bar-bg`.
- Contraste sobre arte: quando uma imagem fica atrás do texto, a proteção lê as cores da imagem em vez de pular a verificação.
- Texto do chat (v1.5): a proteção amostra as últimas linhas visíveis do chat e desativa o tema quando ele pinta sobre metade delas (uma cobertura de pseudoelemento, um ambiente opaco atrás dos cartões ou uma moldura de foco cuja extensão invade o texto). Uma linha que o próprio layout do tema move para fora da tela não conta, nem uma linha de nome que o tema fixa sobre a resposta.
- O texto que um tema adiciona com `content:` aparece na prévia de importação.
- Regras de texto dos temas (auditoria de segurança, novembro de 2026). Cada string que um tema pode desenhar é verificada antes de o tema ser aplicado, independentemente de onde veio (um arquivo, o editor, Mari, um backup, uma escolha por chat): strings de `content:` e `quotes`, propriedades personalizadas (então `content: var(--x)` conta), símbolos de `@counter-style`, o texto de exemplo da caixa de mensagem, modelos de mensagem (palavras e `title`) e o texto dentro de imagens SVG. Textos que pedem chaves, senhas, logins ou detalhes de conta, fingem ser o aplicativo ("hacked", "RCE", "security alert", "verified by Marinara", "call support"), contêm um número de telefone ou endereço da web, ou ultrapassam 80 letras e dígitos em uma declaração são recusados: o tema não pode ser instalado, e um já instalado não é aplicado. Letras parecidas, acentos, caracteres de largura zero, espaçamento e grafia 1337 são normalizados primeiro. Strings em seletores, `font-family` e nomes de áreas de grade não contam. O nome, autor, descrição e créditos do tema também não podem pedir segredos nem alegar ser oficiais (endereços da web são permitidos ali).
- URLs: além do sanitizador de texto (lista de permissão de url(), sem `@import`, fontes apenas em data:), a folha de estilo é analisada pelo navegador antes de ser aplicada, e qualquer endereço que não seja das imagens do próprio tema, imagens e fontes incorporadas em data:, `#fragments` e `about:invalid` faz o tema ser recusado. `src()` segue as regras de url(), e um `image-set(` deixado aberto no final é descartado.
- As cores sugeridas em um arquivo de tema (`settings.accent`, `background` e suas equivalentes claras) precisam ser cores simples ou gradientes: sem `url()`, `image-set()` ou qualquer coisa que escape do valor.
- Imagens SVG são reconstruídas a partir de uma lista de permissão antes do uso: sem `<script>`, `<foreignObject>`, `<a>`, atributos de evento, links externos, `<?xml-stylesheet?>` ou entidades DOCTYPE, e seu CSS é limpo como o de um tema. Imagens rasterizadas que, ao serem decodificadas, ultrapassariam 8192 px por lado ou 40 megapixels são recusadas.
- Os tokens de clima são lidos por uma lista de permissão: nomes de tokens conhecidos, números limitados aos respectivos intervalos, palavras de listas fixas e cores simples (sem `url()`, gradientes ou funções além das de cor). As imagens de clima precisam ser do próprio tema (os endereços de mesma origem que o aplicativo criou para elas, após a reconstrução do SVG e o limite de tamanho); qualquer outro endereço é ignorado. Nada do que um tema escreve é executado, e o clarão dos relâmpagos mantém a intensidade e o ritmo do aplicativo.
- Modelos de mensagem não podem usar papéis que criem uma janela de diálogo, menu ou anúncio, nem os atributos `data-` ou nomes de classe `mari-`/`ov-` do aplicativo.
- Experimentar um tema ("Manter este tema?") acontece apenas naquela aba: outros dispositivos só o recebem depois de Manter. Não responder significa voltar atrás; passar o mouse ou colocar o foco na barra pausa a contagem regressiva. Escape três vezes desativa os temas personalizados na aba; um Escape que fecha Ctrl+K, um menu ou uma janela de diálogo do aplicativo não conta.

## Alterações

- **Mini-imagens no celular, animações mais discretas** (12 a 14 de novembro de 2026, contrato ainda na versão 1): `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` e `--mari-phone-convo-avatar` para a imagem pequena ao lado do nome nos celulares; `--mari-chat-row-preview` adiciona a linha mais recente de cada chat na lista de Chats; uma transição pode esperar no máximo um segundo; a camada ambiente e as animações infinitas ficam paradas enquanto ninguém pode vê-las; [Como manter um tema rápido](#keeping-a-theme-fast).

- **Texto de destaque legível e ponto de personalização da barra dividida** (11 de novembro de 2026, contrato ainda na versão 1): o destaque usado em texto pequeno escurece um pouco no modo Claro e clareia um pouco no Escuro para permitir a leitura dos rótulos, enquanto os botões mantêm o destaque completo; `--mari-accent-text` permite definir essa cor de texto. `[data-mari-part="top-bar"]` é a barra superior em todos os dispositivos, e o segundo lado da visualização dividida tem a própria barra com os mesmos pontos de personalização `[data-component="TopBar"]` (mais `[data-split-bar]`), então a arte, as fontes e as cores das abas da barra superior de um tema chegam a ela. `--mari-game-combat-bg` e `-bg-hover` são um `background` completo, então gradientes funcionam.

- **Ponto de personalização da superfície das páginas** (10 de novembro de 2026, contrato ainda na versão 1): `[data-mari-part="page"]` é a superfície única em que ficam cada página da Biblioteca, editor, Configurações e Documentação, então um tema pode dar a todos eles o mesmo painel.

- **Galeria de temas e raios** (9 de novembro de 2026, contrato ainda na versão 1): os temas iniciais são baixados sob demanda da galeria de temas; `--mari-weather-lightning-bolt` (`on`, `none` ou uma largura de 0,5 a 3) desenha um raio ramificado por um lado da tela a cada clarão de tempestade.

- **Clima dos temas** (novembro de 2026, contrato ainda na versão 1): tokens `--mari-weather-*` (estilo pixelado, cores, imagens, tamanho, velocidade, quantidade, intensidade, tonalidade, sol e lua desativados), `data-mari-weather` e `data-mari-sky` em `<html>`, e o clima pausa sob painéis que o cobrem. Petal OS, NEON//GRID e Lantern Path os usam.

- **Rodada 6 e auditoria de segurança** (novembro de 2026, sem novos tokens, contrato ainda na versão 1): os temas iniciais são somente leitura, e **Clonar e editar** cria uma cópia editável (desde 9 de novembro, eles são baixados sob demanda da galeria de temas em vez de vir na instalação); créditos, licença e rótulos aparecem na prévia de importação e no botão (i); experimentar um tema acontece apenas naquela aba até **Manter tema**; as regras de texto dos temas, verificação de URLs, reconstrução de SVG e verificação de cores sugeridas estão descritas em [Segurança](#safety).

- **v1.5** (rodada 5 de temas, respostas longas): `--mari-chat-column`, `--mari-message-measure`, `--mari-chat-line-height`, `--mari-dialogue-weight`, `--mari-paragraph-gap`, nome de quem fala fixado, `--mari-phone-avatar`, partes e esmaecimento da caixa de texto de VN, `--mari-message-actions`, `--mari-swipe-counter`, `--mari-card-art-placeholder`, `--mari-chat-row-art-opacity`, `--mari-focus-frame-outset`, `--mari-scrim` e `--mari-center-x`; partes de diálogo, espaço entre parágrafos, arte dos cartões e arte das linhas de chat, e espaços reservados para avatar em todos os lugares; títulos de janela na narração, Ctrl+K, janelas e janelas de diálogo; o destaque da interface chega à interface com escopo na raiz; a proteção verifica o texto do chat; créditos, licença e rótulos de tema, com o texto da OFL incluído; imagens grandes são reduzidas na importação.

- **v1.4** (rodada 4 de temas): proteção v4 (fundos em camadas, área pintada, verificação rigorosa da barra superior e caixa de mensagem, coberturas de pseudoelementos); `fontSize` e `reduceMotion` nos arquivos de tema e a prévia de importação marcando configurações sugeridas; tokens para horários das mensagens, camada de cor de Roleplay, destaque e texto esmaecido da interface, cores da Biblioteca e de Ctrl+K, Combate, notificações temporárias, pontos de lorebook, atalhos do Início, limite mínimo do tamanho do texto e avatar do usuário; `--mari-top-bar-height` e `--mari-top-bar-plate-active`; partes de horário, cabeçalho do chat, HUD de Game, ferramentas de Game, espaço reservado para avatar e brilho dos widgets do Início; espaços de moldura de foco, título de janela, ambiente atrás dos cartões e máscara das margens.

- **v1.3** (rodada 3 de temas, imagens): `images` no arquivo do tema e `url("theme:name")`; o limite de CSS conta apenas texto CSS; WebP na importação; plano de fundo em camada própria; `--mari-page-veil` mantido sobre um plano de fundo; propriedades abreviadas `!important` com `var()` mantidas; sobreposição ambiente; ícones e cursor de imagem; `--mari-home-wash`, `--mari-home-art` e mais tokens de widgets do Início; pontos de personalização de diálogo de VN, espaço de sprite de VN e narração de Game; arquivos de tema podem sugerir Seguir a hora do dia; proteção v3.

- **v1.2**: espaço de modelo de mensagem (`templates` no arquivo de tema, `[data-mari-part="message-extra"]`), adesão do usuário com "Permitir temas com HTML (aceito o risco)".

- **v1.1**: pontos de personalização de mensagem em todos os modos de chat com personagem, índice e tempo de geração; partes de avatar, cabeçalho, ações e raciocínio; `--mari-composer-placeholder`; plano de fundo v2 (tamanho, posição, repetição, pixelado, camadas) que também aparece atrás dos chats; `--mari-page-veil`; `--mari-top-bar-bg`; `--mari-text-outline`, `--mari-dialogue-color`, `--mari-chat-font-size`, `--mari-msg-head-rule`; tokens de widgets do Início, com a Professor Mari como `home-widget`. `--mari-stage-empty-bg` agora é um `background` (gradientes funcionam).
- **v1.0.1**: proteção v2, valores de Acessibilidade protegidos, verificações de texto adicionado. A instalação é completa ou não acontece, os planos de fundo incluídos são instalados, Voltar também restaura as configurações que um tema aplicou, as fontes do tema aparecem na lista Fonte, referências `url(#id)` são mantidas, e os nomes das fontes incluídas são lidos da própria fonte.
- **v1** (primeiro contrato publicado): tokens de tema, pontos de personalização de partes, plano de fundo e efeitos de destaque acima.
