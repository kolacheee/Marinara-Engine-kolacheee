# Conceptos básicos de IA: modelos, tokens y contexto

¿Estás empezando con los chats de IA? Esta página explica los pocos términos que usan las demás guías. No necesitas una cuenta para leerla. El recorrido **Conceptos básicos de IA** de la pantalla de inicio te los explica paso a paso.

## Qué es un modelo de IA

Un modelo de IA (también llamado modelo de lenguaje grande, o LLM) es un programa que ha leído una enorme cantidad de texto y ha aprendido a predecir qué viene después. Cuando envías un mensaje, escribe la respuesta un pequeño fragmento a la vez, eligiendo en cada paso un fragmento que probablemente venga a continuación.

No consulta información mientras escribe. Todo lo que sabe viene de lo que leyó antes de estar terminado, más lo que Marinara le envía junto con tu mensaje. Por eso un personaje solo conoce lo que está en su tarjeta, en el chat y en el trasfondo que añade Marinara.

## Dónde se ejecuta un modelo

Marinara es la app en la que chateas. No contiene un modelo grande. Envía tu chat a uno:

- **Un servicio en internet**, como OpenRouter, NanoGPT, OpenAI o Anthropic. Creas una cuenta allí, consigues una API key (clave de API: un código secreto que permite a Marinara usar tu cuenta) y el servicio ejecuta el modelo. La mayoría de los servicios cobran por uso. Algunos tienen modelos gratuitos.
- **Un modelo en tu propia computadora**, como el [Modelo integrado](../connections/local-model.md). No necesita cuenta y no cuesta nada, pero es más pequeño y lento que los grandes servicios, y tu computadora hace el trabajo.

Consulta [Conectarse a un proveedor de IA](../connections/connecting-to-a-provider.md) para añadir cualquiera de las dos opciones.

## Tokens

Los modelos leen y escriben en tokens, pequeños fragmentos de texto. Un token equivale aproximadamente a tres cuartas partes de una palabra en inglés, así que 100 tokens son unas 75 palabras. Los servicios cuentan los tokens para fijar precios y límites: normalmente pagas por los tokens que envías y por los que recibes.

## La ventana de contexto

Un modelo solo puede leer una cantidad limitada de tokens a la vez. Ese límite es su ventana de contexto. En cada respuesta, Marinara le envía al modelo las instrucciones, la tarjeta de personaje, tu persona (la tarjeta que te representa), el trasfondo que corresponda y todo lo que quepa del chat.

En un chat largo, los mensajes más antiguos dejan de caber, así que el modelo los olvida. Marinara puede recuperar las partes importantes con resúmenes y Memory Recall. Consulta [Memory Recall y resúmenes del chat](../agents/memory.md).

## Distintos modelos para distintas tareas

Marinara puede usar más de un tipo de modelo:

| Tipo                       | Qué hace                                                                                                               | ¿Es necesario?                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Modelo de chat**             | Escribe las respuestas.                                                                                                        | Sí, uno basta para empezar.       |
| **Modelo de decisión**         | Responde preguntas sencillas sobre el chat: sí o no, cuál de varias opciones o cuánto. Algunos también pueden mirar imágenes.                                           | Opcional.                          |
| **Modelo de embeddings**        | Convierte el texto en números que representan su significado para que Marinara pueda buscar trasfondo y recuerdos por significado. Nunca escribe texto. | Opcional. Hay uno pequeño integrado. |
| **Lectura de imágenes**          | Un modelo que puede mirar una imagen y describirla.                                                                        | Opcional.                          |
| **Imagen, video y voz** | Servicios separados que crean imágenes, clips y voz. Un modelo de chat no puede hacerlo.                                                | Opcional.                          |

Puedes usar un solo modelo de chat para todo al principio y añadir los demás cuando una función los necesite. Consulta [Elegir el modelo para cada tarea](../connections/connecting-to-a-provider.md#choosing-the-model-for-each-job).

## Prompts y presets

El prompt (las instrucciones enviadas a la IA) es todo lo que Marinara envía al modelo para una respuesta. Un preset (ajuste guardado) decide qué se incluye en el prompt y en qué orden. **Ver el prompt**, dentro de un chat, muestra el prompt exacto que se envió. Consulta [Editor de presets y gestor de prompts](../prompts/presets.md).

## Guías relacionadas

- [Conectarse a un proveedor de IA](../connections/connecting-to-a-provider.md)
- [Modelos de decisión](../connections/decision-models.md)
- [Búsqueda semántica para lorebooks](../lorebooks/semantic-search.md)
- [Professor Mari](professor-mari.md)
