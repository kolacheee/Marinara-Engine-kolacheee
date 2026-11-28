# A galeria do chat

A **Galeria** guarda as imagens e os vídeos de um chat: ilustrações, selfies, planos de fundo pintados, quadros de storyboard e tudo o que você enviar. Ela é uma seção das **Configurações do chat**. No computador, você pode separá-la em uma janela própria (veja [Visão geral das configurações do chat](chat-settings.md#popping-a-section-out-into-its-own-window)).

A Galeria de um chat pertence àquele chat. As imagens que você quer guardar para um personagem, seja qual for o chat em que ele estiver, vão na Galeria do próprio personagem. Veja [Galerias de personagens e personas](../characters/galleries.md).

## Imagens e vídeos

A **Galeria** tem duas abas, **Imagens** e **Vídeos**. Cada aba mostra a quantidade de itens que contém. A aba **Vídeos** guarda vídeos de cena nos chats de Roleplay e Game e mensagens de vídeo nos chats de Conversation.

No topo da seção, os botões de ação só aparecem quando o recurso correspondente se aplica ao chat:

- **Ilustrar**: executa o agente Illustrator para gerar uma imagem avulsa da cena. Veja [Agente Illustrator](../media/illustrator-agent.md).
- **Selfie**: gera uma selfie de personagem no modo Conversation.
- **Plano de fundo**: pinta e aplica um plano de fundo para a cena atual. Veja [Planos de fundo feitos pelo Illustrator](../media/scene-backgrounds.md#paint-a-background-now).
- **Vídeo**: cria um vídeo de cena a partir da ilustração mais recente. No modo Conversation, envia uma mensagem de vídeo de um personagem; veja [Mensagens de vídeo](../conversation/selfies.md#video-messages).
- **Criar o storyboard**: gera quadros-chave para o turno mais recente do Game Mode ou o episódio concluído de Roleplay quando o Storyboard está ativo.
- **Browse Images** (explorar imagens): abre um navegador de imagens salvas para inserir.
- **Ver o storyboard**: abre o storyboard mais recente do Game Mode.

Abaixo dos botões fica a área **Enviar imagens**. Arraste imagens para ela para adicionar as suas próprias imagens à Galeria deste chat.

### Ações por imagem

Passe o ponteiro sobre uma imagem na aba **Imagens**, ou toque nela no celular, para ver as ações disponíveis:

- Abrir a imagem em tamanho original (**Abrir a imagem da galeria**).
- **Fixar no chat**: fixa a imagem no chat como uma imagem flutuante. Arraste-a para mover e use a alça no canto para redimensionar. Ela mantém a posição e o tamanho quando você recarrega a página neste navegador. O botão de cadeado ao lado do botão de fechar impede que ela seja movida ou redimensionada até você desbloqueá-la.
- **Baixar a imagem**: salva a imagem no seu dispositivo.
- **Animar a ilustração**: transforma essa imagem em um vídeo de cena.
- **Copiar prompt**: copia o prompt salvo da imagem. Se a imagem não tiver um prompt salvo, o botão mostra **Nenhum prompt salvo** e fica desativado.
- O botão de etiqueta no canto superior esquerdo da imagem: **Use as background** (usar como plano de fundo) marca a imagem como plano de fundo e pergunta quais lugares ela mostra, como `John's bedroom`.
- **Add to a character's or persona's gallery** (adicionar à galeria de um personagem ou de uma persona; o botão de pessoa): guarda a imagem na galeria do próprio personagem ou da própria persona, para que ela continue disponível mesmo depois deste chat. A marcação de plano de fundo e os lugares vão junto, e a imagem passa a acompanhar esse personagem em todos os chats. Veja [Planos de fundo que acompanham um personagem](../roleplay/backgrounds.md#backgrounds-that-follow-a-character).
- **Excluir a imagem da galeria**: remove a imagem depois da sua confirmação.

### Regenerar uma imagem

Você pode gerar uma imagem de novo sem regenerar a resposta à qual ela pertence. Isso funciona para imagens na Galeria do chat que tenham um prompt salvo, como ilustrações, selfies e quadros de storyboard.

1. Abra a imagem em tamanho original pela Galeria ou pela mensagem em que ela aparece.
2. Clique em **Gerar a imagem de novo** (o botão de seta circular no canto superior direito da imagem).
3. Mude o que quiser nos campos abaixo da imagem: **Prompt**, **Prompt negativo**, um campo para cada personagem em **Prompts de personagem** quando a imagem os tiver, e o modelo de imagem.
4. Clique em **Gerar imagem**, ou em **Cancelar** para deixar a imagem como está.

A nova imagem vira a versão selecionada da mensagem. Resultados anteriores ficam num único bloco da Gallery com contador. Cada versão mantém prompt, prompt negativo e detalhes salvos. Os avatares atuais são reenviados, seguidos das imagens de entradas de lorebook usadas originalmente. Stability AI, Arli AI, SD Web UI e Draw Things não recebem imagens de entradas. O editor avisa quando imagens antigas não salvaram prompts negativos ou de personagens.

<a id="image-versions"></a>
### Versões de imagem

Abra uma imagem empilhada para escolher. Na Gallery, setas esquerda/direita, teclas e gestos horizontais mudam de bloco. Abrir pela mensagem mantém na mesma pilha. Controles acima/abaixo, teclas e gestos verticais na imagem mudam de versão. Reduza o zoom primeiro. Rolar o prompt não muda versões.

Clique na imagem, cabeçalho do prompt ou recolher para usar Cima/Baixo com versões. Clique no texto ou copiar para rolar. Os controles ficam visíveis ao regenerar ou editar. Aplique ou limpe a máscara antes de trocar; controles pausam durante a geração.

A escolha salva e aparece após recarregar. Regenerar ou editar uma versão antiga adiciona à mesma pilha e mantém as posteriores. Um chat ramificado tem sua própria seleção.

Com **Salvar automaticamente imagens geradas nas galerias dos personagens**, regenerações e edições mantêm os destinos originais das galerias de personagem e persona. Elas também agrupam versões. Cada galeria salva sua seleção sem mudar a do chat. Entradas compartilham arquivos sem cópias extras. Abrir uma galeria restaura versões ausentes de pilhas antigas se a entrada original ainda aponta ao chat fonte. Versões excluídas de uma galeria já agrupada continuam excluídas.

Na Gallery do chat, use **Excluir a imagem da galeria** no bloco ou excluir no visualizador:

- **Delete this version** remove a exibida. Se selecionada, mostra a mais nova restante.
- **Delete other versions** mantém a exibida e remove as demais.
- **Delete entire stack** remove todas as versões e seus anexos do chat.

A exclusão é permanente. **Cancelar** mantém todas.

## Guias relacionados

- [Agente Illustrator](../media/illustrator-agent.md): ilustrações de cena e clipes.
- [Planos de fundo feitos pelo Illustrator](../media/scene-backgrounds.md): o botão **Plano de fundo**, versões de clima e máscaras de janela.
- [Galerias de personagens e personas](../characters/galleries.md)
- [Geração de vídeo de cena](../media/scene-video.md): transforme uma imagem da Galeria em um vídeo.
