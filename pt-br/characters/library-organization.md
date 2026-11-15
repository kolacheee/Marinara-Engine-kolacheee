# Organizando a biblioteca de personagens

A página **Personagens** da Biblioteca (à direita) lista todos os personagens que você criou ou importou. Use-a para buscar, ordenar, agrupar personagens em pastas, marcar favoritos, filtrar por tags e exportar ou excluir vários de uma vez.

## A página Personagens

Abra **Biblioteca → Personagens**. A página mostra os personagens como cartões com retratos. No topo:

- **Navegar on-line** abre o [Navegador de cards](bot-browser.md) para encontrar personagens em sites públicos.
- **Importar** importa um arquivo de personagem. Veja [Importar e exportar cards de personagem](import-export.md).
- **Novo personagem** abre a janela **Criar personagem**, em branco ou a partir de um modelo. O cartão **Novo personagem** na grade faz o mesmo.
- **Buscar personagens ou tag:name** filtra os cartões (veja [Busca](#search)).
- **Tags**, ao lado da caixa de busca, filtra os cartões pelas tags que você escolher (veja [Tags](#tags)).
- **Favoritos** e **Editados recentemente** filtram os cartões. No celular, eles ficam em uma única lista **Filtrar**.
- O menu de ordenação oferece **A a Z**, **Z a A**, **Mais novos**, **Mais antigos** e **Minha ordem**.
- Os três botões de tamanho deixam os cartões pequenos, médios ou grandes.
- **Nova pasta** (o ícone de pasta) e **Selecionar** (o ícone de marca de seleção) ficam ao lado do título da página.

Clique em um cartão para abrir o personagem. O botão **Chat** dele inicia um chat com esse personagem. Se houver muitos personagens, clique em **Carregar mais** no rodapé.

### Ações de um cartão

Passe o mouse sobre um cartão e clique em **⋯** no canto superior esquerdo, ou clique com o botão direito no cartão. Em uma tela sensível ao toque, mantenha o cartão pressionado. O menu tem:

- **Duplicar** faz uma cópia do personagem.
- **Mover para uma pasta** coloca o personagem em uma pasta ou o tira dela com **Sem pasta**.
- **Exportar** baixa o personagem no formato nativo do Marinara.
- **Selecionar** inicia a seleção, com esse cartão já selecionado.
- **Excluir** remove o personagem depois que você confirma.

### A sua própria ordem

Arraste um cartão e solte antes ou depois de outro cartão. O menu de ordenação muda para **Minha ordem** e mantém essa ordem até você escolher outra ordenação. Escolha **Minha ordem** de novo para voltar a ela. A **Ordem manual** do painel clássico é a mesma ordem.

### Pastas

1. Clique em **Nova pasta** ao lado do título da página. Uma pasta chamada **sem nome** aparece acima dos cartões.
2. Para renomeá-la, clique em **⋯** na pasta e escolha **Renomear**.
3. Arraste um cartão para cima da pasta ou use **Mover para uma pasta** no menu do cartão.

Clique no nome de uma pasta para recolher ou expandir. O número ao lado do nome indica quantos personagens ela tem. **Excluir pasta** no menu **⋯** da pasta remove só a pasta: os personagens voltam para a página, fora dela.

### Exportar ou excluir vários personagens

1. Clique em **Selecionar** ao lado do título da página. Uma caixa de seleção aparece em cada cartão.
2. Clique nos cartões que você quer. Uma barra no rodapé mostra quantos estão selecionados, com a opção **Selecionar tudo**.
3. Escolha **Mover para uma pasta**, **Exportar** ou **Excluir** na barra.

**Exportar** baixa um único zip chamado `marinara-characters.zip`. **Excluir** pede confirmação antes. Clique em **X** na barra ou pressione <kbd>Esc</kbd> para encerrar a seleção.

A ordenação **Favoritos primeiro** e a exclusão de uma tag de todos os personagens ficam no painel Personagens do layout clássico, descrito abaixo. Mude para ele com **Novo layout** em **Configurações → Aparência → Tema**, e volte pelo mesmo caminho.

## No layout clássico: o painel Personagens

No topo do painel, você pode:

- Clicar em **Download** (baixar) para abrir o [Card Browser](bot-browser.md) e encontrar personagens em sites públicos.
- Clicar em **Open Library** (abrir a biblioteca) para abrir uma grade maior, em página inteira, com os mesmos personagens.
- Clicar em **New** (o ícone de mais) para abrir a janela **Create Character**.
- Clicar em **Import** (o ícone de download) para importar um arquivo de personagem. Veja [Importar e exportar cards de personagem](import-export.md).
- Clicar em **Select** (o ícone de check) para ligar o modo de seleção e agir em lote.

A biblioteca completa preserva o card selecionado, a ordenação e a posição da rolagem quando você abre um personagem para editar e volta.

Cada linha mostra o avatar, o nome, uma linha de título opcional, o criador e a versão, até 3 tags e uma estimativa aproximada de tokens. Um pequeno selo de estrela marca um favorito. Passe o mouse sobre uma linha para ver **Duplicate** (duplicar) e **Delete** (excluir). Se você tiver muitos personagens, clique em **Load more** (carregar mais), no rodapé, para carregar a próxima página.

<a id="search"></a>

## Busca

Digite na caixa de busca no topo. O texto de exemplo é **Buscar personagens ou tag:name** (**Buscar personagens/tags** no layout clássico). O texto simples corresponde ao nome, título, descrição e tags de um personagem, sem diferenciar maiúsculas de minúsculas. Digitar `knight` mostra todos os personagens com "knight" em qualquer um desses campos.

| Busca | O que encontra |
| --- | --- |
| `male genshin` ou `male,genshin` | Cards que têm as duas tags exatas. |
| `male "Modern AU"` | Coloque entre aspas uma tag que tenha espaços ou vírgulas. |
| `-tag:"slow burn"` | Esconde todo card com essa tag, mesmo que o resto da busca corresponda. |
| `-vampire` | O mesmo, para uma tag de uma palavra só. As aspas podem ficar de fora. |
| `mage -tag:"villain"` | Cards que correspondem a "mage", sem os que têm a tag "villain". |

A busca comum por frases continua funcionando. A mesma busca funciona na Character Library em página inteira e para personas.

## Ordenação (layout clássico)

O menu suspenso de ordenação do painel clássico tem:

| Opção | O que faz |
| --- | --- |
| **Manual order** (ordem manual) | A ordem que você mesmo definiu. |
| **A-Z** | Nomes de A a Z. |
| **Z-A** | Nomes de Z a A. |
| **Newest** | Os criados mais recentemente primeiro. |
| **Oldest** | Os criados há mais tempo primeiro. |
| **Favorites** | Favoritos primeiro, depois o resto. |

Para definir uma ordem manual, arraste uma linha para cima ou para baixo, ou pressione <kbd>Alt</kbd>+<kbd>Up</kbd> ou <kbd>Alt</kbd>+<kbd>Down</kbd> em uma linha com foco. Qualquer um dos dois muda a ordenação para **Manual order**.

## Pastas (layout clássico)

As pastas agrupam personagens relacionados, por exemplo por história ou série, para facilitar a consulta de uma lista longa. Elas são opcionais, e o novo layout mostra as mesmas pastas.

1. Clique em **New Folder** (nova pasta). Aparece uma pasta chamada **unnamed**.
2. Renomeie a pasta: dê um duplo clique ou um toque duplo nela, ou selecione-a e pressione <kbd>F2</kbd>. Digite o novo nome e pressione <kbd>Enter</kbd>.
3. Arraste a linha de um personagem para cima da pasta para colocá-lo dentro dela. Assim que existir uma pasta, uma linha de ajuda mostra **Drag and drop characters to folders, double-click or double-tap to rename**.

Para tirar um personagem, passe o mouse sobre a linha dele dentro da pasta e clique no botão de remover da pasta, ou arraste-o para fora. Clique em uma pasta para expandir ou recolher. O número ao lado do nome indica quantos personagens ela tem.

Em uma tela sensível ao toque, mantenha uma linha pressionada para pegá-la e depois arraste. Um swipe normal continua rolando a lista.

Para mover vários de uma vez, segure uma linha e toque em outras linhas com um segundo dedo para levá-las junto como uma pilha. Depois, solte a pilha sobre uma pasta.

Para excluir uma pasta, passe o mouse sobre ela e clique no botão de lixeira dela. Uma pasta com personagens pede confirmação: **Delete "name"? Its N characters will stay in the library and move out of the folder.** Uma pasta vazia é removida na hora. Excluir uma pasta nunca exclui os personagens que estão dentro dela.

## Usar uma pasta como equipe de chat em grupo

Cada pasta também é uma equipe salva para chats em grupo. Quando você monta um chat com mais de um personagem, **Add from Folder** (adicionar a partir de uma pasta) adiciona todos os personagens de uma pasta em uma única etapa. Veja [Chats em grupo e conversas em grupo](../chats/group-chats.md).

## Favoritos e tags

### Favoritos

Abra um personagem e clique na estrela **Favorito** para ativar ou desativar. Na página Personagens, o chip **Favoritos** mostra só os favoritos. No painel clássico, os favoritos mostram um pequeno selo de estrela, e três botões abaixo da caixa de busca filtram a lista:

- **All** mostra todos os personagens.
- **Favs** mostra só os favoritos.
- **Non-favs** mostra só os personagens que não são favoritos.

Você também pode escolher **Favorites** no menu suspenso de ordenação para levar os favoritos para o topo.

### Tags

As tags são etiquetas como `fantasy` ou `slow burn`. Você as adiciona no editor de personagem. Veja [Criando e editando personagens](creating-and-editing-characters.md#metadata-tab). As importações adicionam **Imported** e uma tag de origem do card, como **ST** ou **CharX**. Veja [Opções de importação](import-export.md#import-options).

Para filtrar por tag na página Personagens:

1. Clique em **Tags** ao lado da caixa de busca. Abre uma lista de todas as tags, com o número de personagens que têm cada uma.
2. Digite em **Buscar tags** para encontrar uma e clique nas tags que você quer. Com várias selecionadas, só aparecem os personagens que têm **todas** elas. **Sem tags** mostra os personagens sem tags.
3. O botão **Tags** mostra quantas você selecionou. Clique em **Limpar** na lista para removê-las.

As páginas **Personas** e **Lorebooks** têm o mesmo botão **Tags**, e **Presets** também tem um. Digitar `tag:name` na caixa de busca continua funcionando em todas elas.

No painel clássico, quando os seus personagens têm tags, aparece um botão **Tags** com uma contagem, como **Tags (12)**. Clique nele para expandir a lista completa:

- Clique em uma tag para incluí-la como filtro. Com várias tags selecionadas, um personagem corresponde se tiver qualquer uma delas.
- Clique no X de uma tag para excluí-la de todos os personagens que a têm. Marinara pede confirmação: **Remove tag "name" from all characters?**
- **Clear** (limpar) aparece assim que um filtro de tag está ativo. Clique nele para limpar os filtros de tag.

Para esconder uma tag em vez disso, use `-tag:` na caixa de busca, como mostrado em [Busca](#search).

<a id="export-or-delete-many-characters"></a>

## Exportar ou excluir vários personagens (layout clássico)

1. Clique em **Select** no topo do painel. Uma caixa de seleção aparece em cada linha.
2. Clique nos personagens que você quer. O cabeçalho do painel mostra quantos estão selecionados.
3. Use a barra de ações no rodapé.

A barra de ações tem dois botões:

- **Export** (exportar) baixa os personagens selecionados em um único zip chamado `marinara-characters.zip`, no formato nativo do Marinara.
- **Delete** remove os personagens selecionados. Marinara pede confirmação antes: **Delete N characters?**

No modo de seleção, você também pode arrastar juntos os personagens selecionados para dentro de uma pasta. Para os formatos de arquivo, veja [Importar e exportar cards de personagem](import-export.md).

## Guias relacionados

- [Importar e exportar cards de personagem](import-export.md)
- [Criando e editando personagens](creating-and-editing-characters.md)
- [Chats em grupo e conversas em grupo](../chats/group-chats.md)
