# Podstawy AI: modele, tokeny i kontekst

Dopiero zaczynasz czatować z AI? Ta strona wyjaśnia kilka pojęć używanych w pozostałych przewodnikach. Nie potrzebujesz konta, żeby ją przeczytać. Oprowadzenie **Podstawy AI** na ekranie głównym przechodzi przez te zagadnienia krok po kroku.

## Czym jest model AI

Model AI (nazywany też dużym modelem językowym, czyli LLM) to program, który przeczytał ogromną ilość tekstu i nauczył się przewidywać, co będzie dalej. Gdy wysyłasz wiadomość, pisze odpowiedź małymi kawałkami, za każdym razem wybierając prawdopodobny następny fragment.

Nie wyszukuje informacji podczas pisania. Cała jego wiedza pochodzi z tego, co przeczytał, zanim ukończono jego tworzenie, oraz z tego, co Marinara wysyła mu wraz z twoją wiadomością. Dlatego postać zna tylko to, co jest w jej karcie, w czacie i w wiedzy o świecie dodanej przez aplikację Marinara.

## Gdzie działa model

Marinara to aplikacja, w której czatujesz. Sama nie zawiera dużego modelu. Wysyła twój czat do jednego z dwóch miejsc:

- **Usługi w internecie**, takiej jak OpenRouter, NanoGPT, OpenAI lub Anthropic. Zakładasz tam konto i otrzymujesz klucz API (tajny kod, który pozwala aplikacji Marinara korzystać z twojego konta), a usługa uruchamia model. Większość usług nalicza opłaty według zużycia. Niektóre mają darmowe modele.
- **Modelu na twoim komputerze**, takiego jak [Model wbudowany](../connections/local-model.md). Nie wymaga konta i nic nie kosztuje, ale jest mniejszy i wolniejszy od modeli dużych usług, a całą pracę wykonuje twój komputer.

Żeby dodać którykolwiek z nich, zobacz [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md).

## Tokeny

Modele czytają i piszą tokenami, czyli małymi kawałkami tekstu. Token to średnio około trzech czwartych angielskiego słowa, więc 100 tokenów to około 75 słów. Usługi liczą tokeny, żeby ustalać ceny i limity: zwykle płacisz za tokeny wysyłane oraz otrzymywane w odpowiedzi.

## Okno kontekstu

Model może przeczytać naraz tylko ograniczoną liczbę tokenów. Ten limit to jego okno kontekstu. Przed każdą odpowiedzią Marinara wysyła modelowi instrukcje, kartę postaci, twoją personę, wiedzę o świecie i taką część czatu, jaka się zmieści.

W długim czacie najstarsze wiadomości przestają się mieścić, więc model o nich zapomina. Marinara może przywrócić ważne fragmenty za pomocą podsumowań i funkcji Przywoływanie pamięci. Zobacz [Przywoływanie pamięci i podsumowania czatu](../agents/memory.md).

## Różne modele do różnych zadań

Marinara może używać kilku rodzajów modeli:

| Rodzaj | Co robi | Czy jest potrzebny? |
| --- | --- | --- |
| **Model czatu** | Pisze odpowiedzi. | Tak, na początek wystarczy jeden. |
| **Model decyzyjny** | Odpowiada na proste pytania typu tak lub nie, na przykład "czy scena przeniosła się w nowe miejsce?". | Opcjonalny. |
| **Model embeddingów** | Zamienia tekst w liczby opisujące jego znaczenie, dzięki czemu Marinara może wyszukiwać wiedzę o świecie i wspomnienia według znaczenia. Nigdy nie pisze tekstu. | Opcjonalny. Mały model jest wbudowany. |
| **Odczytywanie obrazów** | Model, który potrafi spojrzeć na obraz i go opisać. | Opcjonalne. |
| **Obrazy, wideo i głos** | Osobne usługi tworzące obrazy, klipy i mowę. Model czatu tego nie potrafi. | Opcjonalne. |

Na początek możesz używać jednego modelu czatu do wszystkiego i dodawać kolejne, gdy jakaś funkcja o nie poprosi. Zobacz [Wybór modelu do każdego zadania](../connections/connecting-to-a-provider.md#choosing-the-model-for-each-job).

## Prompty i presety

Prompt to cały tekst, który Marinara wysyła modelowi, żeby uzyskać jedną odpowiedź. Preset określa, co trafia do promptu i w jakiej kolejności. Opcja **Podejrzyj prompt** w czacie pokazuje dokładny wysłany prompt. Zobacz [Edytor presetów i menedżer promptów](../prompts/presets.md).

## Powiązane przewodniki

- [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md)
- [Modele decyzyjne](../connections/decision-models.md)
- [Wyszukiwanie semantyczne w lorebookach](../lorebooks/semantic-search.md)
- [Professor Mari](professor-mari.md)
