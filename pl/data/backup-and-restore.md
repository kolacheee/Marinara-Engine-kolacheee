# Kopia zapasowa i przywracanie danych aplikacji Marinara

Zapisz kopię danych aplikacji Marinara Engine, aby móc je później przywrócić. Zrób to przed aktualizacją, zmianą urządzenia lub [wyczyszczeniem danych](clearing-data.md).

## Którą opcję wybrać

| Opcja | Co tworzy | Kiedy jej użyć |
| --- | --- | --- |
| **Download Backup** | Plik `.zip` ze wszystkimi danymi i plikami. | Gdy potrzebujesz jednej pełnej kopii. |
| **Export Profile** | Mniejszy plik z danymi konta (postaciami, czatami, lorebookami i innymi danymi). | Gdy potrzebujesz kopii bez sekretów lub plików dla innych narzędzi. |

Plik `.zip` mieści wiele plików. Obie opcje i przywracanie danych są w sekcji **Ustawienia → Dane → Kopie zapasowe i przywracanie**.

**Zanim zaczniesz:** na komputerze, na którym działa aplikacja Marinara Engine, te narzędzia działają od razu. Aby użyć ich z telefonu, tabletu lub innego urządzenia, ustaw sekret administratora na serwerze i wpisz tę samą wartość w **Ustawienia → Zaawansowane → Bezpieczeństwo**. Sekret administratora to hasło w pliku `.env` serwera, zapisane jako `ADMIN_SECRET`. Zobacz sekcję "Privileged APIs (ADMIN_SECRET)" w dokumencie [Konfiguracja serwera](../CONFIGURATION.md) oraz przewodnik [Dostęp zdalny](../REMOTE_ACCESS.md).

## Download Backup

1. Otwórz **Ustawienia → Dane**.
2. W sekcji **Kopie zapasowe i przywracanie** kliknij **Download Backup** (pobranie kopii zapasowej). Przycisk wyświetli **Creating backup…** (tworzenie kopii zapasowej).
3. Zapisz plik, gdy przeglądarka o to poprosi, albo znajdź go w folderze pobranych plików.

Plik `.zip` zawiera:

- zapisane dane tekstowe (postacie, czaty, lorebooki, presety, połączenia i ustawienia);
- przesłane i wygenerowane pliki, w tym awatary, sprite'y, tła, obrazy z galerii, czcionki, własne emoji i naklejki oraz własny dźwięk powiadomień;
- plik `.encryption-key`, jeśli istnieje;
- plik `RESTORE.txt` z instrukcją ręcznego przywracania danych (zobacz [Ręczne przywracanie](#restore-by-hand)).

Nazwy folderów znajdziesz w przewodniku [Gdzie Marinara przechowuje dane](where-data-is-stored.md).

> **Ostrzeżenie:** Kopia zapasowa zawiera zapisane klucze API oraz plik `.encryption-key`, który je odblokowuje. Nigdy jej nie udostępniaj. Przechowuj ją w prywatnym miejscu.

W systemie Android nie masz dostępu do folderu danych aplikacji. Użyj **Download Backup**, aby skopiować dane poza urządzenie.

Jeśli operacja się nie powiedzie: po komunikacie "Backup preparation timed out after one hour." spróbuj ponownie. Jeśli nie da się pobrać kopii z innego urządzenia, sprawdź sekret administratora (opis wyżej).

## Automatyczne kopie zapasowe

Marinara może regularnie tworzyć pełną kopię zapasową na komputerze, na którym działa.

1. Otwórz **Ustawienia → Dane → Kopie zapasowe i przywracanie**.
2. Włącz **Automatic backups** (automatyczne kopie zapasowe).
3. Wybierz **Daily** (codziennie), **Weekly** (co tydzień) lub **Monthly** (co miesiąc).
4. Ustaw **Automatic backups kept** (liczba zachowywanych kopii automatycznych) na wartość od 1 do 9999.

Marinara tworzy pierwszą kopię niedługo po włączeniu tej opcji. Po każdym wykonaniu zachowuje wskazaną liczbę najnowszych kopii i usuwa starsze kopie automatyczne. Nigdy nie usuwa kopii utworzonych przez **Download Backup**.

Automatyczne kopie leżą w folderze `backups/` wewnątrz folderu danych. Najnowsza ma nazwę `marinara-automatic-backup.zip`. Starsze mają w nazwie datę i godzinę. Ich format jest taki sam jak format kopii z **Download Backup**.

Każde wykonanie wymaga wolnego miejsca na jeszcze jedno pełne archiwum, ponieważ poprzednia kopia pozostaje na dysku aż do zakończenia nowej. Jeśli miejsca nie wystarcza, Marinara pomija wykonanie i wyświetla przyczynę obok ustawienia. Ponawia próbę po zwolnieniu miejsca.

> **Wskazówka:** Przechowuj drugą kopię poza folderem danych. Awaria dysku lub usunięcie danych aplikacji usuwa też automatyczne kopie zapasowe.

## Eksport profilu

1. Otwórz **Ustawienia → Dane → Kopie zapasowe i przywracanie**.
2. Kliknij **Export Profile** (eksport profilu). Otworzy się okno o tej samej nazwie.
3. Wybierz format.
4. Przeglądarka pobierze plik.

- **Marinara Native** (format natywny) zachowuje postacie, persony, czaty, lorebooki, presety, agentów, motywy, kod rozszerzeń Personal Extension i multimedia. Nie przywraca kluczy API, adresów webhooków ani niektórych ustawień czatu (zobacz [Ponowne wpisanie kluczy](#enter-your-keys-again)). Da się go przywrócić w aplikacji Marinara Engine.
- **Compatible JSON** (zgodny format JSON) tworzy plik `.zip` ze zwykłymi plikami postaci, person i lorebooków dla innych narzędzi. Nie da się go przywrócić w aplikacji Marinara Engine.

Profil natywny pobiera się jako `marinara-profile.json`. Jeśli jest za duży, Marinara proponuje zamiast niego plik ZIP. Kliknij **Export ZIP** (eksport ZIP), aby pobrać `marinara-profile.zip`.

Profil natywny zachowuje skrypty regex, ich foldery i ustawienie wstrzymania każdego folderu. Udostępnianie pojedynczych skryptów jako JSON opisuje przewodnik [Skrypty regex](../extending/regex-scripts.md#import-and-replace-scripts).

Profil natywny zachowuje kod Personal Extension, lecz nie zachowuje informacji o włączeniu ani zatwierdzeniu rozszerzenia. Każde przywrócone rozszerzenie jest wyłączone. Przejrzyj je ponownie w **Biblioteka → Rozszerzenia**.

## Przywracanie przez Import Profile

**Import Profile** (import profilu) wczytuje plik profilu lub plik `.zip` utworzony przez **Download Backup**.

1. Otwórz **Ustawienia → Dane → Kopie zapasowe i przywracanie**.
2. Pod przyciskiem pozostaw zaznaczone **Oznacz jako zaimportowane** i **Tag źródła**, aby dodawać tagi **Zaimportowane** i **Backup** do importowanych postaci, person, lorebooków, presetów i czatów. Odznacz je, żeby przywrócić wszystko dokładnie tak, jak było.
3. Kliknij **Importuj profil (JSON/ZIP)**.
4. Wybierz `marinara-profile.json`, `marinara-profile.zip` albo plik `.zip` z kopią zapasową. Przycisk wyświetli **Scanning Profile...** (sprawdzanie profilu).
5. Przeczytaj treść okna **Importuj profil**. Pokazuje dane znalezione przez aplikację Marinara. Elementy już obecne w aplikacji Marinara są zastępowane wersjami z pliku, chyba że wybierzesz [dodawanie tylko brakujących elementów](#only-add-whats-missing).
6. Kliknij **Importuj**, albo **Anuluj**, aby przerwać. Przycisk wyświetli **Importowanie profilu...**. Marinara najpierw zapisuje kopię zabezpieczającą twoich danych, a potem pojawia się pasek postępu. Po zakończeniu zobaczysz potwierdzenie importu.

Jeśli operacja się nie powiedzie:

- Poza adresami `localhost`, `127.0.0.1` i `[::1]` import profilu wymaga HTTPS. Komunikat błędu brzmi "Profile import requires HTTPS outside local development." Otwórz aplikację Marinara Engine przez adres HTTPS.
- Jeśli w pliku `.zip` brakuje części multimediów, import i tak się kończy. Ostrzeżenie zawiera listę brakujących plików, a Marinara importuje pozostałe dane.
- Jeśli na dysku brakuje miejsca na kopię zabezpieczającą, nic nie jest importowane. Komunikat błędu zaczyna się od "Nothing was imported, because a safety copy could not be saved first." Zwolnij mniej więcej tyle miejsca, ile zajmuje pełna kopia zapasowa, i ponów import.

Jeśli zaimportujesz ten sam profil dwukrotnie, Marinara zaktualizuje istniejące elementy zamiast je powielać. Profile z dużo starszych wersji mogą jednak utworzyć duplikaty.

### Dodawanie tylko brakujących elementów

Żeby odzyskać coś usuniętego bez utraty późniejszych zmian, włącz **Keep my current versions, only add what's missing** (zachowaj moje bieżące wersje, dodaj tylko brakujące elementy) nad przyciskiem **Importuj profil (JSON/ZIP)**, a potem wykonaj import jak powyżej. Każdy element i plik już obecny w aplikacji Marinara pozostaje bez zmian, a dodawane jest tylko to, czego w niej brakuje. Obejmuje to wszystko, co usunięto od zapisania pliku, na przykład pojedyncze wiadomości lub wpisy lorebooków, a nie tylko element, który chcesz odzyskać. Pamięć długoterminowa liczy się jako jeden element: jeśli Marinara już jakąś ma, pamięć z pliku nie jest dodawana.

Nic nie jest zastępowane, więc Marinara nie zapisuje kopii zabezpieczającej, a **Undo Last Import** (cofnięcie ostatniego importu) nadal cofa import poprzedzający ten.

Profile z dużo starszych wersji nie obsługują tej opcji: zawsze dodają swoje elementy obok twoich, o czym informuje okno **Importuj profil**.

### Cofanie importu

Przed każdym importem zastępującym elementy Marinara zapisuje pełną kopię twoich danych w folderze `backups/` w folderze danych, w pliku, którego nazwa zaczyna się od `marinara-before-import-`, po czym następuje data i godzina. Po zakończeniu importu kopia z poprzedniego importu jest usuwana, więc zostaje tylko najnowsza.

1. Otwórz **Ustawienia → Dane → Kopie zapasowe i przywracanie**.
2. Kliknij **Undo Last Import**. Wiersz pod przyciskiem pokazuje, kiedy zapisano kopię zabezpieczającą.
3. Kliknij **Undo Last Import** w oknie, aby potwierdzić.

Cofnięcie przywraca twoje wersje elementów i plików zastąpionych przez ostatni import. Jeśli po imporcie zmienisz któryś z tych elementów, ta zmiana zostanie utracona. Wszystko inne pozostaje bez zmian, w tym elementy dodane przez import. Import można cofnąć raz, po czym kopia zabezpieczająca jest usuwana.

Cofnięcie nie włącza ponownie tego, co import wyłączył ze względów bezpieczeństwa. Włącz ręcznie ponownie:

- swój aktywny motyw;
- rozszerzenia osobiste (przejrzyj je ponownie w **Ustawienia → Dodatki**);
- własne narzędzia uruchamiające skrypt lub webhook;
- wspomnienia asystentki Professor Mari.

Jeśli import wyczyścił klucz API połączenia, wpisz go ponownie (zobacz [Ponowne wpisanie kluczy](#enter-your-keys-again)). Ustaw to połączenie ponownie jako domyślne lub zapasowe, jeśli wcześniej nim było.

Gałęzie czatów zastąpione przez import pozostają odłączone od czatu, z którego powstały. Import już usunął to powiązanie i cofnięcie nie może go przywrócić.

Profile z dużo starszych wersji tylko dodają elementy, więc Marinara nie zapisuje dla nich kopii zabezpieczającej i nie ma czego cofnąć.

Kopia zabezpieczająca zajmuje tyle samo miejsca co pełna kopia zapasowa. Żeby zwolnić to miejsce bez cofania importu, kliknij **Delete Safety Copy** (usunięcie kopii zabezpieczającej) w **Ustawienia → Dane → Kopie zapasowe i przywracanie**, a potem potwierdź. Twoje dane pozostaną bez zmian, ale nie będzie już można cofnąć tego importu. Jeśli import został przerwany, przycisk **Delete Safety Copy** może pojawić się sam; takiej kopii nie można użyć do cofnięcia importu, ale nadal można ją usunąć.

## Ponowne wpisanie kluczy

**Import Profile** nigdy nie przywraca kluczy API ani adresów webhooków, nawet z pliku `.zip` utworzonego przez **Download Backup**. Klucz API to tajny kod otrzymany od usługi. Te wartości są wyczyszczone w pliku profilu oraz w profilu wewnątrz kopii zapasowej. Po imporcie na nowym komputerze wpisz je ponownie:

1. Otwórz **Biblioteka → Połączenia**.
2. Otwórz każde używane konto, wpisz klucz API i zapisz. Zobacz [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md).
3. Wpisz ponownie adres webhooka w każdym własnym narzędziu, które go używa.

Niektóre ustawienia czatu z adresami lub kluczami (Discord, DeepL, Intiface) też są puste po imporcie. Wpisz je ponownie w **Chat Settings** (ustawienia czatu) każdego czatu.

Import nigdy nie usuwa kluczy już zapisanych w tej samej instalacji.

## Przeniesienie danych na nowy komputer

1. Zainstaluj aplikację Marinara Engine na nowym komputerze i uruchom ją. Zobacz [Instalacja](../INSTALLATION.md).
2. Otwórz **Ustawienia → Dane → Kopie zapasowe i przywracanie** i kliknij **Import Profile (JSON/ZIP)**.
3. Wybierz plik `.zip` utworzony przez **Download Backup** albo plik profilu, a następnie kliknij **Import**.
4. Wpisz ponownie klucze API zgodnie z opisem wyżej.

Plik klucza z kopii zapasowej pomaga tylko wtedy, gdy ręcznie kopiujesz cały folder danych, jak opisano niżej.

## Ręczne przywracanie

Użyj tej metody tylko wtedy, gdy nie da się użyć **Import Profile**. W pliku `.zip` znajduje się folder, na przykład `marinara-backup-...`, z instrukcją `RESTORE.txt`.

1. Zatrzymaj aplikację Marinara Engine.
2. Rozpakuj kopię zapasową.
3. Skopiuj foldery oraz plik `.encryption-key` z rozpakowanego folderu do folderu danych. Zobacz [Gdzie Marinara przechowuje dane](where-data-is-stored.md).
4. Uruchom aplikację Marinara Engine.

Trzymaj plik `.encryption-key` razem z folderem `storage`, inaczej nie da się odczytać zapisanych kluczy API.

Lista **Existing backups** (istniejące kopie zapasowe) w sekcji **Kopie zapasowe i przywracanie** zwykle jest pusta. Nie musisz jej używać.

## Powiązane przewodniki

- [Gdzie Marinara przechowuje dane](where-data-is-stored.md)
- [Czyszczenie i resetowanie danych](clearing-data.md)
- [Aktualizacja aplikacji Marinara Engine](../UPGRADING.md)
- [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md)
- [Dostęp zdalny: logowanie i lista dozwolonych adresów IP](../REMOTE_ACCESS.md)
