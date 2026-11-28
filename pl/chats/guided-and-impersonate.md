# Sterowane generowanie i Impersonate

Dwa sposoby na kierowanie czatem. Sterowane generowanie nadaje kolejnej odpowiedzi kierunek bez publikowania widocznej wiadomości. Funkcja Impersonate każe modelowi napisać twoją własną odpowiedź. Menu Quick replies (szybkie odpowiedzi) stawia obie akcje obok przycisku **Send** (wysłanie).

## Sterowanie odpowiedzią komendą /guided

Twoja wskazówka jest poza rolą. Kształtuje odpowiedź, ale nie pojawia się jako wiadomość na czacie.

1. Wpisz w polu wiadomości `/guided` i swoją wskazówkę.
2. Naciśnij <kbd>Enter</kbd> albo kliknij **Send**.

Model pisze kolejną odpowiedź zgodnie z twoją wskazówką. Na przykład:

```text
/guided make him admit he is lying
```

Zamiast `/guided` możesz wpisać `/narrator`, `/narrate` albo `/nar`. Na czacie grupowym skieruj wskazówkę do jednej postaci za pomocą `respond as`, `reply as` albo `respond for`:

```text
/guided respond as Alice make her admit she is lying
```

## Sterowanie ponownym generowaniem

Ten sposób wykorzystuje tekst z pola wiadomości jako jednorazową wskazówkę dla ponownego generowania.

1. Otwórz **Ustawienia → Czatowanie → Edycja i swipe'y** i włącz **Guide swipes/regens with chat input** (sterowanie swipe'ami i ponownym generowaniem tekstem z pola wiadomości). Domyślnie jest wyłączone.
2. Na czacie wpisz wskazówkę w polu wiadomości, ale jej nie wysyłaj.
3. Kliknij **Regenerate** (ponowne generowanie) na wiadomości AI. Gdy w polu jest tekst, przycisk nosi nazwę **Regenerate (guided)**.

Wskazówka zostaje potem w polu, więc możesz ją poprawić i ponownie wygenerować odpowiedź. Żeby zamiast tego pole się czyściło, wyłącz **Keep guidance after regenerating** (zachowanie wskazówki po ponownym generowaniu) w **Ustawienia → Czatowanie → Pole wiadomości**.

Jeśli to nie zadziałało: przycisk musi nosić nazwę **Regenerate (guided)**. Jeśli widnieje na nim tylko **Regenerate**, ustawienie jest wyłączone albo pole jest puste.

<a id="read-stored-guidance"></a>

## Odczytywanie wskazówek Stored guidance

Marinara zapisuje wskazówkę, która pokierowała odpowiedzią.

1. Kliknij ikonę **Stored guidance** (zapisana wskazówka, zwój) na wiadomości AI.
2. Okno o tytule **Stored guidance** pokazuje wskazówkę.

Okno podaje, skąd pochodzi wskazówka: **/guided**, **Guided regenerate** (sterowane ponowne generowanie) albo **Game start** (konfiguracja trybu Game Mode). Przy wskazówkach z `/guided` i ze sterowanego ponownego generowania przycisk **Copy /guided** kopiuje gotową do użycia komendę `/guided`, którą możesz wkleić na innym czacie.

## Pisanie odpowiedzi funkcją Impersonate

Funkcja Impersonate każe modelowi napisać twoją kolejną wiadomość głosem twojej persony. Persona to postać, w którą się wcielasz, zapisywana jako `{{user}}`. Zobacz [Persony](../characters/personas.md).

Zanim zaczniesz: Impersonate działa tylko na czatach w trybie Roleplay. W trybie Conversation zobaczysz komunikat "Impersonate is not available in Conversation mode." Funkcja nie jest dostępna także w trybie Game.

1. Wpisz `/impersonate` w polu wiadomości. Jeśli chcesz, dodaj po niej wskazówkę.
2. Naciśnij <kbd>Enter</kbd> albo kliknij **Send**.

Model publikuje wiadomość użytkownika jako twoja persona. Na przykład ta komenda tworzy wiadomość z pytaniem o pogodę:

```text
/impersonate ask about the weather
```

Krótki odpowiednik to `/imp`. **Regenerate** działa na wiadomości napisanej przez Impersonate, więc możesz dostać inną wersję.

Opublikowana wiadomość liczy się jako twoja tura, więc agenci i trackery działają jak przy samodzielnie wpisanej wiadomości, chyba że **Pomijaj agentów** jest włączone. Wybranie opcji CYOA z włączonym **Używaj CYOA jako kierunku** od razu zamawia też odpowiedź postaci. Aby wcześniej przeczytać i poprawić wiadomość, zleć Impersonate napisanie szkicu.

### Najpierw napisz szkic

Szkic trafia do pola wiadomości zamiast do czatu. Nie jest zapisywany, a do chwili wysłania nic się nie uruchamia: ani odpowiedź postaci, ani agenci, ani trackery, ani zmiany stanu świata.

1. Otwórz **Ustawienia czatu** w czacie Roleplay i znajdź sekcję **Impersonate**.
2. Ustaw **Cel wyniku** na **Szkic wiadomości**. Domyślnie jest **Wyślij**.
3. Wpisz `/impersonate` i ewentualną wskazówkę, a potem naciśnij <kbd>Enter</kbd>.

Szkic pojawia się stopniowo w polu wiadomości. Podczas pisania nad polem widnieje **Pisanie następnej wiadomości…**. Kliknij tam **Zatrzymaj** lub przycisk zatrzymania w polu, aby zachować dotychczasowy tekst. Po zakończeniu popraw go i kliknij **Wyślij**. Do chwili wysłania wiersz nad polem oferuje:

| Przycisk | Działanie |
| --- | --- |
| **Ponów** | Pisze szkic ponownie według tej samej wskazówki i zastępuje tekst w polu. |
| **Cofnij** | Odrzuca szkic i przywraca poprzednią zawartość pola. |

Pisanie trwa również po przejściu do innego czatu lub innej karty. Po powrocie szkic jest w polu wiadomości tego czatu. Każdy czat ma własny szkic.

Aby wybrać jednorazowo, bez zmiany ustawienia:

| Polecenie | Działanie |
| --- | --- |
| `/impersonate_draft` | Pisze szkic. Także `/impd` i `/imp_draft`. |
| `/impersonate_post` | Publikuje wiadomość. Także `/impp` i `/imp_post`. |

Gdy **Szybkie odpowiedzi** jest włączone, menu obok **Wyślij** też zawiera obie opcje: **Impersonate** stosuje ustawienie, a druga akcja robi odwrotnie. Szkic można zacząć przy pustym polu; wtedy model wybiera, co powiesz.

Gdy **Używaj CYOA jako kierunku** jest włączone, a **Cel wyniku** ma wartość **Szkic wiadomości**, kliknięcie opcji CYOA tworzy szkic z tą opcją jako wskazówką. Opcje pozostają na ekranie do wysłania.

### Ustawienia Impersonate

Te ustawienia dotyczą każdego `/impersonate` we wszystkich twoich czatach, oknach i urządzeniach. Otwórz **Ustawienia czatu** w czacie Roleplay i znajdź **Impersonate**. Sposób otwierania panelu opisują [Ustawienia czatu](chat-settings.md).

| Kontrolka | Do czego służy |
| --- | --- |
| **Cel wyniku** | **Wyślij** dodaje wiadomość od razu do czatu. **Szkic wiadomości** wpisuje ją do pola wiadomości, aby można było ją poprawić i samodzielnie wysłać. Zobacz [Najpierw napisz szkic](#write-a-draft-first). Domyślnie: **Wyślij**. |
| **Prompt Template** (szablon promptu) | Opcjonalna instrukcja wysyłana przy każdym użyciu Impersonate. Gdy pole jest puste, używany jest prompt samego czatu albo wbudowany prompt domyślny. Obsługuje `{{user}}`, `{{persona_description}}` i `{{impersonate_direction}}` – symbole zastępcze, które Marinara zamienia na prawdziwy tekst. Wybierz **Built-in default** (wbudowany domyślny), żeby przeczytać domyślną treść, **Copy built-in default to edit** (skopiowanie wbudowanego domyślnego do edycji), żeby zacząć od kopii, **Save as** (zapisanie jako), żeby zachować nazwany szablon, i **Delete template** (usunięcie szablonu), żeby go usunąć. |
| **Preset** | Preset promptu tylko dla odpowiedzi z Impersonate. Domyślnie: **Use chat default** (użyj ustawienia czatu). Zobacz [Edytor presetów i menedżer promptów](../prompts/presets.md). |
| **Connection** (połączenie) | Model dla odpowiedzi z Impersonate, na przykład tańszy albo szybszy. Domyślnie: **Use chat default**. Możesz też wybrać **Random** (losowo). Zobacz [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md). |
| **Pomijaj agentów** | Pomija agentów (trackery, routery lorebooka i podobne narzędzia) podczas impersonate. Przyspiesza to działanie i zapobiega zmianom stanu świata. Domyślnie wyłączone. Szkic zawsze ich pomija. Zobacz [Agenci](../agents/agents-overview.md). |
| **Send Public Faces** (wysyłanie publicznych wizerunków) | W czatach Roleplay postać z wypełnionym polem **Public Face** (publiczny wizerunek) pojawia się w prompcie funkcji Impersonate tylko jako imię i Public Face, więc twoja odpowiedź uwzględnia wyłącznie to, co możesz wiedzieć. Zastępuje to wszystko inne wysyłane przez jej kartę: Description, Personality, Backstory, Appearance, Scenario, System Prompt, przykładowe dialogi, atrybuty RPG, Post-History Instructions i Depth Prompt. Postać z pustym polem Public Face zachowuje pełną kartę. Makra umieszczone w presecie lub szablonie promptu funkcji Impersonate, takie jak `{{description}}`, nadal wysyłają wskazaną przez siebie treść. **Wygeneruj ponownie** zachowuje ustawienie użyte podczas pisania wiadomości. Domyślnie wyłączone. Zobacz [Zakładka Card](../characters/creating-and-editing-characters.md#card-tab). |
| **Use CYOA as direction** (użycie CYOA jako wskazówki) | Kliknięcie opcji CYOA (choose your own adventure, czyli "wybierz własną przygodę") używa jej jako wskazówki dla Impersonate zamiast publikować ją na czacie. Domyślnie wyłączone. Jeśli w **Ustawienia → Czatowanie → Pole wiadomości** włączono **Add CYOA choices to the message box instead of sending them** (dodawanie wyborów CYOA do pola wiadomości zamiast ich wysyłania), kliknięcie tylko dodaje tekst do pola wiadomości, a to ustawienie nic nie zmienia. |

### Ustawianie promptu dla jednego czatu

1. Wpisz `/impersonate_prompt` i swój prompt w cudzysłowie.
2. Naciśnij <kbd>Enter</kbd>.

```text
/impersonate_prompt "You will now play as my OC:"
```

Aby wrócić do domyślnego promptu, wpisz `/impersonate_prompt reset`. Odpowiednik tej komendy to `/imp_prompt`.

## Dodawanie Quick replies obok przycisku Send

Quick replies dodają obok **Send** alternatywy dostępne jednym kliknięciem, więc nie trzeba wpisywać komendy slash.

1. Otwórz **Ustawienia → Czatowanie → Pole wiadomości**.
2. Włącz **Quick replies**. Domyślnie jest wyłączone.
3. Rozwiń tę pozycję, żeby wybrać akcje, które mają się pojawić. Po włączeniu wszystkie trzy akcje są domyślnie włączone.

| Akcja | Do czego służy |
| --- | --- |
| **Post only** (tylko publikacja) | Dodaje wpisaną wiadomość na czat bez odpowiedzi. To samo robi komenda `/send <message>`. |
| **Guide reply** (pokierowanie odpowiedzią) | Wysyła wpisany tekst jako wskazówkę `/guided`. |
| **Impersonate** | Generuje odpowiedź persony, używając wpisanego tekstu jako wskazówki. Stosuje **Cel wyniku**, a w Roleplay druga akcja obok robi odwrotnie (**Impersonate jako szkic** lub **Impersonate i wyślij**). Ukryta w czatach Conversation. |

Gdy włączona jest jedna akcja, jej przycisk stoi obok **Send**. Gdy jest ich więcej, zwijają się do przycisku z trzema kropkami (**Quick replies**), który otwiera menu.
