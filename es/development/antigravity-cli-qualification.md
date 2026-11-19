# Evaluación de la integración de suscripciones con Antigravity CLI

Esta es una nota de investigación para desarrolladores sobre [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143), revisada por primera vez el 2026-10-23 y de nuevo el 2026-11-19 con las versiones oficiales 1.5.11 y 1.5.12 de `agy` para Windows. Marinara Engine **no** implementa una conexión de suscripción a Antigravity, y el issue sigue cerrado como no planificado. Las exclusiones del agente personalizado suprimieron los hooks probados en esta revisión, pero el subproceso MCP de un plugin descubierto globalmente se inició en ambas versiones. El aislamiento de ejecución sigue sin validarse.

## Interfaces oficiales confirmadas

La CLI oficial `agy` admite el inicio de sesión con credenciales guardadas y la generación de texto sin interfaz interactiva. Su protocolo documentado incluye eventos `init`, `step_update` y `result`, con mensajes de usuario JSON en stdin para la entrada en streaming. En la nueva comprobación en Windows, `agy models` enumeró `gemini-4-neon-high`, y las solicitudes con límites a ese modelo se completaron correctamente con la sesión de Google AI Pro que el usuario ya tenía iniciada. Los modelos disponibles para una cuenta deben consultarse en la CLI instalada, no deducirse de este ejemplo. `--print-timeout 0` espera hasta que termine la operación, y `--disable-slash-commands` desactiva la expansión de comandos en modo print. Consulta el [modo sin interfaz interactiva](https://antigravity.google/docs/cli/headless/) y la [referencia de opciones de la CLI](https://antigravity.google/docs/cli/reference/).

El inicio de sesión de la CLI utiliza el almacén de credenciales del sistema operativo. Su modo independiente con clave de API de Gemini requiere `modelProvider: "gemini"` y `GEMINI_API_KEY`; un adaptador de suscripción no debe elegir esa vía de facturación sin avisar. Los métodos documentados de autenticación programática del SDK de Python son las claves de API de Gemini, las credenciales de Vertex/Google Cloud y los modelos locales. Esos métodos no acreditan una autenticación mediante suscripción de consumo para una alternativa basada en el SDK. Consulta [Autenticación](https://antigravity.google/docs/install/#programmatic-authentication) y la [descripción general del SDK](https://antigravity.google/docs/sdk/overview/).

## Resultado actual del aislamiento de ejecución

Las definiciones oficiales de agentes personalizados ofrecen controles de herramientas, MCP y personalización. La guía de plugins describe `inheritCustomizations` como el control de las skills, reglas y hooks heredados, e `inheritMcp` como el control de los servidores MCP heredados del espacio de trabajo. El anuncio original de `excludeDefaultComponents: true` conserva los hooks posteriores a la invocación, así que esa opción por sí sola no garantiza el aislamiento. La configuración combinada que se muestra a continuación suprimió los hooks preparados para la prueba en 1.5.11, pero no impidió que se iniciaran todos los subprocesos MCP. Consulta los [subagentes personalizados](https://antigravity.google/docs/subagents/), la [creación de plugins](https://antigravity.google/docs/build-plugins/) y el [registro de cambios de la CLI](https://antigravity.google/docs/changelog).

Los hooks pueden proceder de un espacio de trabajo, del archivo global `~/.gemini/config/hooks.json` y de plugins instalados. Incluyen eventos de sesión, invocación del modelo, herramientas y detención. La documentación actual de ajustes y el [esquema oficial de ajustes](https://antigravity.google/schemas/v1/settings.json) indican expresamente que no se carga una entrada `hooks` de `settings.json`. Escribir ahí una entrada vacía no desactivaría las fuentes reales de hooks. Consulta [Hooks](https://antigravity.google/docs/hooks) y los [ajustes de la CLI](https://antigravity.google/docs/settings?tab=cli).

La ayuda de la versión 1.5.11 instalada documenta `--settings` como una forma de anular claves de `settings.json` solo para la sesión, mediante valores proporcionados directamente o en un archivo. Esto permite configurar temporalmente la confianza en el espacio de trabajo y los permisos sin reescribir las preferencias persistentes. No establece un perfil de configuración independiente: `--settings '{"hooks":{}}'` termina con el código 1 y `unknown setting "hooks"`. La ayuda instalada no mostraba ninguna opción para desactivar hooks ni para usar un perfil aislado con autenticación.

La documentación actual de ajustes indica que `/hooks` permite añadir, editar y activar o desactivar hooks, y que los cambios se guardan en archivos de configuración. En la nueva comprobación, `-p "/hooks" --output-format json` sin interfaz interactiva devolvió un inventario estructurado. El inventario y los estados de activación guardados no garantizan que una invocación posterior excluya las personalizaciones ejecutables. Cambiar de directorio, dejar vacía la lista `tools`, pedir que no se usen herramientas o abortar después del inicio no basta para demostrar el aislamiento de ejecución.

Los informes de integraciones de terceros sirven como pistas para investigar. Sus afirmaciones sobre herramientas inertes, registros de resolución de agentes o herencia de personalizaciones deben reproducirse con la versión oficial antes de convertirse en garantías para Engine.

## Comprobación de la versión de octubre de 2026

Se inspeccionaron el [instalador oficial](https://antigravity.google/cli/install.sh) y su [manifiesto de versiones para Darwin ARM64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json) sin ejecutar el instalador. El manifiesto seleccionó el [archivo versionado de `agy` 1.4.6 para Darwin ARM64](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz) con este SHA-512:

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

La suma de comprobación del archivo coincidió. Su binario se extrajo en un directorio temporal exclusivo de la tarea. Solo se ejecutaron `--version` y `--help`, dentro de un entorno aislado de macOS que denegaba el acceso a la red, la lectura/escritura del directorio personal y el acceso al servicio del llavero. Ambos terminaron correctamente. La ayuda no enumeró ninguna opción para desactivar hooks, aislar perfiles o cambiar el directorio de configuración.

Esta comprobación **no** instaló ni autenticó la CLI, ni inspeccionó credenciales, ni invocó un modelo, ni enumeró los modelos de una cuenta con sesión iniciada, ni probó la ejecución de hooks. Corrobora el inventario público de opciones; no demuestra que el aislamiento sea imposible ni valida la generación mediante suscripción.

## Comprobación en Windows de noviembre de 2026

El `agy` instalado indicó la versión 1.5.11. Su SHA-512 coincidió con la suma de comprobación observada en el [manifiesto oficial de Windows AMD64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json), pero no se conservó esa respuesta original del manifiesto. El manifiesto actualizado pasó después a la versión 1.5.12. Durante la revisión, se descargó de forma independiente el [ejecutable versionado 1.5.11 para Windows](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe) y se calculó su hash sin ejecutarlo; sus 234.827.416 bytes coincidieron con el SHA-512 del ejecutable instalado:

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

Las pruebas se ejecutaron en un espacio de trabajo temporal exclusivo de la tarea con los siguientes metadatos de cabecera en `.agents/agents/me-isolation-probe.md`:

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

La [referencia oficial de metadatos de cabecera de agentes personalizados](https://antigravity.google/docs/subagents/) documenta `mainAgent`, `subagent`, `tools` y `commandExecutionPolicy`. Los controles de herencia y exclusión se describen en la guía de plugins y el registro de cambios citados anteriormente. La configuración de prueba se probó en conjunto; seleccionar correctamente el agente no demuestra que cada campo se aplicara de forma independiente.

La generación usó `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`, con un límite independiente de 55 segundos para el subproceso. Los ajustes JSON proporcionados directamente marcaron como confiable el espacio de trabajo temporal, seleccionaron el modo de agente predeterminado, desactivaron los scripts personalizados de estado/título y seleccionaron el modo de permisos indicado abajo. No se omitió ningún permiso.

El objeto de ajustes tenía esta forma, con `<temporary-workspace>` sustituido por el directorio de prueba y `toolPermission` establecido en el modo de permisos de la fila:

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

Se eliminaron del entorno del subproceso de prueba las variables de entorno que activan el uso de claves de API y ADC; no se extrajeron ni copiaron credenciales.

Los hooks de prueba añadían nombres de eventos a archivos de marcadores separados para `SessionStart`, `PreInvocation`, `PostInvocation` y `Stop`. Los servidores MCP locales de prueba en Python añadían un marcador de inicio antes de responder a `initialize` y `tools/list` mediante stdio. La configuración MCP del espacio de trabajo usaba `.agents/mcp_config.json`. Los plugins contenían `plugin.json`, `hooks.json` y `mcp_config.json`, y se descubrían mediante un manifiesto `entries` en `.agents/plugins.json` o `~/.gemini/config/plugins.json`, como se describe en [Descubrimiento de personalizaciones](https://antigravity.google/docs/customization-discovery/). Los controles de hooks, MCP y lectura de archivos omitían `--agent` y mantenían los mismos elementos de prueba y ajustes de sesión. En cambio, la prueba del nombre inexistente comparaba el valor válido `--agent me-isolation-probe` con un nombre de agente sin resolver.

| Prueba | Control | Agente personalizado |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Hooks del espacio de trabajo y globales; hooks de plugins descubiertos en el espacio de trabajo (permisos `strict`) | Los cuatro eventos escribieron marcadores en cada fuente | Sin marcadores de hooks |
| MCP del espacio de trabajo y MCP de plugins descubiertos en el espacio de trabajo (permisos `strict`) | Ambos subprocesos escribieron marcadores de inicio | No apareció ninguno de los marcadores de inicio |
| Hooks de plugins descubiertos globalmente (permisos `request-review`) | Los cuatro eventos escribieron marcadores | Sin marcadores de hooks |
| MCP de plugins descubiertos globalmente (permisos `request-review`) | El subproceso escribió su marcador de inicio | El subproceso siguió escribiendo su marcador de inicio |
| Solicitud explícita de `view_file` para un valor de prueba impredecible (permisos `request-review`) | Devolvió el valor de prueba | Devolvió `FILE_UNAVAILABLE`; no devolvió el valor de prueba |
| Nombre de `--agent` inexistente (permisos `strict`) | `--agent me-isolation-probe` completó la generación | El nombre no válido terminó con el código 1, un resultado de error, uso cero y sin marcadores de hooks/MCP |

El resultado del MCP del plugin descubierto globalmente se repitió dos veces con permisos `strict` y una ruta nueva para el marcador de inicio en cada invocación. Ambas solicitudes con el agente personalizado terminaron con el código 0 y ambos subprocesos escribieron su marcador. Una escritura tardía del control anterior no podía dirigirse a esas rutas nuevas. Este es el impedimento de ejecución que se sigue observando, aunque la respuesta generada no usó ninguna herramienta MCP.

El prompt de lectura de archivos fue `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`, con la ruta absoluta del archivo temporal de prueba sustituida en su lugar. El cuerpo Markdown del agente personalizado le indicaba que respondiera `FILE_UNAVAILABLE` si no podía leer el archivo.

Cuando el manifiesto oficial avanzó durante la investigación, se descargó el [ejecutable 1.5.12 para Windows](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe) en el directorio de prueba exclusivo de la tarea sin reemplazar la CLI instalada. Su SHA-512 se verificó con esta respuesta del manifiesto que se conservó:

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

Las pruebas del plugin descubierto globalmente y de lectura de archivos, tanto con el control como con el agente personalizado, se repitieron con 1.5.12 usando la misma sesión ya iniciada y permisos `request-review`. El control ejecutó todos los eventos de hooks del plugin, inició su subproceso MCP y devolvió el valor de prueba. El agente personalizado devolvió `FILE_UNAVAILABLE` y suprimió esos hooks, pero aun así inició el subproceso MCP. Ambas solicitudes de generación terminaron con el código 0. Las demás filas de la tabla solo se probaron en 1.5.11.

El campo `init.agent` del streaming identificó al agente personalizado seleccionado, y otro prompt en 1.5.11 devolvió un marcador definido únicamente en el cuerpo Markdown de ese agente. Sin embargo, `init.tools` enumeró las mismas herramientas integradas para el control y el agente personalizado, incluidas `run_command` y `view_file`. Considera ese inventario no concluyente respecto al acceso efectivo a las herramientas. La prueba de lectura de archivos establece el comportamiento observado de una herramienta; las demás aún necesitan validación.

Los elementos globales de prueba se crearon únicamente en rutas de hooks/manifiestos que antes no existían, mediante creación exclusiva de archivos y una limpieza que comprobaba su contenido antes de eliminarlos. Se eliminaron ambos archivos globales temporales, y los ajustes persistentes de la CLI coincidieron con sus hashes anteriores a la prueba. La CLI conservó su estado de conversación habitual. Las pruebas no reemplazaron ninguna configuración global existente.

Las pruebas no inspeccionaron el contenido de las credenciales; la autenticación se mantuvo dentro de la CLI oficial.

Estos resultados reales en Windows confirman la generación autenticada mediante suscripción y acotan la preocupación original sobre los hooks. No validan un adaptador: el MCP de los plugins descubiertos globalmente sigue iniciándose. Quedan sin probar los servidores MCP globales independientes, las skills/reglas/subagentes heredados, todas las herramientas capaces de actuar, la cancelación, el comportamiento durante silencios prolongados y la ejecución real en Linux/macOS. Las correcciones más recientes de las políticas de plugins y del entorno aislado que recoge el registro de cambios de la CLI no demuestran que una solicitud normal con suscripción de consumo excluya todas las personalizaciones ejecutables.

## Pruebas necesarias antes de publicar un adaptador

1. Establece un mecanismo admitido que excluya los hooks globales y del espacio de trabajo, plugins, skills, reglas, subagentes, servidores MCP y herramientas capaces de actuar antes de que cualquier solicitud pueda ejecutarlos. Mantén el inicio de sesión normal dentro de la CLI oficial; no extraigas ni copies tokens.
2. Prueba ese mecanismo con la CLI oficial real y simulaciones locales controladas de modelos. Configura marcadores observables en hooks globales y del espacio de trabajo, así como en plugins/MCP, junto con reglas y solicitudes de herramientas. Verifica tanto la ejecución aislada como controles negativos que demuestren que los marcadores son observables cuando no hay aislamiento.
3. Demuestra que el agente personalizado seleccionado se resuelve antes de ejecutarlo. Rechaza versiones no admitidas, nombres de agentes sin resolver, formatos de inventario desconocidos y comprobaciones de aislamiento no concluyentes; no dependas de textos internos del registro ni de una lista de herramientas aparentemente vacía al iniciar.
4. Añade límites a la entrada/salida del subproceso, archivos temporales privados y su limpieza, cancelación, manejo de códigos de salida distintos de cero y errores de resultado, y cobertura de tiempos de espera sensibles a la actividad, incluido un razonamiento largo sin texto visible. Consulta los modelos de cada cuenta con el comando oficial y conserva el modelo seleccionado y el esfuerzo admitido.
5. Reutiliza los contratos existentes de conexiones/proveedores. Las opciones del SDK de Claude, como `settingSources: []`, son específicas de ese proveedor, no opciones transferibles a `agy`. Explicita cualquier validación pendiente de autenticación real, facturación de suscripciones y plataformas físicas.

Los resultados de Windows con 1.5.11 y 1.5.12 satisfacen algunas de estas comprobaciones, pero dejan un fallo reproducible de inicio de subprocesos. #8143 sigue cerrado como no planificado; esta nueva comprobación no lo reabre ni autoriza trabajo en tiempo de ejecución. No debe añadirse un proveedor en tiempo de ejecución sin una decisión de quien mantiene el proyecto y una validación completa.
