# Planos de fundo que acompanham a história

Um chat de Roleplay mostra uma imagem da cena inteira atrás das mensagens. Ela pode continuar a mesma ou mudar conforme a história avança: o agente **Background** escolhe entre as suas imagens, os locais que você fixa sempre mostram a própria imagem, e as imagens na galeria de um personagem acompanham esse personagem em todos os chats. Quando a imagem muda, Marinara faz uma transição suave da antiga para a nova.

Nada disso exige geração de imagens. Sem um modelo de imagens, você escolhe entre as imagens que envia e, sem nenhuma imagem, o plano de fundo é uma cor sólida.

## Visão geral dos planos de fundo

| Você quer | Use | Guia |
| --- | --- | --- |
| Uma imagem atrás deste chat | **Plano de fundo do chat** | [Definir um plano de fundo para um chat só](#set-a-background-for-one-chat) |
| Que a imagem mude com a cena | O agente **Background** | [Deixar o agente Background escolher](#let-the-background-agent-pick) |
| Que um local tenha sempre a mesma aparência | Um local fixado | [Fixar um plano de fundo para um local](#pin-a-background-to-a-place) |
| O quarto de um personagem em todos os chats em que ele está | Um plano de fundo da galeria | [Planos de fundo que acompanham um personagem](#backgrounds-that-follow-a-character) |
| Imagens novas criadas para novos locais e condições do clima | O agente **Illustrator** | [Planos de fundo criados pelo Illustrator](../media/scene-backgrounds.md) |
| Enviar, marcar com tags e organizar as imagens, ou desfocá-las | A Biblioteca de planos de fundo | [Biblioteca de planos de fundo](../appearance/chat-backgrounds.md) |

Quando a história chega a algum lugar, Marinara decide nesta ordem: uma fixação para esse local neste chat, depois um plano de fundo da galeria que nomeie o local e, por fim, a escolha do agente Background. O Illustrator só cria uma imagem nova quando nenhuma dessas opções serve. Seja qual for a imagem escolhida, a versão dela para o clima da história é exibida quando existe.

## Definir um plano de fundo para um chat só

1. Abra o chat. Depois abra **Configurações → Aparência → Planos de fundo**.
2. Em **Plano de fundo do chat**, clique em **Navegar pela biblioteca** e escolha uma imagem.

A mudança vale só para esse chat. Para voltar ao padrão, clique em **Remover** ao lado de **Plano de fundo do chat**. Você também pode escolher uma em **Configurações do chat → Plano de fundo** no chat. Ainda não tem imagens? Veja [Importar um plano de fundo](../appearance/chat-backgrounds.md#import-a-background).

## Deixar o agente Background escolher

O agente **Background** roda depois de cada resposta. Ele lê a cena e escolhe, entre todos os seus planos de fundo, a imagem mais adequada. Ele só escolhe imagens que você já tem; para criar novas, use o Illustrator.

1. Abra o chat de Roleplay e abra **Configurações do chat** pelo botão de controles deslizantes.
2. Abra **Agents** e ative a opção **Enable Agents**.
3. Adicione o agente **Background**.

A partir daí, o plano de fundo muda sozinho conforme a história passa de um lugar para outro. O agente vê todas as imagens da biblioteca, inclusive as que estão em pastas, e usa os nomes e as tags delas para escolher, então nomes claros e tags de locais ajudam.

Se não funcionou: com só um ou dois planos de fundo, o agente continua escolhendo esses. Acrescente mais à sua biblioteca.

## Fixar um plano de fundo para um local

Use isto quando um local deve ter sempre a mesma aparência: o quarto de John sempre mostra `john-bedroom`, e o seu próprio quarto sempre mostra `my-bedroom`. Quando a história chega a um local fixado, a imagem dele aparece, independentemente do que o agente Background escolheria.

1. Abra **Configurações do chat** pelo botão de controles deslizantes no chat e abra **Plano de fundo**.
2. Em **Pinned places** (locais fixados), clique em **Add place** (adicionar local).
3. Clique na imagem vazia e escolha o plano de fundo. Digite o local do jeito que a história o escreve, como `John's bedroom`.
4. Opcional: abaixo dele, adicione outros nomes que a história pode usar, separados por vírgulas, como `John's room, the master bedroom`.

Mais rápido: enquanto a história está em um local e a imagem certa está aparecendo, clique em **Pin this picture to "John's bedroom"** (fixar esta imagem para "John's bedroom").

As fixações precisam saber onde a história está, então usam o local do agente **World State** (ou do World Maps). No fim da lista, **Story is at** (a história está em) mostra o local, e **Here** (aqui) marca a fixação em uso.

### Como os locais são identificados

- O nome mais específico tem prioridade. `John's bedroom` e `{{user}}'s bedroom` nunca se misturam, e uma fixação simples de `bedroom` só vale para quartos que ninguém fixou.
- Uma ou duas palavras no meio ainda contam: "John's guest bedroom" corresponde a `John's bedroom`, a menos que outra fixação nomeie esse local exatamente. A correspondência nunca atravessa uma vírgula nem outro dono, então "John's house, Mara's bedroom" não é de John.
- `{{user}}` é o nome da sua persona e `{{char}}` é qualquer personagem no chat, então `{{user}}'s bedroom` corresponde a "Alyssa's bedroom".
- "My" e "our" pertencem a quem escreveu a mensagem. Quando a resposta de John diz que a história está em "my bedroom", esse é o quarto de John; "your bedroom" na resposta dele é o seu. Na sua própria mensagem, "your bedroom" é o quarto do personagem quando o chat tem só um.
- Maiúsculas, minúsculas, acentos e apóstrofos não importam. Os nomes correspondem a palavras inteiras: `John` nunca corresponde a "Johnson".
- Com **World Maps**, escolha o local na lista **World Maps place** (local do World Maps). Um prédio fixado também abrange os cômodos dele que não têm uma fixação própria.

### O que uma fixação muda

- A imagem aparece uma vez na chegada. Se você escolher outro plano de fundo na mão enquanto estiver lá, a sua escolha permanece até a história seguir para outro lugar.
- Em um local fixado, o agente Background não pode trocar a imagem, e o Illustrator não cria um plano de fundo novo para ele. Com **Weather Versions of Backgrounds** (versões dos planos de fundo por clima) ativado, a imagem fixada ainda recebe a versão de chuva, neve ou neblina.

Se não funcionou: confira se **Story is at** abaixo da lista mostra o local e se um dos nomes da fixação aparece nele palavra por palavra.

## Planos de fundo que acompanham um personagem

Uma imagem na **Galeria** de um personagem ou de uma persona pode ser marcada como plano de fundo. Ela passa a aparecer em todos os chats em que esse personagem está, sem precisar configurar fixações em cada chat.

1. Abra **Imagens → Galeria** do personagem. Clique no botão de tag de uma imagem e escolha **Usar como plano de fundo**.
2. Digite os locais que ela mostra, separados por vírgulas, como `{{char}}'s bedroom, {{char}}'s room`. Na galeria de um personagem, `{{char}}` é esse personagem; na de uma persona, `{{user}}` é essa persona. Deixe o campo vazio se a imagem não representar um local específico.

O botão de tag da imagem passa a mostrar **Plano de fundo:** e os locais dela. Clique nele para **Edit places** (editar locais) ou **Remove background tag** (remover tag de plano de fundo).

Em um chat com esse personagem, **Configurações do chat → Plano de fundo** lista essas imagens em **From character and persona galleries** (das galerias de personagens e personas). Clique em uma para usá-la. As que nomeiam locais também funcionam como locais fixados e aparecem em **Pinned places** com "In John's gallery, follows them into every chat". Uma fixação definida no próprio chat tem prioridade sobre uma imagem da galeria com o mesmo local.

### Mover uma imagem do chat para a galeria de um personagem

Um plano de fundo que o Illustrator criou em um chat pode passar a pertencer a um personagem de vez:

1. Abra **Configurações do chat → Galeria** no chat.
2. Na imagem, clique no botão de pessoa (**Add to a character's or persona's gallery**) e escolha a quem ela pertence.

A marcação de plano de fundo e os locais vão junto. A imagem não é copiada e permanece na galeria quando o chat é excluído. Exportar um personagem como **Marinara Native** mantém essas marcações.

Os planos de fundo de galerias também recebem versões por clima. A versão de chuva ou neve é salva na Biblioteca de planos de fundo como `gallery-…--wx-rain.png`.

## Guias relacionados

- [Planos de fundo criados pelo Illustrator](../media/scene-backgrounds.md): criação de novos locais, versões por clima e máscaras de janelas.
- [Biblioteca de planos de fundo](../appearance/chat-backgrounds.md): envio de imagens, tags, pastas e desfoque.
- [Galerias de personagens e personas](../characters/galleries.md)
- [Roleplay Mode: primeiros passos](getting-started.md)
