# Tła tworzone przez agenta Illustrator

Agent **Illustrator** może malować tła opowieści: na żądanie, przy każdym nowym miejscu, wersje deszczu, śniegu i mgły po zmianie pogody oraz wersje świtu, dnia, zachodu słońca i nocy po zmianie pory dnia. Ten przewodnik opisuje je wszystkie i sposób ponownego używania posiadanych obrazów.

Obrazy, które wgrywasz i wybierasz ręcznie, opisuje przewodnik [Biblioteka teł](../appearance/chat-backgrounds.md). O tym, jak czat wybiera wyświetlany obraz (agent Background, przypięte miejsca i obrazy z galerii), przeczytasz w przewodniku [Tła podążające za historią](../roleplay/backgrounds.md).

## Zanim zaczniesz

- Zainstaluj agenta **Illustrator** z **Biblioteka → Agenci**. Zobacz [Agent Illustrator](illustrator-agent.md).
- Przypisz mu model obrazów: ustaw zadanie **Obrazy** w sekcji **Domyślne** na stronie Połączenia albo wybierz model na ekranie **Otwórz konfigurację** agenta Illustrator. Zobacz [Dostawcy generowania obrazów i konfiguracja](image-providers.md).

Malowane tła działają w czatach w trybie Roleplay i Game Mode, ale nie w trybie Conversation. W trybie Conversation aplikacja pokazuje komunikat "Scene background generation is available in Roleplay and Game modes."

## Namalowanie tła od razu

1. Otwórz **Ustawienia czatu** przyciskiem z suwakami w czacie i rozwiń sekcję **Galeria**.
2. Kliknij **Tło**. Podczas pracy przycisk pokazuje **Generowanie...**.
3. Po zakończeniu nowy obraz trafia do biblioteki teł i pojawia się za czatem. Potwierdza to komunikat "Background generated."

Nie musisz w tym celu dodawać agenta Illustrator do czatu. Uruchamia się tylko raz i nie włącza automatycznych uruchomień.

Marinara buduje prompt na podstawie sceny: w grze obejmuje to gatunek, realia, miejsce, pogodę i porę dnia. Obraz używa rozmiaru obszaru roboczego **Tła**, czyli 1280 na 720 pikseli, chyba że zmienisz go w **Ustawienia → Media → Generowanie obrazów**.

Jeśli się nie udało: komunikat "Choose an image generation connection for the Illustrator agent, or mark one as the default image connection." oznacza, że nie znaleziono modelu obrazów. Ustaw go zgodnie z opisem w sekcji **Zanim zaczniesz**. Jeśli brakuje przycisku **Tło**, agent Illustrator nie jest zainstalowany.

## Nowe tło dla każdego nowego miejsca

Po włączeniu tej opcji Illustrator maluje tło, gdy historia dociera do miejsca, które jeszcze go nie ma, zapisuje je w bibliotece i wyświetla.

1. Dodaj agenta **Illustrator** do czatu: otwórz **Ustawienia czatu → Agenci**, włącz **Włącz agentów**, a potem dodaj agenta **Illustrator** z sekcji **Różni agenci**.
2. Na karcie agenta **Illustrator** włącz **Generuj tła scen**.

Illustrator sprawdza scenę zgodnie z ustawieniem **Interwał generowania obrazów** (co 5 wiadomości, chyba że je zmienisz). Żeby sprawdzał każdą odpowiedź, użyj [sprawdzania przez model decyzyjny](#check-every-reply-with-a-decision-model). W trybie Game Mode przełącznik **Ilustrator gry** obejmuje także tła.

### Ponowne używanie posiadanych obrazów

Zanim Illustrator namaluje nowe miejsce, szuka obrazu, który już masz, w tej kolejności:

1. Tło przypięte do tego miejsca w czacie albo w galerii postaci. Zobacz [Przypinanie tła do miejsca](../roleplay/backgrounds.md#pin-a-background-to-a-place).
2. Obraz z biblioteki, którego nazwa lub tag złożony z co najmniej dwóch słów występuje w lokalizacji z World State. Na przykład `generated-guest-bedroom.png` albo obraz z tagiem `guest bedroom` pasuje do lokalizacji "Smith House, guest bedroom".
3. Jeśli World State nie podaje lokalizacji, w ten sam sposób dopasowywana jest nazwa miejsca zapisana przez model promptów agenta Illustrator.

Wielkość liter, akcenty i "'s" nie mają znaczenia, a najbardziej szczegółowa nazwa ma pierwszeństwo przed zwykłym `bedroom.png`. Jeśli znajdzie pasujący obraz, wyświetla go (w wersji odpowiadającej pogodzie w historii, jeśli taka istnieje) i niczego nie maluje. Nowy obraz powstaje tylko dla miejsca bez dopasowania.

Jeśli żadna nazwa nie pasuje i włączysz **Użyj ponownie tła z biblioteki, które wygląda jak to miejsce** na karcie Illustrator, [model decyzyjny odczytujący obrazy](../connections/decision-models.md#features-that-look-at-pictures) ogląda najwyżej 4 obrazy z biblioteki, które mają wspólne słowo z nazwą miejsca, i pokazuje pasujący obraz. Dopiero gdy żaden nie pasuje, powstaje nowy. Opcja jest domyślnie wyłączona i wyszarzona bez takiego modelu.

Żeby miejsce zachowało swój obraz, nadaj plikowi nazwę tego miejsca (`kitchen.png` dla "Kitchen") albo dodaj tag z co najmniej dwóch słów, taki jak `smith house kitchen` (zobacz [Tagowanie tła](../appearance/chat-backgrounds.md#tag-a-background)). Tagi jednowyrazowe, takie jak `kitchen` lub `night`, są tutaj pomijane, bo zwykle opisują wygląd obrazu.

## Wersje teł dopasowane do pogody

Po włączeniu tej opcji tło podąża za pogodą w historii. Gdy przy gospodzie zaczyna padać, Illustrator przemalowuje jej tło, dodając deszcz na oknach. We wnętrzach animowany deszcz pada tylko za szybami, nigdy w całym pokoju.

1. Otwórz **Ustawienia czatu → Agenci → Illustrator**.
2. Włącz **Weather Versions of Backgrounds** (wersje teł dopasowane do pogody).

Potrzebny jest model obrazów, który potrafi zacząć od gotowego obrazu. Większość to potrafi, w tym OpenAI, Gemini, NovelAI i ComfyUI z wejściem obrazu. Przy modelu bez tej możliwości obraz pozostaje bez zmian.

Co się dzieje:

- Każda para obrazu i pogody jest malowana **raz**. Gdy wróci ta sama pogoda albo historia wróci do gospody w deszczu, zapisana wersja pojawi się ponownie bez dodatkowego kosztu.
- Wersja zapisuje się obok oryginału jako `name--wx-rain.png`. Pozostałe rodzaje to `storm`, `snow`, `blizzard`, `hail`, `fog`, `sand`, `ash`, `embers`, `blossom` i `aurora`, a także `clear` dla suchej kopii obrazu utworzonego pierwotnie przy złej pogodzie. Nietypowa pogoda otrzymuje wersję nazwaną słowami z historii: deszcz meteorów to `name--wx-meteor-shower.png`.
- Przy bezchmurnej, słonecznej, pochmurnej, wietrznej i innej łagodnej pogodzie pozostaje zwykły obraz.
- Pogoda jest odczytywana od agenta **World State** albo ze sprawdzenia przez model decyzyjny (poniżej).
- Opcja obejmuje każde tło w bibliotece – wybrane przez ciebie, przez agenta Background lub namalowane przez agenta Illustrator – a także przypięte miejsca i tła z galerii podążające za postacią. Agent **Background** wybiera spośród zwykłych obrazów, a pasująca wersja pogodowa pojawia się, jeśli istnieje.

### Okna: gdzie pada animowany deszcz lub śnieg

Gdy obraz wnętrza po raz pierwszy otrzymuje wersję pogodową, Illustrator pyta też model obrazów, gdzie na obrazie są okna. Zapisuje odpowiedź jako niewielką czarno-białą maskę, wspólną dla wszystkich wersji pogodowych tego pokoju. Animowana pogoda (smugi deszczu, płatki śniegu, płatki kwiatów) jest wtedy rysowana tylko na szybach.

- W pokoju bez okien nie ma animowanej pogody, tylko jej kolorystyka i błyski piorunów.
- Zorza, deszcz meteorów i inne rodzaje pogody bez spadających cząsteczek pozostają nieruchome: widać je na obrazie, ale nic się nad nim nie porusza.
- Maski są przechowywane w `backgrounds/weather-masks` w folderze danych.

### Ponowne tworzenie obrazu pogody lub jego okien

Gdy czat pokazuje wersję pogodową, w **Ustawienia czatu → Agenci → Illustrator** pod opcją **Weather Versions of Backgrounds** pojawia się wiersz nazwany według pogody, na przykład **This rain picture** (ten obraz z deszczem):

- **Remake picture** (utwórz obraz ponownie) maluje tę wersję pogodową od nowa na podstawie zwykłego obrazu.
- **Remake windows** (utwórz okna ponownie) ponownie prosi model obrazów o maskę okien. Użyj tej opcji, gdy deszcz pada na poduszki albo omija okno.
- **No moving weather** (bez animowanej pogody) wyłącza maskę dla tego pokoju. Jego wersje pogodowe pokazują tylko kolorystykę pogody i błyskawice. **Remake windows** przywraca maskę.

Jeśli się nie udało: sprawdź, czy World State czatu pokazuje **Pogoda** (albo czy włączone jest sprawdzanie pogody opisane poniżej) i czy agent **Illustrator** jest dodany do czatu z modelem obrazów.

## Wersje teł dla pór dnia

Po włączeniu tło podąża za zegarem opowieści. Gdy w gospodzie zapada noc, Illustrator przemalowuje jej tło: na zewnątrz ciemne niebo, w środku zapalone lampy i świece. Miejsce, układ i kamera pozostają bez zmian; zmienia się tylko światło.

1. Otwórz **Ustawienia czatu → Agenci → Illustrator**.
2. Włącz **Wersje tła według pory dnia**.

Podobnie jak wersje pogody wymaga to modelu obrazów, który może zacząć od obrazu.

Jak to działa:

- Są cztery pory: **Świt**, **Dzień**, **Zachód słońca** i **Noc**. Decyduje czas World State: godzina (`7:40 PM`, `21:15`) ma pierwszeństwo, a w jej braku słowa takie jak "zmierzch", "północ" czy "wczesny ranek". Przed 5:00 i od 20:00 jest noc, od 5:00 do 7:00 świt, od 7:00 do 17:00 dzień, a od 17:00 do 20:00 zachód słońca.
- Przyjmuje się, że obraz pokazuje porę, w której go namalowano. Illustrator zapamiętuje ją dla swoich obrazów. Dla pozostałych liczy się słowo w nazwie pliku lub tagu (`tavern-night.png`, `#sunset`); reszta jest uznawana za dzień. Obraz dzienny dostaje więc wersję nocną, a nocny dzienną, nigdy drugą nocną.
- Każda para obrazu i pory jest malowana **raz**, a potem wyświetlana bezpłatnie. Wersje są zapisywane obok oryginału jako `name--tod-night.png` (także `--tod-dawn`, `--tod-day` i `--tod-sunset`).
- Przy włączonych wersjach pogody jeden obraz obejmuje oba warunki: deszcz nocą to `name--wx-rain--tod-night.png`, namalowany raz z podstawowego obrazu. Gdy zmienia się tylko pogoda, pora zostaje, i odwrotnie.
- Czas jest sprawdzany po każdej odpowiedzi, nie tylko przy uruchomieniu Illustrator. Obraz nocny pojawia się więc, gdy zegar World State osiągnie noc. Dotyczy to tylko czasu: nowe miejsce nadal czeka na uruchomienie Illustrator lub kontrolę miejsca poniżej.
- Nakładane zabarwienie nieba, słońce, księżyc i gwiazdy są mniej widoczne na wersji pory dnia, bo obraz ma już własne niebo.
- Bez czasu World State porę może ustalić kontrola modelu decyzyjnego (poniżej).

Gdy czat pokazuje wersję pory dnia, pojawia się ten sam wiersz co przy obrazach pogody, np. **Ten obraz: Noc**, z **Odtwórz obraz**.

W bibliotece wersje znajdują się pod podstawowym obrazem: karta pokazuje ich liczbę, a po otwarciu wymienia je w **Wersje pogody i pory dnia**.

## Sprawdzanie każdej odpowiedzi przez model decyzyjny

Illustrator zwykle sprawdza scenę tylko w swoim interwale uruchamiania, więc nowe miejsce może czekać na tło przez kilka odpowiedzi. [Model decyzyjny](../connections/decision-models.md), czyli mały model odpowiadający tak lub nie, może zamiast tego sprawdzać każdą odpowiedź.

Zanim zaczniesz: wybierz model decyzyjny w **Domyślne** na stronie Connections i włącz **Generuj tła scen**, **Warianty pogodowe teł**, **Wersje tła według pory dnia** lub ich dowolne połączenie.

1. Otwórz **Ustawienia czatu → Agenci → Illustrator**.
2. W **Kontrole modelu decyzyjnego** wybierz jedną kontrolę, np. **Scena przeniosła się w nowe miejsce**, **Pogoda się zmieniła** lub **Zmieniła się pora dnia**, albo wszystkie włączone, np. **Nowe miejsce, zmiany pogody i pory dnia**. Widoczne są tylko kontrole włączonych ustawień. Domyślnie: **Wył.**.

Po każdej odpowiedzi:

- Sprawdzenie nowego miejsca pyta, czy ostatnia wiadomość przenosi scenę w nowe miejsce. Odpowiedź twierdząca zapewnia temu miejscu tło, w miarę możliwości wykorzystując obraz, który już masz. Model promptów pisze prompt nowego tła tylko po odpowiedzi twierdzącej.
- Sprawdzenie pogody pyta, czy pogoda zmienia się w ostatniej wiadomości. Odpowiedź twierdząca wyświetla lub maluje wersję pogodową bieżącego tła. Jeśli World State nie podaje pogody, model decyzyjny wybiera też jej rodzaj.
- Kontrola pory dnia pyta, czy najnowsza wiadomość zmienia porę dnia. Odpowiedź twierdząca pokazuje lub maluje wersję bieżącego tła dla danej pory. Bez czasu World State model decyzyjny wybiera też świt, dzień, zachód słońca lub noc.
- Sprawdzenia tylko dodają okazje do działania. Własne uruchomienia agenta Illustrator i zmiany lokalizacji w World State nadal się liczą.
- Przy braku odpowiedzi (brak modelu, przekroczenie limitu czasu lub błąd) sprawdzenie jest pomijane.

Jeśli się nie udało: bez wybranego modelu decyzyjnego lista jest wyszarzona i podaje, gdzie go wybrać.

## Sprawdzenie promptu przed wysłaniem

1. Otwórz **Ustawienia → Media → Domyślne ustawienia generowania**.
2. Włącz opcję **Pokazuj polecenia mediów przed wysłaniem**.

Przed każdym żądaniem obrazu, także malowanego tła, otwiera się wtedy okno **Review Image Prompt** (przegląd promptu obrazu). Popraw prompt i prompt negatywny, a potem kliknij **Generuj**, żeby wysłać, albo **Anuluj**, żeby przerwać. Wpisany tekst jest wysyłany dokładnie w takiej postaci.

## Pokrewne przewodniki

- [Tła podążające za historią](../roleplay/backgrounds.md): obraz wyświetlany w czacie, przypięte miejsca i tła z galerii.
- [Biblioteka teł](../appearance/chat-backgrounds.md): wgrywanie, tagowanie i porządkowanie obrazów oraz rozmycie.
- [Agent Illustrator](illustrator-agent.md): ilustracje scen, klipy i interwał uruchamiania.
- [Galeria czatu](../chats/chat-gallery.md): sekcja galerii i jej przyciski.
- [Modele decyzyjne](../connections/decision-models.md)
