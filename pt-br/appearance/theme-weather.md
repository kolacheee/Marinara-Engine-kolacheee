# Clima no seu tema

Quando uma história tem clima, Marinara o desenha sobre o chat: chuva, neve, neblina, folhas caindo, pétalas, estrelas, um sol ou uma lua. Seu tema pode dar um visual próprio a tudo isso. Você pode mudar a cor da chuva, fazer a neve cair como quadradinhos de pixel, trocar as folhas por imagens que você desenhou ou deixar o plano de fundo cinza quando chover.

Este guia explica como fazer isso passo a passo. Primeiro, você precisa ter um tema próprio. Se ainda não tiver um, o [Guia de criação de temas](theme-author-guide.md) mostra como criar um em poucos minutos. A seção [Clima](theme-author-guide.md#weather) desse guia é a versão resumida desta página para consulta.

## Como o clima funciona

O clima vem da história. Em um chat de Roleplay ou Game Mode, o agente **World State** acompanha o clima e a hora do dia, como "heavy rain" (chuva forte) e "night" (noite). Marinara lê essas palavras e escolhe o que desenhar: traços de chuva para "rain", flocos para "snow", estrelas e uma lua para "night", e assim por diante.

O próprio aplicativo sempre faz o desenho. Seu tema não desenha nada. Ele define alguns tokens `--mari-weather-` (configurações com nome, como `--primary`), e o aplicativo os lê e desenha o clima do seu jeito. Isso mantém os temas seguros: nada em um tema pode executar código, e as configurações do próprio usuário, como a redução de movimento, sempre têm prioridade.

### Em ambientes internos, o clima fica do lado de fora

Quando a história se passa em um ambiente interno, como uma pousada, um quarto ou uma sala do World Maps, o aplicativo não faz chover na tela inteira. Ele mantém apenas a cor do clima e o clarão dos relâmpagos, e o ambiente fica seco. O aplicativo identifica o ambiente como interno pelo local do World State ("Tideglass Inn, Brinewatch") ou pelo tipo de lugar do World Maps. Quando não consegue identificar, desenha o clima normalmente. Com **Weather Versions of Backgrounds** (versões dos planos de fundo conforme o clima) ativado (veja [Versões dos planos de fundo conforme o clima](../media/scene-backgrounds.md#weather-versions-of-backgrounds)), a própria imagem de fundo mostra a chuva nas janelas, e o clima em movimento volta, desenhado apenas sobre o vidro das janelas. O visual do clima do seu tema também se aplica ali.

### O clima sem tema

Esta é uma noite chuvosa sem tema: traços finos e claros sobre uma camada azul-escura. As imagens mais abaixo mostram o mesmo chat com três temas iniciais.

## Veja o clima enquanto trabalha

Você não precisa esperar chover na história. Pode definir o clima por conta própria.

1. Abra **Biblioteca → Configurações → Aparência** e confira se **Efeitos de clima dinâmicos** está ativado (em **Efeitos**) e **Reduzir animações e efeitos de ambiente** está desativado.
2. Abra um chat de Roleplay, depois abra **Configurações do chat → Agentes** e ative **World State**.
3. Abra o tracker **World State**. No computador, ele fica no Painel de trackers. No celular, toque no botão **World State**.
4. Clique no valor de **Clima** e digite uma expressão de clima, como `heavy rain`. Clique em **Hora** e digite `night`.
5. O clima começa imediatamente. Agora o chat tem sua própria aba na barra superior.

Enquanto você trabalha no tema, Configurações ocupa o meio da janela e o clima fica pausado atrás dela. Salve o tema e clique na aba do chat na barra superior para ver o resultado. Para experimentar outro clima, mude as palavras do passo 4. A tabela em **Quais palavras produzem cada clima**, abaixo, lista todas elas.

> **Dica:** Trave o valor de Clima (modo de travamento no tracker) para que a IA não o altere enquanto você testa. Veja [HUD e trackers do Roleplay](../roleplay/hud-and-trackers.md).

## Seu primeiro visual de clima, passo a passo

Dê uma cor à chuva e deixe os traços mais longos, como faz o tema inicial NEON//GRID.

1. Abra **Biblioteca → Configurações → Aparência → Temas CSS** e clique em **Editar o CSS do tema** (o ícone de código) no seu tema.
2. Encontre a linha `:root {` perto do início do CSS. Se o tema não tiver uma, adicione `:root {` em uma nova linha e `}` na linha seguinte.
3. Adicione estas linhas dentro do bloco, antes do `}`:

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. Clique em **Salvar**. Se Marinara perguntar **Manter este tema?**, clique em **Manter tema**.
5. Clique na aba do chat de teste na barra superior. A chuva agora é ciano, os traços têm cerca do dobro do comprimento e aparecem com mais intensidade.

O que cada linha faz:

- `--mari-weather-rain-color` é a cor das gotas de chuva. Qualquer cor funciona: um código hexadecimal como `#3ff0ff`, um nome como `skyblue` ou `rgb(63 240 255)`.
- `--mari-weather-rain-length` deixa os traços mais longos ou mais curtos. `1` é o normal, `2.2` é um pouco mais que o dobro do comprimento.
- `--mari-weather-strength` faz cada partícula aparecer com mais intensidade (acima de `1`) ou menos (abaixo de `1`).

### O resultado

Esta é a mesma noite chuvosa no NEON//GRID, que usa essas três linhas e mais algumas.

### Escolha as cores para o dia e a noite

Cores que ficam boas sobre um fundo escuro podem desaparecer sobre um claro. Coloque as cores do dia em um bloco `[data-theme="light"]` e as da noite em um bloco `[data-theme="dark"]`, da mesma forma que você define qualquer outra cor:

```css
:root[data-theme="light"] {
  --mari-weather-rain-color: #1aa7c4;
  --mari-weather-snow-color: #22b8d6;
}
:root[data-theme="dark"] {
  --mari-weather-rain-color: #3ff0ff;
  --mari-weather-snow-color: #7af7ff;
}
```

## Quais palavras produzem cada clima

Cada tipo de clima tem um nome curto. Você usa esse nome no token, como `snow` em `--mari-weather-snow-color`.

| Quando a história diz | O aplicativo desenha | Nome nos tokens |
| --- | --- | --- |
| rain (chuva), downpour (chuva torrencial) | Traços de chuva | `rain` |
| storm (tempestade), thunder (trovão), lightning (relâmpago) | Chuva forte com clarões de relâmpagos | `rain` (clarão: `lightning-color`, raios: `lightning-bolt`) |
| snow (neve), sleet (chuva com neve), blizzard (nevasca), frost (geada), cold (frio) | Flocos de neve | `snow` |
| hail (granizo) | Pedras de granizo | `hail` |
| fog (neblina), mist (névoa), haze (bruma) | Bancos suaves de neblina na parte inferior da tela, sobre a névoa junto ao chão | `fog` |
| sand (areia), dust storm (tempestade de poeira) | Areia levada pelo vento | `sand` |
| ash (cinzas), smoke (fumaça), volcanic (vulcânico) | Cinzas caindo | `ash` |
| fire (fogo), embers (brasas), inferno (inferno) | Brasas subindo | `ember` |
| wind (vento), breeze (brisa), gusts (rajadas) | Folhas caindo | `leaf` |
| cherry blossom (flor de cerejeira), petals (pétalas) | Pétalas caindo | `petal` |
| aurora (aurora), northern lights (aurora boreal) | Faixas de aurora | `aurora` |
| clear (limpo), sunny (ensolarado), cloudy (nublado), qualquer outra coisa | Algumas partículas flutuantes | `dust` |
| night (noite, o horário) | Estrelas e vaga-lumes | `star`, `firefly` |
| dusk (entardecer), evening (anoitecer), como horário | Vaga-lumes | `firefly` |
| morning (manhã), day (dia), dusk (entardecer), com céu limpo | O sol | `sun` |
| night (noite), com céu limpo | A lua | `moon` |

As estrelas não aparecem nas noites com neblina ou neve, e os vaga-lumes não aparecem na chuva. O sol e a lua só aparecem quando o céu está limpo.

## Mude a cor, o tamanho e a forma

Todos os tipos da tabela aceitam as mesmas três configurações. Coloque o nome do tipo no meio do token.

| Token | O que faz | Valores |
| --- | --- | --- |
| `--mari-weather-snow-color` | A cor | Uma cor simples: `#fff0f7`, `white`, `rgb(...)`, `hsl(...)` |
| `--mari-weather-snow-size` | O tamanho de cada partícula | De `0.5` (metade) a `3` (três vezes) |
| `--mari-weather-snow-shape` | Pontos redondos ou quadradinhos | `round` ou `square` |

Troque `snow` por qualquer outro nome da tabela, como `--mari-weather-ember-color` ou `--mari-weather-leaf-shape`.

Exemplo: "neve de dados" para um tema com visual de computador, com pequenos quadrados ciano no lugar dos flocos.

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

As formas não se aplicam à chuva, à neblina nem à aurora, que mantêm suas próprias formas. Para a neblina, `--mari-weather-fog-color` dá cor tanto aos bancos em movimento quanto à névoa junto ao chão, e `--mari-weather-tint-strength` deixa a névoa mais fina ou mais densa.

## Use suas próprias imagens

Em vez de pontos e traços, cada tipo pode cair como imagens que você criou: folhas de bordo, pétalas de cerejeira, estrelas de papel, pequenos flocos de neve em pixel art.

1. Desenhe ou encontre imagens pequenas com fundo transparente, como PNGs. Mantenha o tamanho pequeno: uma folha com cerca de 24 a 64 pixels de largura já basta. Imagens maiores são reduzidas para 160 pixels no lado mais longo.
2. No editor de temas, abra **Imagens e detalhes de compartilhamento (autor, versão, miniatura, fontes)** e clique em **Adicionar imagens**. Adicione até quatro imagens para um tipo.
3. No CSS, liste as imagens no token `-image` do tipo, com um espaço entre elas:

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. Salve, abra o chat de teste e defina o clima como `windy`. Agora as folhas descem suavemente, e cada uma usa uma das suas imagens.

Dicas para as imagens:

- Clique no nome de uma imagem em **Imagens e detalhes de compartilhamento (autor, versão, miniatura, fontes)** para inserir seu `url("theme:...")` no CSS na posição do cursor, sem precisar digitar o nome.
- A imagem mantém o nome do arquivo que você adicionou, com a extensão e tudo, como `leaf-1.png`. Use o nome exatamente como aparece na lista.
- A imagem é desenhada com suas próprias cores, então o token `-color` não tem efeito nesse tipo.
- Use `-size` para aumentar ou diminuir todas elas. O estilo suave também varia um pouco o tamanho, para que não fiquem todas iguais.
- Folhas, pétalas e cinzas giram suavemente enquanto caem no estilo suave. Os outros tipos mantêm a orientação original.
- As imagens precisam estar dentro do tema. Um link para uma imagem em outro site é ignorado.

O tema inicial Lantern Path usa quatro folhas pintadas dessa forma.

## Estilo pixel

O estilo pixel coloca toda a camada de clima em uma grade de pixels quadrados grandes, para combinar com temas de pixel art. Gotas de chuva, flocos e estrelas viram pequenos blocos bem definidos.

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel` ativa o estilo pixel. `smooth` (ou deixar essa linha de fora) é o visual normal.
- `--mari-weather-pixel-size` define o tamanho de cada bloco, de `2px` a `6px`. `3px` é um bom começo.
- No estilo pixel, as imagens são desenhadas no tamanho original multiplicado por `-size`. Desenhe a pixel art com 1 pixel por pixel da arte e defina `-size` com o mesmo número do tamanho do pixel, para que os pixels da arte se alinhem com os do clima. Petal OS desenha pétalas de 11 pixels com tamanho `3`.
- No estilo pixel, as imagens não giram enquanto caem e são desenhadas sem transparência parcial (aparecem e desaparecem em três etapas bem definidas), para manter a pixel art nítida.

### Exemplo: Petal OS

Este é o tema inicial Petal OS em uma noite com flores. As pétalas são desenhos próprios de 11 pixels, e as estrelas ficam na mesma grade de 3 px.

## O sol e a lua

O sol e a lua aceitam uma cor, um tamanho e uma imagem, como qualquer outro tipo:

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

Se o plano de fundo já tiver uma lua pintada, desative a lua do aplicativo para não haver duas:

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none` faz o mesmo com o sol.

## Diminua ou aumente a intensidade

Estas configurações mudam toda a camada de clima de uma vez:

| Token | O que faz | Valores |
| --- | --- | --- |
| `--mari-weather-amount` | Quantas partículas caem | De `0.25` (um quarto) a `1` (normal). Um tema pode reduzir a quantidade de partículas do clima, mas nunca aumentá-la. |
| `--mari-weather-speed` | A velocidade com que as coisas caem | De `0.5` (metade da velocidade) a `1.5` |
| `--mari-weather-strength` | A intensidade com que as partículas aparecem | De `0.5` (suave) a `1.5` (forte) |
| `--mari-weather-tint-strength` | A camada de cor sobre o chat (azul na chuva, escura à noite) | De `0` (nenhuma) a `1` (normal) |
| `--mari-weather-lightning-color` | A cor do clarão do relâmpago | Uma cor simples. O clarão continua suave e lento, para ser seguro para pessoas sensíveis a luzes piscando. |
| `--mari-weather-lightning-bolt` | Desenha um raio ramificado a cada clarão, na cor do relâmpago | `on`, ou uma largura de `0.5` a `3`. `none` (o padrão) mantém apenas o clarão. |

Para um tema de leitura tranquilo, experimente `--mari-weather-amount: 0.5;` e `--mari-weather-tint-strength: 0.3;`.

### Raios

Por padrão, uma tempestade apenas produz clarões na tela. Adicione `--mari-weather-lightning-bolt` para desenhar um raio ramificado a cada clarão:

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

O raio desce pela borda esquerda ou direita da tela, nunca pelo meio, onde fica o texto do chat. Ele se divide em várias ramificações e brilha na cor que você definiu para o relâmpago. Só aparece enquanto o clarão do próprio aplicativo está visível e desaparece junto com ele, então um tema não pode adicionar clarões nem torná-los mais rápidos. No estilo pixel, o raio é desenhado em blocos na grade de pixels. A maioria dos temas iniciais usa raios: Apogee Lounge, Dewglass, Gutterlight, Under Sail e Velvet Casket. Granite Watch os desativa porque se passa em um ambiente interno.

## Faça o plano de fundo acompanhar o clima

A arte do seu tema também pode mudar com o clima. Enquanto um chat mostra clima, Marinara adiciona duas palavras à página que o CSS pode verificar:

- `data-mari-weather` é um destes valores: `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom` ou `aurora`.
- `data-mari-sky` é um destes valores: `dawn`, `day`, `dusk` ou `night`.

Esses valores são sempre uma das palavras acima, nunca o texto da própria história. Eles desaparecem quando o chat não tem clima ou o usuário desativa o clima.

### Exemplo: Lantern Path na chuva

Lantern Path troca a floresta ensolarada por uma cinzenta, com céu encoberto, quando chove. À esquerda: uma manhã de céu limpo. À direita: o mesmo chat na chuva.

### Troque o plano de fundo

Para fazer o mesmo, adicione um bloco que só se aplique à chuva ou a tempestades e defina uma segunda imagem de fundo:

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

Como ler: `:root[data-mari-weather="rain"]` significa "só enquanto estiver chovendo". A vírgula significa "ou".

- Se o tema define `--mari-app-backdrop-layers` em vez de `--mari-app-backdrop`, mude `--mari-app-backdrop-layers` no bloco de clima também, porque ele tem prioridade sobre a imagem única.
- Para combinar também com o dia e a noite, adicione o esquema: `:root[data-theme="dark"][data-mari-weather="rain"]` é "uma noite chuvosa no esquema Escuro".
- `data-mari-sky` funciona da mesma forma, por exemplo, `:root[data-mari-sky="dusk"]` para uma versão da arte ao pôr do sol.

### Não duplique o clima

Se o tema tiver sua própria sobreposição de ambiente com folhas caindo ou chuva (`--mari-ambient`), ela pode se acumular sobre o clima da história. Desative-a sempre que houver partículas do clima da história caindo:

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

Isso significa: "quando houver clima, e não for limpo nem nublado, oculte a sobreposição de ambiente".

Sua própria sobreposição de folhas caindo ou chuva também pode ficar do lado de fora. `data-mari-shelter` é `indoors` ou `outdoors` enquanto o clima aparece (e fica ausente quando o aplicativo não consegue identificar):

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## O que continua sendo escolha do usuário

Seu tema muda o visual do clima, nunca se as pessoas o veem:

- Um tema não pode ativar ou desativar o clima. Quem decide é **Efeitos de clima dinâmicos**, em Configurações.
- Com **Reduzir animações e efeitos de ambiente** ativado, ou com a configuração de redução de movimento do dispositivo, nenhum clima é desenhado. Os planos de fundo continuam seguindo `data-mari-weather`, porque uma troca de imagem não tem movimento.
- **Efeitos de pintura reduzidos** remove a camada de cor e os brilhos e desenha menos partículas.
- **Intensidade da arte do tema** suaviza o clima como faz com o plano de fundo, e **Alto contraste** o mantém discreto.
- O clima fica pausado enquanto um painel, um editor ou a Mari cobre o chat, para economizar bateria.

## Se não funcionou

- **Nada mudou.** Confira se o token está dentro de um bloco `{ }` e termina com `;`. Confira a grafia: é `--mari-weather-rain-color`, com `color` escrito da forma americana.
- **Um valor é ignorado.** Números fora do intervalo de um token são ajustados para o limite mais próximo, e valores que o aplicativo não entende são descartados. As cores precisam ser cores simples: gradientes e `url()` são ignorados.
- **Minhas imagens não aparecem.** A imagem precisa estar na lista de imagens do tema, e o nome em `url("theme:...")` precisa corresponder exatamente a ela, com a extensão certa (`.webp` ou `.png`).
- **Não aparece clima nenhum.** Confira se **World State** está ativado para o chat, se o valor de Clima tem uma palavra da tabela, se **Efeitos de clima dinâmicos** está ativado e se **Reduzir animações e efeitos de ambiente** está desativado.
- **O clima aparece no Roleplay, mas não no Conversation Mode.** Isso é esperado. O clima aparece apenas nos chats de Roleplay e Game Mode.

## Aprenda com os temas iniciais

Todos os temas iniciais da galeria de temas mostram efeitos de clima. Baixe um, clique em **Clonar e editar** e role até a parte do CSS marcada como `Weather` para ver como funciona.

- **NEON//GRID**: traços longos de chuva ciano, "neve de dados" quadrada, faíscas magenta no lugar de folhas e pétalas. Sua sobreposição de chuva pintada sai de cena quando cai chuva de verdade.
- **Petal OS**: estilo pixel em uma grade de 3 px, pétalas próprias em pixel art, chuva rosa-clara à noite e em tom escuro de frutas vermelhas durante o dia, e uma cidade que fica acinzentada com o mau tempo.
- **Lantern Path**: folhas pintadas próprias, vaga-lumes de cores quentes, sem sol do aplicativo (o plano de fundo tem sua própria luz pintada) e planos de fundo que ficam encobertos ou cobertos de neve conforme o clima.
- **Dewglass**: bolhas de sabão próprias no lugar das partículas flutuantes, flocos de neve cristalinos desenhados por código, chuva verde-água, raios ciano e planos de fundo de lagoa que ficam encobertos, congelados ou com névoa.
- **Velvet Casket**: uma tempestade diferente para o dia e a noite: raios rosa e chuva lilás durante o dia, raios branco-violeta e chuva prateada sobre o cemitério à noite, com morcegos e pétalas de rosa próprios ao vento.
- **Gutterlight**: chuva fria com visual de quadrinhos, pedaços de jornal rasgado ao vento, névoa de poluição amarelo-sódio e um plano de fundo de tempestade com água escorrendo das gárgulas enquanto os raios caem.
- **Under Sail**: uma tempestade em alto-mar com raios branco-azulados descendo pelo cordame, neblina marítima, neve na amurada e nas escadas de corda, e penas de gaivota ao vento.
- **Apogee Lounge**: clima espacial visto pela janela do salão. Uma tempestade vira uma tempestade de íons em uma nebulosa com raios de plasma violeta, a chuva vira rastros de micrometeoros, a neve vira um campo de gelo e a neblina vira névoa de nebulosa. Uma máscara mantém tudo dentro da área do vidro.
- **Granite Watch**: um tema de ambiente interno, então o clima fica tão discreto quanto um tema permite. A chuva parece pingos dos dutos, a neve parece pó de gesso, os raios ficam desativados e o clarão do aplicativo ganha a cor de uma lâmpada piscando. Veja este tema para aprender a suavizar o clima em um ambiente interno.

## Guias relacionados

- [Guia de criação de temas](theme-author-guide.md)
- [Temas CSS personalizados](custom-css-themes.md)
- [HUD e trackers do Roleplay](../roleplay/hud-and-trackers.md)
- [Configurações de aparência](appearance-settings.md)
