# Pierwsze kroki z aplikacją Marinara Engine

Marinara Engine to aplikacja do czatowania i odgrywania ról z postaciami AI. Działa na twoim własnym komputerze. Ten przewodnik pokazuje ekran główny i kroki prowadzące do pierwszego czatu.

## Rozpoczęcie pierwszego czatu

Zanim zaczniesz: potrzebujesz klucza API (tajnego kodu, trochę jak hasło) od usługi AI albo opisanego niżej **Built-in model** (model wbudowany).

1. Zainstaluj aplikację Marinara Engine i otwórz ją w przeglądarce. Wybierz swoją platformę w przewodniku [Instalacja aplikacji Marinara Engine](../INSTALLATION.md).
2. Dodaj połączenie: jeden klucz API do jednej usługi AI albo **Wbudowany model**. Zobacz [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md).
3. Wybierz modele, których ma używać to połączenie. Ten sam przewodnik pokazuje, jak to zrobić.
4. Utwórz albo zaimportuj postać. Otwórz **Biblioteka → Postacie** (kliknij **Biblioteka** w prawym górnym rogu), a potem kliknij **Nowa postać** albo **Importuj**, żeby wczytać kartę z pliku. Zobacz [Tworzenie i edycja postaci](../characters/creating-and-editing-characters.md).
5. Kliknij **Conversation**, **Roleplay** lub **Game** na ekranie głównym. Możesz też otworzyć swoje czaty: kliknij **Biblioteka** w prawym górnym rogu, wybierz **Czaty** u góry paska bocznego, wybierz zakładkę **Convo**, **Roleplay** lub **Game** i kliknij **Nowy**.
6. Strona konfiguracji otwiera się w nowej zakładce. Wybierz postać i opcję **Treść**, a potem kliknij **Rozpocznij roleplay** (albo **Rozpocznij rozmowę** w trybie Conversation, **Utwórz świat** w trybie Game).

Co zobaczysz: otworzy się nowy czat i możesz napisać pierwszą wiadomość.

Jeśli nie masz jeszcze połączenia, Marinara najpierw otwiera okno dodawania połączenia.

Marinara nie zawiera AI online. Większość osób łączy się z usługą online. Możesz też pobrać **Built-in model**, niewielki model, który działa na twoim komputerze bez klucza API. Nadaje się do lekkich zadań pomocniczych, a nie do głównego czatu. Zobacz [Konfiguracja modelu wbudowanego](../connections/local-model.md).

Przy pierwszym otwarciu aplikacji Marinara Engine uruchamia się krótkie oprowadzenie z przewodnikiem. Zobacz [Samouczek przy pierwszym uruchomieniu](tutorial.md). Któryś krok sprawia kłopot? Zapytaj Professor Mari, wbudowaną asystentkę: [Professor Mari, twoja asystentka w aplikacji](professor-mari.md).

## Poruszanie się po aplikacji

Marinara ma dwa stałe miejsca, które pozostają na swoich pozycjach niezależnie od motywu:

- **Górny pasek.** Po lewej są **Strona główna** i zakładka dla każdego otwartego czatu, postaci lub strony. Po prawej przycisk wyszukiwania (albo <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>⌘</kbd>+<kbd>K</kbd> na Macu) pozwala znaleźć lub otworzyć wszystko: czat, postać, ustawienie, przewodnik albo pytanie do Professor Mari. Obok są **Ustawienia czatu**, gdy czat jest otwarty, **Docs** z tymi przewodnikami oraz **Biblioteka**, która pokazuje lub ukrywa pasek boczny.
- **Pasek boczny** po prawej ma u góry przełącznik **Czaty | Biblioteka**. **Czaty** pokazują twoje czaty na zakładkach **Convo**, **Roleplay** i **Game** (zobacz [Zarządzanie listą czatów](../chats/managing-chats.md)). **Biblioteka** zawiera **Postacie**, **Persony**, **Księgi wiedzy**, **Presety**, **Skrypty regex**, **Połączenia**, **Agenci** i **Własne narzędzia**, a dalej **Ustawienia** i **Rozszerzenia**. Wybierz pozycję, żeby otworzyć jej stronę pośrodku.

Na komputerze możesz też pokazać dwie strony obok siebie. Zobacz [Widok podzielony](tabs-and-drafts.md#split-view-two-pages-at-once).

Na telefonie lub tablecie **Strona główna** jest w lewym górnym rogu, a **Biblioteka** (przycisk stosu) w prawym górnym rogu. Biblioteka wysuwa pasek boczny nad stroną, z tym samym przełącznikiem **Czaty | Biblioteka**; w widoku Biblioteki na dole są **Ustawienia**, **Docs** i **Wszystkie karty**. Dotknij tytułu na górnym pasku, żeby wyszukać, albo przycisku z liczbą, żeby zobaczyć otwarte zakładki. Zobacz [Zakładki, widok podzielony i niezapisane zmiany](tabs-and-drafts.md) i [Gesty dotykowe](../chats/messages.md#touch-gestures).

## Ekran główny w skrócie

Ekran główny widać wtedy, gdy nie jest otwarty żaden czat. U góry są powitanie, numer wersji i przyciski **Conversation**, **Roleplay** i **Game**, z których każdy rozpoczyna nowy czat w danym trybie. Jeśli żaden model nie jest jeszcze skonfigurowany, **Connect a model to start chatting** (połącz model, żeby zacząć czat) otwiera stronę Połączenia. **Profesor** otwiera asystentkę Professor Mari w osobnej zakładce, zainstalowana aplikacja (na przykład Story Writer) też dodaje tu przycisk, a **Widgety** pozwalają rozmieścić karty poniżej.

W klasycznym układzie (po wyłączeniu opcji **Ustawienia → Wygląd → Motyw → Nowy układ (podgląd przebudowy interfejsu)**) ekran główny wygląda jak przeglądarka internetowa: ma zakładki, pasek wyszukiwania i skróty do **Discord**, **Wesprzyj**, **Twórcy**, **Dokumentacja**, **Samouczek**, **FAQ**, **Osiągnięcia** i **Widgety**.

## Wybór trybu czatu

Tryb wybierasz przy rozpoczynaniu czatu.

- **Conversation**: zwykły czat z AI w stylu komunikatora. Zobacz [Tryb Conversation: pierwsze kroki](../conversation/getting-started.md).
- **Roleplay**: opowieść z jedną lub kilkoma postaciami. Aplikacja śledzi scenę, na przykład miejsce i czas. Zobacz [Tryb Roleplay: pierwsze kroki](../roleplay/getting-started.md).
- **Game**: gra jednoosobowa. AI występuje jako Game Master (mistrz gry), który opowiada historię. Dostajesz grupę towarzyszy (drużynę), rzuty kośćmi, mapy i zadania. Zobacz [Game Mode: pierwsze kroki](../game/getting-started.md).

## Widgety ekranu głównego

Widgety to małe karty, które możesz pokazywać, ukrywać i przesuwać.

1. Kliknij **Widgety** na ekranie głównym. Otworzy się okno **Home Widgets** (widgety ekranu głównego). Wymienia ono widgety w grupach **Built-in** (wbudowane), **Agents** (agenci) i **Personal** (osobiste).
2. Kliknij przycisk z ikoną oka obok widgetu, żeby go pokazać albo ukryć. Widget pokazany ponownie trafia na pierwsze wolne miejsce na ekranie głównym.
3. Żeby przesunąć widget, przeciągnij uchwyt w jego prawym górnym rogu. Na komputerze uchwyt pojawia się po najechaniu kursorem na widget.

Układ zapisuje się w tej przeglądarce. Osobiste widgety mają też przyciski edycji i usuwania. W klasycznym układzie sekcja **Wygląd przeglądarki** na dole okna ma jeden przełącznik: **Pokaż pasek adresu** pokazuje albo ukrywa pasek wyszukiwania ekranu głównego na komputerze.

Professor Mari może zrobić dla ciebie osobisty widget, jeśli ją o to poprosisz. Zainstalowani agenci też mogą dodawać widgety.

## Informacje: wbudowane widgety

| Widget | Co robi | Widoczny od początku |
| --- | --- | --- |
| **Professor Mari** | **Ask Professor Mari** (zapytaj Professor Mari) otwiera jej czat. | Tak |
| **Recent chats** (ostatnie czaty) | Twoje najnowsze czaty. Kliknij czat, żeby otworzyć go ponownie. Gdy nie ma czatów: **Your chats will show here**. | Tak |
| **Do wypróbowania** | Kolejne trzy drobne zadania do wypróbowania, każde dotyczące jednej funkcji. Po wypróbowaniu wszystkich albo wyłączeniu wskazówek pokazuje zamiast nich **Dokumentacja**, **Powtórz samouczek** i **Przeczytaj FAQ**. Zobacz [Do wypróbowania](#things-to-try). | Tak |
| **What's New** (co nowego) | **See what's new** (zobacz nowości) i **Read release notes** (przeczytaj informacje o wydaniu). | Tak |
| **Community** (społeczność) | Linki do **Discord**, **Support** i **Credits**. | Tak |
| **Character Library** (biblioteka postaci) | Codziennie nowy wybór twoich postaci. | Nie |
| **Discovery desk** (biurko odkryć) | Agenci, których nie masz zainstalowanych. **Browse agents** (przeglądanie agentów) otwiera katalog. | Nie |
| **Character of the Day** (postać dnia) | Jedna postać z twojej biblioteki, z przyciskami **Start a chat** (rozpoczęcie czatu) i **View character** (podgląd postaci). | Nie |
| **Clock & calendar** (zegar i kalendarz) | Dzisiejsza data i godzina. | Nie |
| **Achievements** | Twoje ostatnie i najbliższe osiągnięcia. Wymaga włączonego ustawienia Achievements. | Nie |

## Do wypróbowania

Widget **Do wypróbowania** podsuwa kolejne trzy funkcje do wypróbowania. Każde zadanie korzysta z poprzedniego: obraz z galerii staje się naklejką, a naklejka trafia do czatu.

- Kliknij zadanie, żeby otworzyć odpowiednie miejsce w aplikacji. Jeśli nie ma takiego miejsca, otwiera się przewodnik.
- Kliknij znak zaznaczenia, żeby oznaczyć zadanie jako ukończone, albo krzyżyk, żeby je pominąć. Pominięte zadanie nie pojawi się ponownie.
- Większość zadań zaznacza się sama, gdy Marinara rozpozna ich wykonanie, na przykład czat w danym trybie albo etykietę naklejki. Pozostałe zaznacz samodzielnie.
- **Zobacz wszystkie** pokazuje wszystkie zadania według ścieżek, z przyciskiem **Pokaż mi**. Zadania danej ścieżki pojawiają się po ukończeniu tych, na których się opierają. Ścieżki pod **Tylko w tym układzie** obejmują funkcje nowego układu.
- Ukończenie ścieżki odblokowuje jej osiągnięcie z kategorii **Odkrywca**.

Widget podlega ustawieniu **Wskazówki o funkcjach** w **Ustawienia > Ogólne > Potwierdzenia i pomoc**. Gdy wskazówki są wyłączone, pokazuje linki do przewodników. Postępy zapisują się w tej przeglądarce.

### Podstawy AI i Zajrzyj głębiej

Okno **Zobacz wszystkie** ma dwie dodatkowe zakładki:

- **Podstawy AI**: krótkie oprowadzenie dla osób, które dopiero poznają AI. Wyjaśnia, czym jest model, jakich rodzajów używa Marinara oraz czym są tokeny i kontekst. Pomaga też skonfigurować model, jeśli chcesz (możesz pominąć ten krok). Kończy się spotkaniem z Professor Mari. Propozycja pojawia się raz, w małym oknie po samouczku powitalnym. Zobacz [Podstawy AI](ai-basics.md).
- **Zajrzyj głębiej**: ustawienia, w których wybór nie jest oczywisty, i funkcje, które mało kto odkrywa, na przykład CSS w polu Notatki twórcy karty. Grupy, z których korzystasz najczęściej, są na początku listy.

Każdy temat otwiera przewodnik przy ważnym, podświetlonym fragmencie, a pod nim pokazuje kartę z prostym wyjaśnieniem. Kliknij **Rozumiem**, żeby oznaczyć temat jako ukończony; w oprowadzeniu Podstawy AI otwiera to następny przystanek. Po ukończeniu ścieżki Podstawy ostatni wiersz widgetu proponuje temat z sekcji Zajrzyj głębiej. Ukończenie oprowadzenia Podstawy AI lub grupy tematów z sekcji Zajrzyj głębiej odblokowuje osiągnięcie z kategorii **Odkrywca**, a ukończenie wszystkich tych tematów – jeszcze jedno. Okno z propozycją oprowadzenia również podlega ustawieniu **Wskazówki o funkcjach**.

## Gdzie szukać pomocy

- Zapytaj asystentkę Professor Mari na ekranie głównym.
- Otwórz **Zobacz wszystkie** w widgecie **Do wypróbowania**, a potem **Przeczytaj FAQ**, żeby znaleźć szybkie odpowiedzi.
- Kliknij **Docs** na górnym pasku, żeby przeczytać przewodniki w aplikacji.
- Kliknij **Discord** w widgecie **Społeczność**, żeby trafić do społeczności, albo **Wesprzyj**, żeby wesprzeć projekt.

Jeśli coś nie działa, zajrzyj do przewodnika [Rozwiązywanie problemów w aplikacji Marinara Engine](../TROUBLESHOOTING.md).

## Powiązane przewodniki

- [Instalacja aplikacji Marinara Engine](../INSTALLATION.md)
- [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md)
- [Tworzenie i edycja postaci](../characters/creating-and-editing-characters.md)
- [Samouczek przy pierwszym uruchomieniu](tutorial.md)
- [Zakładki, widok podzielony i niezapisane zmiany](tabs-and-drafts.md)
- [Professor Mari, twoja asystentka w aplikacji](professor-mari.md)
