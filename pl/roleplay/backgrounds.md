# Tła podążające za opowieścią

Czat w trybie Roleplay pokazuje za wiadomościami obraz na całą scenę. Może on pozostać taki sam albo zmieniać się wraz z opowieścią: agent **Background** wybiera spośród twoich obrazów, przypięte miejsca zawsze pokazują własny obraz, a obrazy z galerii postaci towarzyszą jej w każdym czacie. Gdy obraz się zmienia, Marinara płynnie przenika stary obraz w nowy.

Żadna z tych funkcji nie wymaga generowania obrazów. Bez modelu obrazów wybierasz spośród wgranych przez siebie obrazów, a jeśli nie ma żadnego obrazu, tło jest jednolitym kolorem.

## Tła w skrócie

| Czego chcesz | Czego użyć | Przewodnik |
| --- | --- | --- |
| Jednego obrazu za tym czatem | **Tło czatu** | [Ustaw tło dla jednego czatu](#set-a-background-for-one-chat) |
| Obrazu zmieniającego się wraz ze sceną | Agenta **Background** | [Pozwól agentowi Background wybierać tło](#let-the-background-agent-pick) |
| Miejsca, które zawsze wygląda tak samo | Przypiętego miejsca | [Przypnij tło do miejsca](#pin-a-background-to-a-place) |
| Pokoju postaci w każdym czacie z jej udziałem | Tła z galerii | [Tła podążające za postacią](#backgrounds-that-follow-a-character) |
| Nowe obrazy dla nowych miejsc, pogody i pory dnia | Agent **Illustrator** | [Tła tworzone przez Illustrator](../media/scene-backgrounds.md) |
| Wgrywania, oznaczania tagami i porządkowania obrazów albo ich rozmywania | Biblioteki teł | [Biblioteka teł](../appearance/chat-backgrounds.md) |

Gdy opowieść dociera do miejsca, Marinara wybiera w tej kolejności: tło przypięte do tego miejsca w czacie, tło z galerii z nazwą miejsca, a potem wybór agenta Background. Przypięte miejsca i miejsca z galerii same zmieniają obraz tylko wtedy, gdy Marinara zna położenie opowieści z **World State** lub **World Maps**. Bez obu tych źródeł agent Background nadal widzi tła galerii według ich miejsc. Illustrator maluje nowy obraz tylko wtedy, gdy żaden nie pasuje. Dla wybranego obrazu pokazuje wersję pogody lub pory dnia, jeśli biblioteka ma odpowiednią dla pogody i czasu opowieści.

## Ustaw tło dla jednego czatu

1. Otwórz czat. Potem otwórz **Ustawienia → Wygląd → Tła**.
2. W sekcji **Tło czatu** kliknij **Przeglądaj bibliotekę** i wybierz obraz.

Zmienia to tylko ten czat. Aby wrócić do domyślnego tła, kliknij **Usuń** obok pola **Tło czatu**. Możesz też wybrać obraz w sekcji **Ustawienia czatu → Tło** w czacie. Nie masz jeszcze żadnych obrazów? Zobacz [Import tła](../appearance/chat-backgrounds.md#import-a-background).

## Samodzielne tworzenie wersji pogody lub pory dnia

Obraz pokazuje sypialnię za dnia, ale opowieść zaczyna się tam nocą w deszczu. Nie musisz czekać na Illustrator:

1. Otwórz czat, a następnie **Ustawienia czatu → Tło**.
2. W **Utwórz wersję tego tła** wybierz **Pogoda** i **Pora dnia**. **Jak namalowano** zachowuje dany element taki jak na obrazie.
3. Kliknij **Utwórz wersję**.

Połączenie obrazów agenta Illustrator przemalowuje obraz z oryginału, także obraz z galerii, a czat pokazuje nową wersję. Trafia ona do biblioteki teł, aby później użyć jej bez ponownego tworzenia. Jeśli już istnieje, pojawia się od razu. Połączenie obrazów musi obsługiwać rozpoczynanie od obrazu.

## Pozwól agentowi Background wybierać tło

Agent **Background** uruchamia się po każdej odpowiedzi. Czyta scenę i spośród wszystkich twoich teł wybiera obraz, który pasuje najlepiej. Wybiera tylko obrazy, które już masz; do tworzenia nowych użyj agenta Illustrator.

1. Otwórz czat w trybie Roleplay i otwórz **Ustawienia czatu** przyciskiem z suwakami.
2. Otwórz sekcję **Agents** i włącz przełącznik **Enable Agents**.
3. Dodaj agenta **Background**.

Tło zmienia się teraz samo wraz ze zmianą miejsca opowieści. Agent czyta tekst, a nie obrazy, więc wybiera na podstawie ich opisów:

- **Obrazy biblioteki** według nazwy pliku i tagów, także w folderach.
- **Tła z galerii** postaci i persony czatu według przypisanych miejsc (np. `dorm kitchen`) i opisu.
- **Przypięte miejsca** w tym czacie według nazw przypiętych obrazów.

Obraz biblioteki z nazwą złożoną tylko z losowych liter i cyfr (np. `70c60b32-6b8c-….jpg`) i bez tagów jest pomijany, bo nic nie określa jego miejsca. Dodaj tag miejsca lub czytelną nazwę, aby można go było wybrać. Jeśli nic z listy nie przedstawia miejsca sceny, agent zachowuje bieżący obraz zamiast zgadywać.

**Ustawienia czatu → Tło** pokazuje pod podglądem powód wyboru bieżącego obrazu. Wiersz znika, gdy wybierzesz obraz samodzielnie.

Jeśli nie działa: przy jednym lub dwóch tłach agent ciągle wybiera te same. Dodaj więcej do biblioteki. Jeśli działa wolno, sprawdź jego połączenie: gdy obsługuje jedno żądanie naraz, czeka na innych agentów, np. Lorebook Keeper.

## Przypnij tło do miejsca

Użyj tej opcji, gdy miejsce powinno zawsze wyglądać tak samo: sypialnia Johna zawsze pokazuje `john-bedroom`, a twoja sypialnia zawsze pokazuje `my-bedroom`. Gdy opowieść przenosi się do przypiętego miejsca, pojawia się jego obraz, niezależnie od tego, co wybrałby agent Background.

1. Otwórz **Ustawienia czatu** przyciskiem z suwakami w czacie i otwórz sekcję **Tło**.
2. W sekcji **Pinned places** (przypięte miejsca) kliknij **Add place** (dodanie miejsca).
3. Kliknij puste pole obrazu i wybierz tło. Wpisz miejsce tak, jak jest zapisywane w opowieści, na przykład `John's bedroom`.
4. Opcjonalnie: poniżej dodaj inne nazwy, których może używać opowieść, oddzielając je przecinkami, na przykład `John's room, the master bedroom`.

Szybszy sposób: gdy opowieść jest w danym miejscu i wyświetla się właściwy obraz, kliknij **Pin this picture to "John's bedroom"** (przypięcie tego obrazu do sypialni Johna).

Przypięcia muszą wiedzieć, gdzie toczy się opowieść, więc korzystają z lokalizacji podanej przez agenta **World State** (albo World Maps). U dołu listy widać **Story is at** (miejsce opowieści) i nazwę miejsca, a **Here** (tutaj) oznacza używane przypięcie.

### Jak dopasowywane są miejsca

- Wygrywa najbardziej szczegółowa nazwa. `John's bedroom` i `{{user}}'s bedroom` nigdy się nie mieszają, a przypięcie o samej nazwie `bedroom` jest używane tylko dla sypialni, których nikt nie przypiął.
- Jedno lub dwa słowa pomiędzy nadal pozwalają na dopasowanie: "John's guest bedroom" pasuje do `John's bedroom`, chyba że inne przypięcie nazywa dokładnie to miejsce. Dopasowanie nigdy nie przechodzi przez przecinek ani innego właściciela, więc "John's house, Mara's bedroom" nie oznacza sypialni Johna.
- `{{user}}` to imię twojej persony, a `{{char}}` – dowolnej postaci w czacie, więc `{{user}}'s bedroom` pasuje do "Alyssa's bedroom".
- "My" i "our" odnoszą się do autora wiadomości. Gdy w odpowiedzi Johna opowieść toczy się w "my bedroom", chodzi o sypialnię Johna; "your bedroom" w jego odpowiedzi oznacza twoją sypialnię. W twojej wiadomości "your bedroom" oznacza sypialnię postaci, jeśli w czacie jest tylko jedna postać.
- Wielkość liter, znaki diakrytyczne i apostrofy nie mają znaczenia. Nazwy pasują do całych słów: `John` nigdy nie pasuje do "Johnson".
- Jeśli korzystasz z **World Maps**, wybierz miejsce z listy **World Maps place** (miejsce w World Maps). Przypięty budynek obejmuje też te pomieszczenia, które nie mają własnego przypięcia.

### Co zmienia przypięcie

- Obraz pojawia się raz, po przybyciu na miejsce. Jeśli podczas pobytu wybierzesz ręcznie inne tło, twój wybór pozostaje, dopóki opowieść nie przeniesie się dalej.
- W przypiętym miejscu agent Background nie może zmienić obrazu, a Illustrator nie maluje nowego tła. Gdy **Warianty pogodowe teł** lub **Wersje tła według pory dnia** jest włączone, przypięty obraz nadal otrzymuje wersję deszczu, śniegu, mgły lub nocy.

Jeśli to nie zadziałało: sprawdź, czy **Story is at** pod listą pokazuje miejsce i czy jedna z nazw przypięcia występuje w nim słowo w słowo.

## Tła podążające za postacią

Obraz w sekcji **Galeria** postaci lub persony można oznaczyć jako tło. Pojawia się wtedy w każdym czacie z udziałem tej postaci, bez ustawiania przypięć w każdym czacie.

1. Otwórz **Obrazy → Galeria** postaci. Kliknij przycisk tagu na obrazie i wybierz **Use as background** (użycie jako tła).
2. Wpisz przedstawione na nim miejsca, oddzielając je przecinkami, na przykład `{{char}}'s bedroom, {{char}}'s room`. W galerii postaci `{{char}}` oznacza tę postać, a w galerii persony `{{user}}` oznacza tę personę. Zostaw pole puste, jeśli obraz nie przedstawia jednego miejsca.

Przycisk tagu obrazu pokazuje wtedy **Background:** (tło) i przypisane miejsca. Kliknij go, żeby wybrać **Edit places** (edycja miejsc) albo **Remove background tag** (usunięcie tagu tła).

W czacie z tą postacią sekcja **Ustawienia czatu → Tło** pokazuje te obrazy w grupie **From character and persona galleries** (z galerii postaci i person). Kliknij obraz, żeby go użyć. Obrazy z nazwami miejsc działają też jak przypięte miejsca i znajdują się na liście **Pinned places** z opisem "In John's gallery, follows them into every chat" (w galerii Johna, towarzyszy mu w każdym czacie). Przypięcie ustawione w samym czacie ma pierwszeństwo przed obrazem z galerii przypisanym do tego samego miejsca.

### Przenieś obraz z czatu do galerii postaci

Tło utworzone przez agenta Illustrator w jednym czacie może na stałe należeć do postaci:

1. Otwórz **Ustawienia czatu → Galeria** w czacie.
2. Na obrazie kliknij przycisk z postacią (**Add to a character's or persona's gallery** – dodanie do galerii postaci lub persony) i wybierz, do kogo należy.

Oznaczenie jako tło i przypisane miejsca zostają zachowane. Obraz nie jest kopiowany i pozostaje w galerii postaci lub persony po usunięciu czatu. Eksport postaci w formacie **Marinara Native** zachowuje te oznaczenia.

Tła z galerii też otrzymują warianty pogodowe. Wariant z deszczem lub śniegiem zapisuje się w Bibliotece teł jako `gallery-…--wx-rain.png`.

## Powiązane przewodniki

- [Tła tworzone przez Illustrator](../media/scene-backgrounds.md): nowe miejsca, wersje pogody i pory dnia oraz maski okien.
- [Biblioteka teł](../appearance/chat-backgrounds.md): wgrywanie, tagi, foldery i rozmycie.
- [Galerie postaci i person](../characters/galleries.md)
- [Tryb Roleplay: pierwsze kroki](getting-started.md)
