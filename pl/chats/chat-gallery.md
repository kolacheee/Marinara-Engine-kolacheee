# Galeria czatu

**Galeria** zawiera obrazy i wideo czatu: ilustracje, selfie, malowane tła, klatki scenorysu i wszystko, co prześlesz. Jest sekcją panelu **Ustawienia czatu**. Na komputerze możesz wydzielić ją do osobnego okna (zobacz [Przegląd ustawień czatu](chat-settings.md#popping-a-section-out-into-its-own-window)).

Galeria czatu należy do tego czatu. Obrazy, które chcesz zachować dla postaci niezależnie od tego, w którym czacie bierze udział, umieść w jej własnej galerii. Zobacz [Galerie postaci i person](../characters/galleries.md).

## Obrazy i wideo

**Galeria** ma dwie zakładki: **Obrazy** i **Wideo**. Każda pokazuje liczbę zawartych w niej elementów. Zakładka **Wideo** zawiera wideo scen w czatach w trybach Roleplay i Game Mode oraz wiadomości wideo w czatach w trybie Conversation.

Na górze sekcji przyciski działań pojawiają się tylko wtedy, gdy dana funkcja jest dostępna w czacie:

- **Ilustruj**: uruchamia agenta Illustrator, aby jednorazowo wygenerować obraz sceny. Zobacz [Agent Illustrator](../media/illustrator-agent.md).
- **Selfie**: generuje selfie postaci w trybie Conversation.
- **Tło**: maluje i ustawia tło bieżącej sceny. Zobacz [Tła tworzone przez agenta Illustrator](../media/scene-backgrounds.md#paint-a-background-now).
- **Wideo**: tworzy wideo sceny na podstawie najnowszej ilustracji. W trybie Conversation zamiast tego wysyła wiadomość wideo od postaci; zobacz [Wiadomości wideo](../conversation/selfies.md#video-messages).
- **Utwórz scenorys**: generuje klatki kluczowe ostatniej tury w trybie Game Mode lub zakończonego epizodu w trybie Roleplay, gdy agent Storyboard jest aktywny.
- **Przeglądaj obrazy**: otwiera przeglądarkę zapisanych obrazów do wstawienia.
- **Zobacz scenorys**: otwiera najnowszy scenorys z trybu Game Mode.

Pod przyciskami znajduje się obszar **Prześlij obrazy**. Przeciągnij na niego obrazy, aby dodać własne do galerii tego czatu.

### Działania na pojedynczym obrazie

Najedź wskaźnikiem na obraz w zakładce **Obrazy** lub dotknij go na urządzeniu mobilnym, aby zobaczyć dostępne działania:

- Otwórz obraz w pełnym rozmiarze (**Otwórz obraz z galerii**).
- **Przypnij do czatu**: przypina obraz do czatu jako swobodnie umieszczany obrazek. Przeciągnij go, aby go przenieść, i użyj uchwytu w rogu, aby zmienić jego rozmiar. Zachowuje położenie i rozmiar po ponownym wczytaniu strony w tej przeglądarce. Przycisk kłódki obok przycisku zamykania blokuje przesuwanie i zmianę rozmiaru, dopóki go nie odblokujesz.
- **Pobierz obraz**: zapisuje obraz na twoim urządzeniu.
- **Animuj ilustrację**: zamienia ten obraz w wideo sceny.
- **Kopiuj prompt**: kopiuje zapisany prompt obrazu. Jeśli obraz nie ma zapisanego promptu, przycisk pokazuje **Nie zapisano promptu** i jest wyłączony.
- Przycisk oznaczania w lewym górnym rogu obrazu: **Użyj jako tła** oznacza go jako tło i pyta, jakie miejsca przedstawia, na przykład `John's bedroom`.
- **Dodaj do galerii postaci lub persony** (przycisk z sylwetką osoby): zachowuje obraz we własnej galerii tej postaci lub persony, dzięki czemu pozostaje on dostępny także po usunięciu tego czatu. Oznaczenie tła i miejsca są przenoszone razem z nim, a obraz towarzyszy potem tej postaci w każdym czacie. Zobacz [Tła towarzyszące postaci](../roleplay/backgrounds.md#backgrounds-that-follow-a-character).
- **Usuń obraz z galerii**: usuwa obraz po potwierdzeniu.

### Ponowne generowanie obrazu

Możesz ponownie wygenerować obraz bez ponownego generowania odpowiedzi, do której należy. Działa to dla obrazów w galerii czatu, które mają zapisany prompt, takich jak ilustracje, selfie i klatki scenorysu.

1. Otwórz obraz w pełnym rozmiarze z galerii lub z wiadomości, w której się znajduje.
2. Kliknij **Wygeneruj obraz ponownie** (przycisk z okrężną strzałką w prawym górnym rogu obrazu).
3. Wprowadź wybrane zmiany pod obrazem: w polach **Prompt** i **Prompt negatywny**, w polach poszczególnych postaci w sekcji **Prompty postaci**, jeśli obraz je miał, oraz w wyborze modelu obrazów.
4. Kliknij **Wygeneruj obraz** lub **Anuluj**, aby pozostawić obraz bez zmian.

Nowy obraz staje się wybraną wersją wiadomości. Starsze wyniki pozostają w jednym kafelku Gallery z licznikiem wersji. Każda wersja zachowuje prompt, negatywny prompt i zapisane dane generowania. Wysyłane są obecne awatary, potem obrazy wpisów lorebooka użyte pierwotnie. Stability AI, Arli AI, SD Web UI i Draw Things nie dostają obrazów wpisów. Brak dawnych promptów negatywnych lub postaci sygnalizuje edytor.

<a id="image-versions"></a>
### Wersje obrazu

Otwórz stos, aby wybrać wersję. W Gallery strzałki lewo/prawo, klawisze i poziome gesty zmieniają kafelki. Otwarcie z wiadomości pozostaje w tym stosie. Kontrolki góra/dół, klawisze i pionowe gesty na obrazie zmieniają wersje. Najpierw oddal obraz. Przewijanie promptu nie zmienia wersji.

Kliknij obraz, nagłówek promptu lub zwijanie, by używać Góra/Dół do wersji. Kliknij tekst lub kopiowanie, by przewijać. Kontrolki pozostają widoczne przy regeneracji i edycji. Przed zmianą zastosuj lub usuń maskę; podczas generowania kontrolki są wstrzymane.

Wybór zapisuje się i jest widoczny po odświeżeniu. Regeneracja lub edycja starszej wersji dodaje wynik do tego samego stosu i zachowuje późniejsze wersje. Rozgałęziony czat ma własny wybór.

Z **Automatycznie zapisuj wygenerowane obrazy w galeriach postaci** regeneracje i edycje zachowują galerie docelowe postaci i persony z oryginału. Tam też grupują wersje. Każda galeria zapisuje własny wybór niezależnie od czatu. Wpisy współdzielą pliki bez dodatkowych kopii. Otwarcie galerii przywraca brakujące wersje dawnych stosów, jeśli oryginalny wpis nadal wskazuje czat źródłowy. Wersje usunięte z już zgrupowanej galerii pozostają usunięte.

W Gallery czatu użyj **Usuń obraz z galerii** na kafelku lub usuwania w przeglądarce:

- **Delete this version** usuwa pokazaną wersję. Jeśli była wybrana, pokazuje najnowszą pozostałą.
- **Delete other versions** zachowuje pokazaną, usuwając resztę.
- **Delete entire stack** usuwa wszystkie wersje i załączniki obrazów z czatu.

To trwałe usunięcie. **Anuluj** zachowuje wszystko.

## Powiązane poradniki

- [Agent Illustrator](../media/illustrator-agent.md): ilustracje scen i klipy.
- [Tła tworzone przez agenta Illustrator](../media/scene-backgrounds.md): przycisk **Tło**, warianty pogodowe i szablony okien.
- [Galerie postaci i person](../characters/galleries.md)
- [Generowanie wideo scen](../media/scene-video.md): zamień obraz z galerii w wideo.
