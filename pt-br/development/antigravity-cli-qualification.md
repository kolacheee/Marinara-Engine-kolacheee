# Avaliação da integração de assinaturas com Antigravity CLI

Esta é uma nota de pesquisa para desenvolvedores sobre [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143), verificada inicialmente em 2026-10-23 e reavaliada em 2026-11-19 com as versões oficiais 1.5.11 e 1.5.12 do `agy` para Windows. O Marinara Engine **não** implementa uma conexão de assinatura com Antigravity, e a issue continua fechada como não planejada. As exclusões do agente personalizado suprimiram os hooks testados nesta reavaliação, mas o subprocesso MCP de um plugin descoberto globalmente ainda iniciou nas duas versões. O isolamento da execução continua sem validação.

## Interfaces oficiais confirmadas

A CLI oficial `agy` tem suporte a login na conta com credenciais armazenadas e geração de texto sem interface interativa. O protocolo documentado inclui os eventos `init`, `step_update` e `result`, com mensagens de usuário em JSON no stdin para entrada em streaming. Na reavaliação no Windows, `agy models` listou `gemini-4-neon-high`, e as solicitações com limites a esse modelo tiveram sucesso usando o login Google AI Pro já existente do usuário. A disponibilidade para a conta deve ser consultada na CLI instalada, em vez de deduzida desse exemplo. `--print-timeout 0` espera a conclusão, e `--disable-slash-commands` desativa a expansão de comandos no modo print. Veja o [modo sem interface interativa](https://antigravity.google/docs/cli/headless/) e a [referência de opções da CLI](https://antigravity.google/docs/cli/reference/).

O login da CLI usa o armazenamento de credenciais do sistema operacional. O modo separado com chave de API Gemini exige `modelProvider: "gemini"` e `GEMINI_API_KEY`; um adaptador de assinatura não deve escolher esse caminho de cobrança silenciosamente. Os métodos documentados de autenticação programática do SDK Python são chaves de API Gemini, credenciais Vertex/Google Cloud e modelos locais. Esses métodos não comprovam autenticação por assinatura de consumidor para uma alternativa baseada no SDK. Veja [Autenticação](https://antigravity.google/docs/install/#programmatic-authentication) e a [visão geral do SDK](https://antigravity.google/docs/sdk/overview/).

## Resultado atual do isolamento da execução

As definições oficiais de agentes personalizados oferecem controles de ferramentas, MCP e personalizações. O guia de plugins descreve `inheritCustomizations` como o controle de skills, regras e hooks herdados, e `inheritMcp` como o controle de servidores MCP herdados do espaço de trabalho. O anúncio original de `excludeDefaultComponents: true` preserva os hooks após a invocação, então essa opção sozinha não comprova o isolamento. A configuração combinada abaixo suprimiu os hooks preparados para o teste na versão 1.5.11, mas não impediu a inicialização de todos os subprocessos MCP. Veja [Subagentes personalizados](https://antigravity.google/docs/subagents/), [Criar plugins](https://antigravity.google/docs/build-plugins/) e o [histórico de alterações da CLI](https://antigravity.google/docs/changelog).

Os hooks podem vir de um espaço de trabalho, do arquivo global `~/.gemini/config/hooks.json` e de plugins instalados. Eles incluem eventos de sessão, invocação do modelo, ferramentas e parada. A documentação atual de configurações e o [esquema oficial de configurações](https://antigravity.google/schemas/v1/settings.json) dizem explicitamente que uma entrada `hooks` em `settings.json` não é carregada. Escrever uma entrada vazia ali não desativaria as fontes reais de hooks. Veja [Hooks](https://antigravity.google/docs/hooks) e as [configurações da CLI](https://antigravity.google/docs/settings?tab=cli).

A ajuda da versão 1.5.11 instalada documenta `--settings` como substituições de chaves de `settings.json` válidas apenas para a sessão, fornecidas diretamente ou por um arquivo. Isso permite configurações temporárias de confiança no espaço de trabalho e de permissões sem reescrever preferências persistentes. Não estabelece um perfil de configuração separado: `--settings '{"hooks":{}}'` termina com código 1 e `unknown setting "hooks"`. Nenhuma opção para desativar hooks ou usar um perfil isolado autenticado apareceu na ajuda instalada.

A documentação atual de configurações descreve `/hooks` como capaz de adicionar, editar e ativar ou desativar hooks, salvando as alterações em arquivos de configuração. Na reavaliação, `-p "/hooks" --output-format json` sem interface interativa retornou um inventário estruturado. O inventário e os estados de ativação salvos não garantem que uma invocação posterior exclua personalizações executáveis. Mudar de diretório, deixar a lista `tools` vazia, instruir o modelo a evitar ferramentas ou abortar após a inicialização não basta para comprovar o isolamento da execução.

Relatos de integrações de terceiros são pistas para investigação. As afirmações sobre ferramentas inertes, logs de resolução de agentes ou herança de personalizações precisam ser reproduzidas com a versão oficial antes de virarem um contrato para o Engine.

## Verificação da versão de outubro de 2026

O [instalador oficial](https://antigravity.google/cli/install.sh) e seu [manifesto de versão para Darwin ARM64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json) foram inspecionados sem executar o instalador. O manifesto selecionou o [arquivo versionado do `agy` 1.4.6 para Darwin ARM64](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz), com este SHA-512:

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

A soma de verificação do arquivo conferiu. O binário foi extraído em um diretório temporário exclusivo da tarefa. Somente `--version` e `--help` foram executados, dentro de uma sandbox do macOS que negava acesso à rede, leitura/escrita no diretório pessoal e acesso ao serviço de chaves. Ambos terminaram com sucesso. A ajuda não listou nenhuma opção para desativar hooks, isolar um perfil ou definir um diretório de configuração.

Essa verificação **não** instalou nem autenticou a CLI, nem inspecionou credenciais, nem invocou um modelo, nem listou os modelos de uma conta conectada, nem testou a execução de hooks. Ela confirma o inventário público de opções; não comprova que o isolamento seja impossível nem valida a geração por assinatura.

## Verificação no Windows em novembro de 2026

O `agy` instalado informou a versão 1.5.11. Seu SHA-512 correspondeu à soma de verificação observada no [manifesto oficial para Windows AMD64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json), mas essa resposta original do manifesto não foi preservada. Mais tarde, o manifesto atualizado passou para a versão 1.5.12. Durante a revisão, o [executável versionado 1.5.11 para Windows](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe) foi baixado de forma independente e teve seu hash calculado sem ser executado; seus 234.827.416 bytes produziram o mesmo SHA-512 do executável instalado:

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

Os testes rodaram em um espaço de trabalho temporário exclusivo da tarefa, com o seguinte frontmatter em `.agents/agents/me-isolation-probe.md`:

```yaml
name: me-isolation-probe
description: Harmless execution-isolation qualification fixture.
mainAgent: true
subagent: false
tools: []
inheritCustomizations: false
inheritMcp: false
excludeDefaultComponents: true
commandExecutionPolicy: off
```

A [referência oficial de frontmatter de agentes personalizados](https://antigravity.google/docs/subagents/) documenta `mainAgent`, `subagent`, `tools` e `commandExecutionPolicy`. Os controles de herança e exclusão são descritos no guia de plugins e no histórico de alterações citados acima. A configuração de teste foi avaliada como um conjunto; selecionar o agente com sucesso não comprova que cada campo tenha sido respeitado de forma independente.

A geração usou `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`, com um limite independente de 55 segundos para o subprocesso. As configurações JSON fornecidas diretamente marcaram o espaço de trabalho temporário como confiável, selecionaram o modo de agente padrão, desativaram scripts personalizados de status/título e selecionaram o modo de permissão indicado abaixo. Nenhuma permissão foi ignorada.

O objeto de configurações tinha este formato, com `<temporary-workspace>` substituído pelo diretório de teste e `toolPermission` definido como o modo de permissão da linha:

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

As variáveis de ambiente que ativam o uso de chave de API e ADC foram removidas do ambiente do subprocesso de teste; nenhuma credencial foi extraída ou copiada.

Os hooks de teste acrescentaram nomes de eventos a arquivos sentinela separados para `SessionStart`, `PreInvocation`, `PostInvocation` e `Stop`. Os servidores MCP locais de teste em Python acrescentaram um marcador de inicialização antes de responder a `initialize` e `tools/list` por stdio. A configuração MCP do espaço de trabalho usou `.agents/mcp_config.json`. Os plugins continham `plugin.json`, `hooks.json` e `mcp_config.json`, e foram descobertos por meio de um manifesto `entries` em `.agents/plugins.json` ou `~/.gemini/config/plugins.json`, como descrito em [Descoberta de personalizações](https://antigravity.google/docs/customization-discovery/). Os controles de hooks, MCP e leitura de arquivo omitiram `--agent`, mantendo os mesmos recursos de teste e configurações de sessão. Já o teste de nome inexistente comparou o `--agent me-isolation-probe` válido com um nome de agente não resolvido.

| Teste | Controle | Agente personalizado |
| --- | --- | --- |
| Hooks do espaço de trabalho e globais; hooks de plugins descobertos no espaço de trabalho (permissões `strict`) | Os quatro eventos escreveram marcadores em cada fonte | Nenhum marcador de hook |
| MCP do espaço de trabalho e MCP de plugins descobertos no espaço de trabalho (permissões `strict`) | Ambos os subprocessos escreveram marcadores de inicialização | Nenhum marcador de inicialização apareceu |
| Hooks de plugins descobertos globalmente (permissões `request-review`) | Os quatro eventos escreveram marcadores | Nenhum marcador de hook |
| MCP de plugin descoberto globalmente (permissões `request-review`) | O subprocesso escreveu seu marcador de inicialização | O subprocesso ainda escreveu seu marcador de inicialização |
| Solicitação explícita de `view_file` para um valor imprevisível do arquivo de teste (permissões `request-review`) | Retornou o valor do arquivo de teste | Retornou `FILE_UNAVAILABLE`; não retornou o valor do arquivo de teste |
| Nome de `--agent` inexistente (permissões `strict`) | `--agent me-isolation-probe` concluiu a geração | O nome inválido terminou com código 1, resultado de erro, uso zero e nenhum marcador de hook/MCP |

O resultado do MCP de plugin descoberto globalmente foi repetido duas vezes com permissões `strict` e um novo caminho de marcador de inicialização para cada invocação. Ambas as solicitações com o agente personalizado terminaram com código 0, e ambos os subprocessos escreveram seu marcador. Uma escrita atrasada do controle anterior não poderia atingir esses novos caminhos. Esse é o impedimento de execução ainda observado, embora a resposta gerada não tenha usado uma ferramenta MCP.

O prompt de leitura de arquivo foi `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`, com o caminho absoluto do arquivo temporário de teste substituído no lugar indicado. O corpo Markdown do agente personalizado o instruía a responder `FILE_UNAVAILABLE` se não conseguisse ler o arquivo.

Quando o manifesto oficial avançou durante a investigação, o [executável 1.5.12 para Windows](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe) foi baixado no diretório de teste exclusivo da tarefa sem substituir a CLI instalada. Seu SHA-512 foi conferido com esta resposta preservada do manifesto:

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

O par de controle/agente personalizado para o plugin descoberto globalmente e a leitura de arquivo foi repetido com a versão 1.5.12, usando o mesmo login existente e permissões `request-review`. O controle executou todos os eventos de hook do plugin, iniciou seu subprocesso MCP e retornou o valor do arquivo de teste. O agente personalizado retornou `FILE_UNAVAILABLE` e suprimiu esses hooks, mas ainda iniciou o subprocesso MCP. Ambas as solicitações de geração terminaram com código 0. As outras linhas da tabela foram testadas apenas na versão 1.5.11.

O `init.agent` do stream identificou o agente personalizado selecionado, e um prompt separado na versão 1.5.11 retornou um marcador definido apenas no corpo Markdown desse agente. No entanto, `init.tools` listou as mesmas ferramentas embutidas para o controle e o agente personalizado, incluindo `run_command` e `view_file`. Trate esse inventário como inconclusivo quanto ao acesso efetivo às ferramentas. O teste de leitura de arquivo comprova o comportamento observado de uma ferramenta; as outras ainda precisam ser avaliadas.

Os arquivos globais de teste foram criados apenas em caminhos de hooks/manifestos que não existiam antes, com criação exclusiva de arquivos e limpeza que verificava o conteúdo antes da remoção. Ambos os arquivos globais temporários foram removidos, e os hashes das configurações persistentes da CLI corresponderam aos valores anteriores ao teste. A CLI manteve seu estado normal de conversa. Os testes não substituíram configurações globais existentes.

Os testes não inspecionaram o conteúdo das credenciais; a autenticação permaneceu dentro da CLI oficial.

Esses resultados reais no Windows comprovam a geração autenticada por assinatura e delimitam melhor a preocupação original com hooks. Eles não validam um adaptador: o MCP de plugin descoberto globalmente ainda inicia. Servidores MCP globais independentes, skills/regras/subagentes herdados, todas as ferramentas capazes de agir, cancelamento, comportamento durante longos períodos sem saída e execução real em Linux/macOS continuam sem teste. As correções mais recentes de política de plugins e sandbox no histórico de alterações da CLI não comprovam que uma solicitação comum com assinatura de consumidor exclua todas as personalizações executáveis.

## Evidências necessárias antes de lançar um adaptador

1. Estabeleça uma maneira com suporte oficial de excluir hooks globais e do espaço de trabalho, plugins, skills, regras, subagentes, servidores MCP e ferramentas capazes de agir antes que qualquer solicitação possa executá-los. Mantenha o login normal na CLI oficial; não extraia nem copie tokens.
2. Teste esse mecanismo com a CLI oficial real e simulações locais controladas de modelos. Configure marcadores observáveis em hooks globais e do espaço de trabalho, além de plugins/MCP, com regras e solicitações de ferramentas. Verifique tanto a execução isolada quanto controles negativos que demonstrem que os marcadores são observáveis sem isolamento.
3. Comprove que o agente personalizado selecionado é resolvido antes da execução. Recuse versões sem suporte, nomes de agentes não resolvidos, formatos de inventário desconhecidos e verificações de isolamento inconclusivas; não dependa do texto de logs internos nem de uma lista de ferramentas aparentemente vazia na inicialização.
4. Adicione limites à entrada/saída do subprocesso, arquivos temporários privados e limpeza, cancelamento, tratamento de códigos de saída diferentes de zero e erros de resultado, e testes de timeout que considerem a atividade, inclusive raciocínio longo sem texto visível. Consulte os modelos específicos da conta pelo comando oficial e preserve o modelo selecionado e o esforço com suporte.
5. Reutilize os contratos existentes de conexões/provedores. Opções do SDK do Claude, como `settingSources: []`, são específicas do provedor, não opções transferíveis para `agy`. Deixe explícitas as lacunas de validação de autenticação real, cobrança da assinatura e plataformas físicas.

Os resultados das versões 1.5.11 e 1.5.12 no Windows atendem a algumas dessas verificações, mas ainda deixam uma falha reproduzível de inicialização de subprocesso. #8143 continua fechada como não planejada; esta reavaliação não a reabre nem autoriza trabalho em tempo de execução. Nenhuma entrada de provedor deve ser adicionada em tempo de execução sem uma decisão dos mantenedores e a conclusão da avaliação.
