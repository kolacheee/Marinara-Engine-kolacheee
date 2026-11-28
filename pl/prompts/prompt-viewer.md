# Przeglądarka promptów

Przeglądarka promptów zestawia preset, lorebooki, postacie i personę oraz pokazuje zbudowany prompt w kolejności wysyłania. Kliknij część, by edytować ją na miejscu. Zmiany zapisują się w rzeczywistym presecie, lorebooku, karcie lub personie i od razu pojawiają się w innych edytorach.

Zaczęła jako rozszerzenie AIO Prompt Viewer and Editor autorstwa kolache, a teraz jest częścią nowego układu.

<a id="opening-it"></a>
## Otwieranie

- **Komputer:** przycisk przeglądarki promptów (🥞) na górnym pasku, tuż za Search.
- **Telefon lub tablet:** dotknij licznika kart, aby otworzyć All Tabs, a potem przycisku przeglądarki (🥞) obok **+**.
- **Wszędzie:** otwórz Search i wpisz `prompt viewer`.

Otwiera się we własnej karcie. Zmiana karty zachowuje wybór i niezapisane zmiany; zamknięcie pyta o potwierdzenie, jeśli coś jest niezapisane.

<a id="the-three-columns"></a>
## Trzy kolumny

| Kolumna | Zastosowanie |
| --- | --- |
| **Sources** | Wybierz preset, lorebooki, postać (kilka dla grupy) i personę. Zaznacz wpisy lub foldery, aby włączyć je do promptu. **+** tworzy nowy element, ołówek otwiera jego ustawienia. |
| **Prompt** | Wybrane elementy w kolejności składania: sekcje presetu, wpisy na swoich pozycjach i głębokościach, postać i persona w znacznikach. **Validate** szuka niezamkniętych tagów XML i uszkodzonych `{{macros}}`. Przeciągaj sekcje, by zmienić kolejność presetu. |
| **Editor** | Pola klikniętego elementu. **Zapisz** zapisuje, **Przywróć** odrzuca zmiany. |

Na telefonie i pionowym tablecie kolumny przełącza **Sources / Prompt / Editor**; kliknięcie bloku otwiera Editor.

<a id="inspect-summaries-and-settings"></a>
## Inspect, Summaries i Settings

Przyciski u góry otwierają te widoki na stronie; **Wstecz** wraca do kolumn.

- **Zbadaj** pokazuje prompt wysyłany do modelu. Przy otwartym czacie **Include history** pobiera dokładny prompt z rozwiniętymi makrami i przyciętą historią; **Omit history** pokazuje strukturę z miejscem na czat. Skopiuj jako tekst lub listę wiadomości JSON.
- **Summaries** eksportuje wszystkie podsumowania czatów z biblioteki do Markdown lub JSON, także wyłączone wpisy. Żaden czat nie musi być otwarty.
- **Ustawienia** ustawia historię w Inspect, liczbę tur czatu bez połączenia, odznaki kolumny Prompt i kolory Inspect.

<a id="what-it-does-not-show"></a>
## Czego nie pokazuje

- Kolumna Prompt pomija agentów; Inspect ich uwzględnia, bo pyta Engine.
- Historia, podsumowania, przykłady dialogów i dane agentów są w Prompt symbolami zastępczymi: zawartość istnieje dopiero podczas działania czatu.
- Zachowanie grupy w turze (kto odpowiada, „Respond only as…”) jest opisane, ale nie składane, dopóki czat nie jest otwarty.
