# Configurações de aparência

A aba **Aparência** muda o visual do Marinara: cores, tamanho do texto, espaçamento, planos de fundo e os botões e janelas do chat. As abas **Conversation**, **Roleplay** e **Game** ao lado dela definem o estilo de cada modo de chat.

Procurando outra coisa?

- Um visual pronto ou um tema próprio: [Temas de CSS personalizados](custom-css-themes.md).
- Outra fonte: [Fontes personalizadas e Google Fonts](fonts.md).
- Uma imagem de plano de fundo para o chat: [Biblioteca de planos de fundo](chat-backgrounds.md).
- A aparência própria de um personagem no chat: [Guia de temas com Card CSS](card-css-theming.md).

## Como abrir as configurações de aparência

1. Abra **Biblioteca → Configurações**.
2. Clique na aba **Aparência**.
3. Clique no nome de uma seção na linha abaixo das abas para ir até ela, ou role a página.

| Aba | Seções |
| --- | --- |
| **Aparência** | **Tema**, **Fontes e tamanho do texto**, **Acessibilidade**, **Cores do texto**, **Layout**, **Efeitos**, **Planos de fundo**, **Botões e janelas do chat**, **Temas CSS** |
| **Conversation** | **Layout do Conversation**, **Plano de fundo do Conversation** |
| **Roleplay** | **Painel de trackers**, **Mensagens de Roleplay**, **Avatares**, **Visual Novel** |
| **Game** | **Texto do jogo**, **Arte do jogo**, **Recursos do jogo** |

Para recomeçar do zero, clique em **Restaurar a aparência** no topo de **Tema**. Isso devolve o visual aos padrões do Marinara, limpa o plano de fundo do chat atual e desativa qualquer tema personalizado.

No layout clássico, essas seções ficam na aba **Aparência**, atrás de quatro botões: **Aplicativo**, **Conversation**, **Roleplay** e **Game**.

## Tema

| Configuração | O que faz |
| --- | --- |
| **Estilo visual** | **Padrão (Marinara)** é um visual retrô Y2K, com efeitos de brilho. **SillyTavern** é um visual limpo e minimalista. Ele só muda o visual e não tem relação com a importação a partir do SillyTavern. **Stage** usa as cores ameixa, latão e carmesim do novo layout. |
| **Novo layout (prévia da reformulação da interface)** | Ativado por padrão. Desative para voltar ao layout clássico. Estes guias descrevem primeiro o novo layout. |
| **Aparência neste dispositivo** | **Igual aos meus outros dispositivos** (o padrão) compartilha o estilo visual, as cores, a fonte e o tema personalizado com todos os dispositivos. **Apenas neste dispositivo** dá a este dispositivo um visual próprio, por exemplo, claro no celular e escuro no computador. |
| **Esquema de cores** | **Escuro** (o padrão), **Claro**, **Seguir o sistema** ou **Seguir a hora do dia**, que alterna pelo relógio deste dispositivo nos horários que você escolher. |
| **Cursor do mouse personalizado** | Ativado por padrão. Usa o cursor do Marinara na cor de destaque. Desative para usar o cursor do sistema, ou para deixar um tema personalizado defini-lo. |
| **Cor de destaque** | Botões, ícones ativos, contornos de foco, realces e bordas. O padrão é **Gradiente do Marinara**, uma mistura de rosa, laranja e ciano. |
| **Pulsação do destaque** | Faz a cor de destaque clarear e escurecer suavemente, ou percorrer as cores de um gradiente. Ativada por padrão no computador e desativada no celular. |
| **Modo RGB** | Faz a cor de destaque percorrer um arco-íris. A **Cor de destaque** salva continua igual. Desativado por padrão. |

A **Cor de destaque** aceita uma cor sólida ou um gradiente, uma transição suave entre duas ou mais cores. Clique em **Voltar ao padrão** para voltar ao padrão. O plano de fundo do aplicativo acompanha o modo Escuro ou Claro, e um tema personalizado pode definir o próprio. Só uma das opções **Pulsação do destaque** e **Modo RGB** pode ficar ativada por vez.

## Fontes e tamanho do texto

- **Fonte** escolhe a fonte do aplicativo. Veja [Fontes personalizadas e Google Fonts](fonts.md).
- **Tamanho de exibição** define o tamanho base do texto no aplicativo inteiro, neste dispositivo. A mudança vale na hora.

| Opção | Tamanho |
| --- | --- |
| **Tiny** | 12 px |
| **Small** | 14 px |
| **Medium** | 16 px |
| **Default** | 17 px |
| **Large** | 19 px |
| **Huge** | 22 px |
| **Extra large** | 26 px |
| **Extra extra large** | 30 px |
| **Maximum** | 34 px |

- **Chat Font Size** (tamanho da fonte do chat) é um controle deslizante para o texto das mensagens do chat, de 12 px a 72 px. O padrão é 16 px.

## Acessibilidade

| Configuração | O que faz |
| --- | --- |
| **Espaçamento entre linhas** | Espaço entre as linhas de mensagens e textos mais longos: **Padrão**, **Confortável (1,6)**, **Amplo (1,8)** ou **Duplo (2,0)**. Menus e botões mantêm o tamanho. |
| **Espaçamento entre letras** | Espaço entre as letras em todo o aplicativo: **Padrão**, **Um pouco mais largo**, **Mais largo** ou **O mais largo**. |
| **Alto contraste** | Texto, bordas e cores de foco mais fortes. **Seguir o sistema** ativa a opção quando o dispositivo pede mais contraste. |
| **Anéis de foco fortes** | Um contorno grosso no item em que o teclado está. <kbd>Tab</kbd> também oferece links **Pular para o conteúdo**. |
| **Reduzir movimento** | Interrompe animações, transições, a **Pulsação do destaque** e os efeitos do tema. A opção é ativada automaticamente quando o dispositivo pede menos movimento. |
| **Intensidade da arte do tema** | Com que intensidade aparecem a imagem de fundo e a sobreposição (chuva, folhas, linhas de varredura) de um tema personalizado. Diminua quando a arte do tema dificultar a leitura. |
| **Cores acessíveis para daltonismo** | Azul e laranja no lugar de verde e vermelho nos indicadores de status, medidores e botões Excluir. |

## Cores do texto

- **Chat Text Color** (cor do texto do chat) é a cor principal do texto das mensagens. O padrão é `#d4d4d4` no Dark e `#1a1025` no Light.
- **Cor padrão do diálogo** colore as falas entre aspas quando um personagem ou uma persona não tem uma Cor de destaque do diálogo própria. As cores do card têm prioridade. Com **Aplicar as cores do preset** ativado em **Botões e janelas do chat**, as falas usam a cor de texto desse estilo.
- **Cor do texto da interface do chat** define o texto dos controles ao redor do chat: widgets de tracker, nomes das pastas, descrições das configurações e janelas abertas pelos botões do chat. Tem os mesmos padrões da **Cor do texto do chat**.
- **Text Outline / Stroke** (contorno do texto) acrescenta um contorno para o texto continuar legível sobre planos de fundo carregados. Defina a cor e a espessura em **Width**, de 0 a 5 px. O padrão é 0.5 px, e 0 desativa o contorno.

## Layout

- **Largura da barra lateral no computador** define a largura das duas barras laterais no computador. **Redefinir a largura** restaura o valor. O celular mantém o próprio layout.
- **Mostrar barra de status do Android** mostra a barra de status do celular no aplicativo para Android.

## Efeitos

- **Efeitos de clima dinâmicos (chuva, neve, neblina etc.)** vem ativado por padrão. Mostra o clima de acordo com o clima e a hora do dia na história, e precisa do agente **World State** ativado no chat. Veja [Agentes: ajudantes de IA para os seus chats](../agents/agents-overview.md).
- **Reduzir animações e efeitos de ambiente** interrompe animações decorativas, partículas, prévias giratórias e a revelação gradual do texto.

- **Mostrar rolagens como texto** (desativado por padrão) mostra cada rolagem como uma linha curta com os dados, os resultados e o total, em vez de dados animados. As rolagens continuam acontecendo, e o modelo e o jogo recebem os resultados. Vale em todos os modos de chat, inclusive nos dados de testes de perícia.
- **Efeitos de pintura reduzidos** simplifica painéis transparentes e sombras pesados para manter a fluidez em dispositivos mais lentos.

## Planos de fundo

Esta seção reúne o seletor **Plano de fundo do chat** e o **Desfoque do plano de fundo**. O seletor mostra o plano de fundo do chat atual (ou **Plano de fundo padrão**) e as escolhas recentes. Clique na imagem ou em **Navegar pela biblioteca** para escolher outra. Também tem:

- **Opacidade da imagem de fundo do Conversation**: com que intensidade o plano de fundo do chat aparece no Conversation Mode.
- **Fundo do chat atrás dos painéis laterais**: estende o plano de fundo suavizado do chat aberto para trás das barras laterais e da barra superior.
- **Planos de fundo na lista de chats**: mostra o plano de fundo de cada chat como um banner esmaecido atrás da linha dele na lista de chats. Escolha **Ativos e sob o cursor**, **Todas as linhas** ou **Desativado**.

Veja [Biblioteca de planos de fundo](chat-backgrounds.md).

## Botões e janelas do chat

**Estilo dos widgets do chat** define o visual dos botões, das janelas e das seções móveis do chat. Escolha **Padrão**, **Dottore** (azul gelo, metal claro e cantos cortados) ou **Professor Mari** (molduras de livro de histórias com detalhes dourados). Escolher um deles redefine os controles abaixo.

| Controle | O que faz |
| --- | --- |
| **Fonte** | **Fonte do preset**, **Fonte do aplicativo**, **Sem serifa**, **Serifada de livro de histórias** ou **Monoespaçada técnica**. |
| **Forma** | **Forma do preset**, **Arredondado**, **Quadrado**, **Cantos cortados** ou **Arqueado**. |
| **Tamanho do botão (px)** | Redimensiona os botões móveis do chat e os ícones deles. Digite de 32 a 96, ou deixe vazio para usar o padrão. |
| **Cor das bordas e dos botões**, **Cor de fundo**, **Cor do texto** | As três cores principais. Redefina uma delas para seguir o preset e o modo Escuro ou Claro. |
| **Aplicar a fonte do preset**, **Aplicar a forma do preset**, **Aplicar as cores do preset** | Levam o estilo também para as mensagens, os campos de entrada e os controles do chat. Desativados por padrão. |

A Professor Mari pode criar um estilo de chat personalizado para você. Peça a ela no chat.

## Temas CSS

Temas prontos e temas que você cria ou importa. Veja [Temas de CSS personalizados](custom-css-themes.md).

## Aba Conversation

- **Layout do chat** (em **Layout do Conversation**) muda a aparência das mensagens do Conversation Mode, com uma prévia ao vivo. **Linear** (o padrão) mostra linhas em estilo de chat. **Balões** mostra balões em estilo de mensageiro.
- **Avatar Shape** (formato do avatar) é **Circular** ou **Square**. O tamanho do avatar não muda.
- **Fotos de perfil no celular** define as imagens ao lado das mensagens no celular, em todos os modos de chat. **Mini** (o padrão) põe uma imagem pequena ao lado de cada nome, antes do nome do personagem e depois do seu, para as mensagens manterem a largura toda. **Inteira** mantém a coluna de imagens, e **Desativadas** não mostra imagens. Tablets e computadores sempre mostram a imagem inteira.
- **Tema do Conversation** (em **Plano de fundo do Conversation**) define um gradiente de duas cores atrás de todos os chats do Conversation Mode. As abas **Escuro** e **Claro** guardam cada uma o próprio gradiente. Esse é um padrão para todos os chats de Conversation, e não uma configuração por chat.

Os botões liga/desliga do menu de swipe ficam em **Configurações → Conversando → Edição e swipes**.

## Aba Roleplay

**Painel de trackers** define o estilo do painel de status, roupa e local ao lado dos chats de Roleplay. Veja [HUD e trackers do Roleplay](../roleplay/hud-and-trackers.md).

**Mensagens de Roleplay**

| Configuração | O que faz | Padrão |
| --- | --- | --- |
| **Posição do chat** | Onde as mensagens e a caixa de entrada ficam em telas largas: **Esquerda**, **Centro** ou **Direita**. No celular, o chat continua com a largura toda. | **Centro** |
| **Largura personalizada do chat** | Define uma largura própria para a coluna de mensagens. | Desativado |
| **Opacidade do fundo das mensagens do Roleplay** | Diminua para deixar o plano de fundo aparecer através dos balões de mensagem. Substitui as cores transparentes dos cards e presets. | 90% |
| **Expandir mensagens** | Cada mensagem ocupa a linha inteira, para as mensagens curtas se alinharem às longas. | Desativado |
| **Ocultar linha sob os nomes** | Remove a linha fina sob os nomes. | Desativado |

**Avatares**

| Configuração | O que faz | Padrão |
| --- | --- | --- |
| Estilo do avatar | **Nenhum**, **Círculos pequenos**, **Retângulos pequenos**, **Painel lateral colado** ou **Painel lateral esmaecido**, um retrato largo que se esmaece até se mesclar à mensagem. | **Círculos pequenos** |
| **Scrollable Avatars** | Mantém os avatares à vista enquanto você rola uma mensagem longa. | Desativado |
| **Avatares alternados do narrador**, **Bordas dos avatares do narrador** | A aparência do avatar do narrador. | |
| **Escala do avatar das mensagens** | De 75% a 250%. | 100% |
| **Escala padrão dos sprites** | De 50% a 175%. O tamanho de sprite definido no próprio chat continua prevalecendo. | 100% |

**Visual Novel**

**Exibição de Visual Novel** mostra um parágrafo terminado por vez, com um retrato de diálogo e os seus sprites. Define a exibição dos novos Roleplays e dos que não têm uma escolha própria. **Reproduzir os parágrafos da VN automaticamente**, com **Intervalo entre parágrafos**, **Escala do retrato de diálogo** e **Escala dos sprites de corpo inteiro**, define como a reprodução funciona.

**Mostrar o raciocínio nas mensagens** e **Não recolher o raciocínio** ficam em **Configurações → Conversando → Raciocínio**.

## Aba Game

**Texto do jogo**

- **Revelar o texto do jogo instantaneamente** pula o efeito de digitação.
- **Navegação com roda do mouse + clique** percorre a história com o mouse.
- **Velocidade da narração do Game** e **Pausa entre segmentos da reprodução automática do Game** definem a velocidade de reprodução e avanço do texto.
- **Exibição do diálogo do Game**: **Caixa de diálogo clássica** (o padrão) mostra um trecho, com as falas anteriores em **Registros**. **Histórico acima da caixa de diálogo** mostra os trechos anteriores acima da caixa.
- **Efeitos de texto do jogo** (ativado por padrão) anima palavras dramáticas, LETRAS MAIÚSCULAS, comentários à parte e tags de efeito de texto. Desative para ver texto simples.

**Arte do jogo** tem dois controles deslizantes: **Escala do retrato de diálogo** (de 75% a 175%, padrão 100%) e **Escala dos sprites de corpo inteiro** (de 75% a 275%, padrão 135%).

**Recursos do jogo** é explicado em [Recursos do jogo](../game/game-assets.md).

## Configurações que ficam só neste dispositivo

A maior parte das configurações de Aparência sincroniza com os seus outros dispositivos. **Tamanho de exibição** e **Tamanho da fonte do chat** não. Elas ficam salvas no navegador que você usa. Para dar um visual totalmente diferente a um dispositivo, use **Aparência neste dispositivo** em **Tema**. Veja em [Visão geral das configurações](../settings/settings-overview.md) o que sincroniza.

## Guias relacionados

- [Temas de CSS personalizados](custom-css-themes.md)
- [Fontes personalizadas e Google Fonts](fonts.md)
- [Biblioteca de planos de fundo](chat-backgrounds.md)
- [Guia de temas com Card CSS](card-css-theming.md)
- [Visão geral das configurações](../settings/settings-overview.md)
