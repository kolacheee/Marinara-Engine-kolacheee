# Pogoda w twoim motywie

Gdy w historii pojawia się pogoda, Marinara rysuje ją nad czatem: deszcz, śnieg, mgłę, spadające liście, płatki kwiatów, gwiazdy, słońce lub księżyc. Twój motyw może nadać im własny wygląd. Możesz zmienić kolor deszczu, sprawić, żeby śnieg padał jako pikselowe kwadraty, zastąpić liście własnymi rysunkami albo zmienić tło na szare, gdy pada deszcz.

Ten poradnik przeprowadzi cię przez to krok po kroku. Najpierw potrzebujesz własnego motywu. Jeśli jeszcze go nie masz, [Poradnik autora motywów](theme-author-guide.md) pokazuje, jak zrobić go w kilka minut. Znajdująca się tam sekcja [Pogoda](theme-author-guide.md#weather) to skrócona wersja tej strony.

## Jak działa pogoda

Pogoda pochodzi z historii. W czacie w trybie Roleplay lub Game Mode agent **Stan świata** śledzi pogodę i porę dnia, na przykład "heavy rain" i "night". Marinara odczytuje te słowa i wybiera, co narysować: smugi deszczu dla "rain", płatki śniegu dla "snow", gwiazdy i księżyc dla "night" i tak dalej.

Rysowaniem zawsze zajmuje się sama aplikacja. Twój motyw niczego nie rysuje. Ustawia kilka tokenów `--mari-weather-` (nazwanych ustawień, takich jak `--primary`), a aplikacja odczytuje je i rysuje pogodę po twojemu. Dzięki temu motywy są bezpieczne: nic w motywie nie może uruchamiać kodu, a własne ustawienia użytkownika, takie jak ograniczenie ruchu, zawsze mają pierwszeństwo.

### W pomieszczeniach pogoda zostaje na zewnątrz

Gdy akcja historii toczy się wewnątrz, na przykład w gospodzie, sypialni lub pomieszczeniu na mapie świata, aplikacja nie rysuje deszczu na całym ekranie. Zachowuje tylko zabarwienie pogody i błysk pioruna, a pomieszczenie pozostaje suche. Aplikacja rozpoznaje wnętrze na podstawie lokalizacji w stanie świata ("Tideglass Inn, Brinewatch") lub typu miejsca na mapach świata. Jeśli nie potrafi tego ustalić, pogoda jest rysowana jak zwykle. Gdy opcja **Weather Versions of Backgrounds** jest włączona (zobacz [Wersje pogodowe teł](../media/scene-backgrounds.md#weather-versions-of-backgrounds)), sam obraz tła pokazuje deszcz na oknach, a animowana pogoda wraca, rysowana tylko na szybach. Wygląd pogody z twojego motywu obowiązuje również tam.

### Pogoda bez motywu

Tak wygląda deszczowa noc bez motywu: cienkie, jasne smugi na ciemnoniebieskiej poświacie. Obrazy poniżej pokazują ten sam czat z trzema motywami startowymi.

## Podgląd pogody podczas pracy

Nie musisz czekać, aż w historii zacznie padać. Możesz samodzielnie ustawić pogodę.

1. Otwórz **Biblioteka → Ustawienia → Wygląd** i sprawdź, czy opcja **Dynamiczne efekty pogody (deszcz, śnieg, mgła itd.)** jest włączona (w sekcji **Efekty**), a **Ogranicz animacje i efekty otoczenia** – wyłączona.
2. Otwórz czat w trybie Roleplay, następnie **Ustawienia czatu → Agenci** i włącz agenta **Stan świata**.
3. Otwórz tracker **Stan świata**. Na komputerze znajdziesz go w panelu trackerów. Na telefonie dotknij przycisku **Stan świata**.
4. Kliknij wartość **Pogoda** i wpisz słowo określające pogodę, na przykład `heavy rain`. Kliknij **Czas** i wpisz `night`.
5. Pogoda pojawi się od razu. Czat ma teraz własną kartę na górnym pasku.

Podczas pracy nad motywem Ustawienia zajmują środek okna, a pogoda w tle jest wstrzymana. Zapisz motyw, a następnie kliknij kartę czatu na górnym pasku, żeby zobaczyć wynik. Żeby wypróbować inną pogodę, zmień słowa z kroku 4. Tabela w sekcji **Które słowa wywołują jaką pogodę** poniżej zawiera je wszystkie.

> **Wskazówka:** Zablokuj wartość Pogoda (tryb blokady w trackerze), żeby AI nie zmieniała jej podczas testów. Zobacz [Pasek HUD i trackery w trybie Roleplay](../roleplay/hud-and-trackers.md).

## Pierwszy własny wygląd pogody krok po kroku

Nadajmy deszczowi kolor i wydłużmy smugi, tak jak w motywie startowym NEON//GRID.

1. Otwórz **Biblioteka → Ustawienia → Wygląd → Motywy CSS** i kliknij **Edytuj CSS motywu** (ikonę kodu) przy swoim motywie.
2. Znajdź wiersz `:root {` blisko początku swojego kodu CSS. Jeśli motyw go nie ma, dodaj `:root {` w nowym wierszu i `}` w następnym.
3. Dodaj w środku te wiersze, przed `}`:

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. Kliknij **Zapisz**. Jeśli Marinara zapyta **Zachować ten motyw?**, kliknij **Zachowaj motyw**.
5. Kliknij kartę czatu testowego na górnym pasku. Deszcz jest teraz cyjanowy, smugi są około dwa razy dłuższe i bardziej widoczne.

Co robi każdy wiersz:

- `--mari-weather-rain-color` to kolor kropel deszczu. Możesz użyć dowolnego koloru: kodu szesnastkowego, takiego jak `#3ff0ff`, nazwy, takiej jak `skyblue`, lub `rgb(63 240 255)`.
- `--mari-weather-rain-length` wydłuża lub skraca smugi. `1` to zwykła długość, a `2.2` – nieco ponad dwukrotnie większa.
- `--mari-weather-strength` sprawia, że każda cząsteczka jest bardziej (powyżej `1`) lub mniej (poniżej `1`) widoczna.

### Efekt

To ta sama deszczowa noc w motywie NEON//GRID, który używa tych trzech wierszy i kilku innych.

### Dobór kolorów na dzień i noc

Kolory, które wyglądają dobrze na ciemnym tle, mogą znikać na jasnym. Umieść kolory dzienne w bloku `[data-theme="light"]`, a nocne w bloku `[data-theme="dark"]`, tak samo jak ustawiasz każdy inny kolor:

```css
:root[data-theme="light"] {
  --mari-weather-rain-color: #1aa7c4;
  --mari-weather-snow-color: #22b8d6;
}
:root[data-theme="dark"] {
  --mari-weather-rain-color: #3ff0ff;
  --mari-weather-snow-color: #7af7ff;
}
```

## Które słowa wywołują jaką pogodę

Każdy rodzaj pogody ma krótką nazwę. Używasz jej w tokenie, na przykład `snow` w `--mari-weather-snow-color`.

| Gdy w historii pojawia się | Aplikacja rysuje | Nazwa w tokenach |
| ----------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| rain, downpour | Smugi deszczu | `rain` |
| storm, thunder, lightning | Ulewę z błyskami piorunów | `rain` (błysk: `lightning-color`, pioruny: `lightning-bolt`) |
| snow, sleet, blizzard, frost, cold | Płatki śniegu | `snow` |
| hail | Grad | `hail` |
| fog, mist, haze | Łagodne pasma mgły nisko na ekranie nad mgłą przy ziemi | `fog` |
| sand, dust storm | Niesiony wiatrem piasek | `sand` |
| ash, smoke, volcanic | Opadający popiół | `ash` |
| fire, embers, inferno | Unoszące się żarzące drobiny | `ember` |
| wind, breeze, gusts | Spadające liście | `leaf` |
| cherry blossom, petals | Opadające płatki kwiatów | `petal` |
| aurora, northern lights | Wstęgi zorzy polarnej | `aurora` |
| clear, sunny, cloudy, cokolwiek innego | Kilka unoszących się drobinek | `dust` |
| night (pora dnia) | Gwiazdy i świetliki | `star`, `firefly` |
| dusk, evening (pora dnia) | Świetliki | `firefly` |
| morning, day, dusk (bezchmurne niebo) | Słońce | `sun` |
| night (bezchmurne niebo) | Księżyc | `moon` |

Gwiazdy nie pojawiają się w mgliste i śnieżne noce, a świetliki unikają deszczu. Słońce i księżyc pojawiają się tylko przy bezchmurnym niebie.

## Zmiana koloru, rozmiaru i kształtu

Każdy rodzaj z tabeli obsługuje te same trzy ustawienia. Umieść nazwę rodzaju w środku tokenu.

| Token | Co robi | Wartości |
| --------------------------- | ---------------------------- | ---------------------------------------------------------- |
| `--mari-weather-snow-color` | Kolor | Zwykły kolor: `#fff0f7`, `white`, `rgb(...)`, `hsl(...)` |
| `--mari-weather-snow-size` | Rozmiar każdej cząsteczki | Od `0.5` (połowa) do `3` (trzykrotność) |
| `--mari-weather-snow-shape` | Okrągłe kropki lub małe kwadraty | `round` lub `square` |

Zastąp `snow` dowolną inną nazwą z tabeli, na przykład `--mari-weather-ember-color` lub `--mari-weather-leaf-shape`.

Przykład: "śnieg danych" w motywie komputerowym, z małymi cyjanowymi kwadratami zamiast płatków.

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

Kształty nie dotyczą deszczu, mgły ani zorzy, które zachowują własną formę. W przypadku mgły `--mari-weather-fog-color` zabarwia zarówno przesuwające się pasma, jak i mgłę przy ziemi, a `--mari-weather-tint-strength` rozrzedza lub zagęszcza mgłę.

## Używanie własnych obrazów

Zamiast kropek i smug każdy rodzaj może przybrać postać twoich obrazów: liści klonu, płatków sakury, papierowych gwiazd, małych pikselowych śnieżynek.

1. Narysuj lub znajdź małe obrazy z przezroczystym tłem, na przykład pliki PNG. Używaj małych obrazów: liść o szerokości od 24 do 64 pikseli w zupełności wystarczy. Większe obrazy są zmniejszane do 160 pikseli na dłuższym boku.
2. W edytorze motywu otwórz **Obrazy i dane udostępniania (autor, wersja, miniatura, czcionki)** i kliknij **Dodaj obrazy**. Dodaj do czterech obrazów dla jednego rodzaju.
3. W kodzie CSS wymień je w tokenie `-image` danego rodzaju, oddzielając je spacjami:

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. Zapisz, otwórz czat testowy i ustaw w nim pogodę na `windy`. Twoje liście opadają teraz powoli, a każdy z nich używa jednego z twoich obrazów.

Wskazówki dotyczące obrazów:

- Kliknij nazwę obrazu w sekcji **Obrazy i dane udostępniania (autor, wersja, miniatura, czcionki)**, żeby wstawić jego `url("theme:...")` do kodu CSS w miejscu kursora. Dzięki temu nie musisz wpisywać nazwy.
- Obraz zachowuje nazwę dodanego pliku wraz z rozszerzeniem, na przykład `leaf-1.png`. Używaj nazwy dokładnie takiej, jak na liście.
- Obraz jest rysowany we własnych kolorach, więc token `-color` nic nie zmienia dla tego rodzaju.
- Użyj `-size`, żeby powiększyć lub pomniejszyć wszystkie obrazy. Styl płynny dodatkowo nieco różnicuje ich rozmiary, żeby nie wyglądały identycznie.
- Liście, płatki kwiatów i popiół delikatnie obracają się podczas opadania w stylu płynnym. Pozostałe rodzaje zachowują pionową orientację.
- Obrazy muszą znajdować się w twoim motywie. Odnośnik do obrazu w innej witrynie jest ignorowany.

Motyw startowy Lantern Path używa w ten sposób czterech malowanych liści.

## Styl pikselowy

Styl pikselowy umieszcza całą warstwę pogody na siatce dużych kwadratowych pikseli, żeby pasowała do motywów w stylu pixel art. Krople deszczu, płatki śniegu i gwiazdy stają się wyraźnymi małymi bloczkami.

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel` włącza styl pikselowy. `smooth` (lub pominięcie tego ustawienia) daje zwykły wygląd.
- `--mari-weather-pixel-size` określa rozmiar każdego bloczka, od `2px` do `6px`. `3px` to dobry punkt wyjścia.
- W stylu pikselowym twoje obrazy są rysowane we własnym rozmiarze pomnożonym przez `-size`. Rysuj grafikę w skali 1 piksel pliku na 1 piksel rysunku i ustaw `-size` na tę samą liczbę co rozmiar piksela, żeby piksele grafiki pokrywały się z pikselami pogody. Petal OS rysuje 11-pikselowe płatki w rozmiarze `3`.
- W stylu pikselowym obrazy nie obracają się podczas opadania i są rysowane jako nieprzezroczyste (pojawiają się i znikają w trzech wyraźnych krokach), dzięki czemu grafika pikselowa pozostaje ostra.

### Przykład: Petal OS

To motyw startowy Petal OS podczas nocy z opadającymi kwiatami. Płatki to jego własne 11-pikselowe rysunki, a gwiazdy znajdują się na tej samej siatce 3 px.

## Słońce i księżyc

Słońce i księżyc przyjmują kolor, rozmiar i jeden obraz, tak jak każdy inny rodzaj:

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

Jeśli na twoim tle jest już namalowany księżyc, wyłącz księżyc aplikacji, żeby nie było dwóch:

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none` robi to samo ze słońcem.

## Wyciszanie lub wzmacnianie efektów

Te ustawienia zmieniają całą warstwę pogody naraz:

| Token | Co robi | Wartości |
| -------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--mari-weather-amount` | Liczba opadających cząsteczek | Od `0.25` (ćwierć) do `1` (normalna liczba). Motyw może zmniejszać liczbę cząsteczek pogody, ale nigdy jej zwiększać. |
| `--mari-weather-speed` | Szybkość opadania | Od `0.5` (połowa prędkości) do `1.5` |
| `--mari-weather-strength` | Widoczność cząsteczek | Od `0.5` (blade) do `1.5` (wyraziste) |
| `--mari-weather-tint-strength` | Kolorowa poświata nad czatem (niebieska podczas deszczu, ciemna w nocy) | Od `0` (brak) do `1` (normalna) |
| `--mari-weather-lightning-color` | Kolor błysku pioruna | Zwykły kolor. Błyski pozostają łagodne i powolne, więc są bezpieczne dla osób wrażliwych na migające światło. |
| `--mari-weather-lightning-bolt` | Rysuje rozgałęziony piorun przy każdym błysku, w kolorze błyskawicy | `on` lub szerokość od `0.5` do `3`. `none` (domyślnie) pozostawia sam błysk. |

W spokojnym motywie do czytania wypróbuj `--mari-weather-amount: 0.5;` i `--mari-weather-tint-strength: 0.3;`.

### Pioruny

Domyślnie burza tylko rozświetla ekran. Dodaj `--mari-weather-lightning-bolt`, żeby przy każdym błysku rysować prawdziwy rozgałęziony piorun:

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

Piorun biegnie w dół wzdłuż lewej lub prawej krawędzi ekranu, nigdy przez środek, gdzie znajduje się tekst czatu. Rozdziela się na kilka odnóg i świeci w wybranym kolorze błyskawicy. Pojawia się tylko podczas błysku aplikacji i zanika razem z nim, więc motyw nie może dodawać błysków ani zwiększać ich częstotliwości. W stylu pikselowym piorun jest rysowany z bloczków na siatce pikseli. Większość motywów startowych używa piorunów: Apogee Lounge, Crepuscular, Dewglass, Gutterlight, MARI to the Moon, Sanguine Keep, Under Sail i Velvet Casket. Granite Watch i Quiet Iris je wyłączają, ponieważ przedstawiają wnętrza.

## Dostosowanie tła do pogody

Własna grafika twojego motywu też może zmieniać się wraz z pogodą. Gdy czat wyświetla pogodę, Marinara dodaje do strony dwa słowa, które twój kod CSS może sprawdzać:

- `data-mari-weather` to jedno z: `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom` lub `aurora`.
- `data-mari-sky` to jedno z: `dawn`, `day`, `dusk` lub `night`.

Zawsze są to słowa z powyższych list, nigdy tekst z samej historii. Znikają, gdy czat nie ma pogody lub użytkownik ją wyłączy.

### Przykład: Lantern Path w deszczu

Lantern Path zastępuje słoneczny las szarym, pochmurnym, gdy pada deszcz. Po lewej: pogodny poranek. Po prawej: ten sam czat w deszczu.

### Zmiana tła

Żeby zrobić to samo, dodaj blok, który obowiązuje tylko podczas deszczu lub burzy, i przypisz mu drugi obraz tła:

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

Jak to czytać: `:root[data-mari-weather="rain"]` oznacza "tylko gdy pada deszcz". Przecinek oznacza "lub".

- Jeśli twój motyw ustawia `--mari-app-backdrop-layers` zamiast `--mari-app-backdrop`, zmień też `--mari-app-backdrop-layers` w bloku pogody, ponieważ ma pierwszeństwo przed pojedynczym obrazem.
- Żeby uwzględnić również dzień i noc, dodaj schemat: `:root[data-theme="dark"][data-mari-weather="rain"]` oznacza "deszczową noc w trybie ciemnym".
- `data-mari-sky` działa tak samo, na przykład `:root[data-mari-sky="dusk"]` dla wersji grafiki o zachodzie słońca.

### Nie dubluj pogody

Jeśli twój motyw ma własną dekoracyjną nakładkę ze spadającymi liśćmi lub deszczem (`--mari-ambient`), może ona nałożyć się na pogodę z historii. Wyłącz ją, gdy pojawiają się prawdziwe opady:

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

To znaczy: "gdy jest pogoda i nie jest bezchmurnie ani pochmurno, ukryj dekoracyjną nakładkę".

Twoja własna nakładka ze spadającymi liśćmi lub deszczem też może pozostać na zewnątrz. `data-mari-shelter` ma wartość `indoors` lub `outdoors`, gdy pogoda jest wyświetlana (i nie występuje, gdy aplikacja nie potrafi tego ustalić):

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## Co pozostaje wyborem użytkownika

Twój motyw zmienia wygląd pogody, ale nigdy nie decyduje o tym, czy użytkownicy ją widzą:

- Motyw nie może włączać ani wyłączać pogody. Decyduje o tym opcja **Dynamiczne efekty pogody (deszcz, śnieg, mgła itd.)** w Ustawieniach.
- Gdy włączona jest opcja **Ogranicz animacje i efekty otoczenia** lub ustawienie ograniczenia ruchu na urządzeniu, pogoda w ogóle nie jest rysowana. Tła nadal reagują na `data-mari-weather`, ponieważ zmiana obrazu nie wywołuje ruchu.
- Opcja **Ograniczone efekty renderowania** usuwa zabarwienie i poświaty oraz zmniejsza liczbę rysowanych cząsteczek.
- **Intensywność grafiki motywu** osłabia pogodę tak samo jak tło, a **Wysoki kontrast** sprawia, że pozostaje ona blada.
- Pogoda jest wstrzymywana, gdy panel, edytor lub Mari zasłania czat, żeby oszczędzać baterię.

## Jeśli coś nie działa

- **Nic się nie zmieniło.** Sprawdź, czy token znajduje się w bloku `{ }` i kończy się znakiem `;`. Sprawdź pisownię: to `--mari-weather-rain-color`, z amerykańską pisownią `color`.
- **Wartość jest ignorowana.** Liczby spoza zakresu tokenu są przesuwane do najbliższej granicy zakresu, a wartości, których aplikacja nie rozumie, są pomijane. Kolory muszą być zwykłymi kolorami: gradienty i `url()` są ignorowane.
- **Moje obrazy się nie pojawiają.** Obraz musi znajdować się na liście obrazów motywu, a nazwa w `url("theme:...")` musi być dokładnie zgodna, wraz z właściwym rozszerzeniem (`.webp` lub `.png`).
- **Nie ma żadnej pogody.** Sprawdź, czy agent **Stan świata** jest włączony w tym czacie, wartość Pogoda zawiera słowo z tabeli, opcja **Dynamiczne efekty pogody (deszcz, śnieg, mgła itd.)** jest włączona, a **Ogranicz animacje i efekty otoczenia** – wyłączona.
- **Pogoda pojawia się w trybie Roleplay, ale nie w trybie Conversation.** Tak powinno być. Pogoda jest wyświetlana tylko w czatach w trybach Roleplay i Game Mode.

## Nauka na przykładzie motywów startowych

Każdy motyw startowy w galerii motywów prezentuje efekty pogody. Pobierz jeden, kliknij **Klonuj i edytuj** i przewiń do części kodu CSS oznaczonej `Weather`, żeby zobaczyć, jak to działa.

- **NEON//GRID**: długie cyjanowe smugi deszczu, kwadratowy "śnieg danych", purpurowe iskry zamiast liści i płatków kwiatów. Malowana nakładka deszczu znika, gdy pada prawdziwy deszcz.
- **Petal OS**: styl pikselowy na siatce 3 px, własne pikselowe płatki kwiatów, bladoróżowy deszcz nocą i deszcz w głębokim jagodowym kolorze za dnia oraz miasto, które szarzeje przy złej pogodzie.
- **Lantern Path**: własne malowane liście, świetliki w ciepłych barwach, brak słońca aplikacji (tło ma własne namalowane światło) i tła, które stają się pochmurne lub śnieżne wraz ze zmianą pogody.
- **Dewglass**: własne bańki mydlane zamiast drobinek, kryształowe śnieżynki rysowane kodem, turkusowy deszcz, cyjanowe pioruny i tła z laguną, które stają się pochmurne, zamarznięte lub mgliste.
- **Velvet Casket**: inna burza za dnia i w nocy: różowe pioruny i liliowy deszcz za dnia, fioletowobiałe pioruny i srebrny deszcz nad cmentarzem nocą, z własnymi nietoperzami i płatkami róż na wietrze.
- **Gutterlight**: zimny, komiksowy deszcz, strzępy gazet na wietrze, smog o żółtej barwie lamp sodowych i burzowe tło z wodą spływającą z gargulców przy uderzeniach piorunów.
- **Under Sail**: szkwał na morzu z biało-niebieskimi piorunami wzdłuż takielunku, morska mgła, śnieg na relingu i wyblinkach oraz mewie pióra na wietrze.
- **Apogee Lounge**: kosmiczna pogoda widziana przez okno salonu. Burza staje się burzą jonową w mgławicy z fioletowymi piorunami plazmowymi, deszcz – smugami mikrometeorów, śnieg – polem lodowym, a mgła – zamgleniem mgławicy. Maska utrzymuje wszystko w obrębie szyby.
- **Granite Watch**: motyw przedstawiający wnętrze, więc pogoda pozostaje tak subtelna, jak tylko pozwala motyw. Deszcz przypomina kapanie z przewodów, śnieg – pył z tynku, pioruny są wyłączone, a błysk aplikacji jest zabarwiony tak, by przypominał migotanie lampy. Zajrzyj tutaj, żeby zobaczyć, jak wyciszyć pogodę w scenerii wnętrza.
- **Quiet Iris**: kolejny motyw przedstawiający wnętrze, ale z iluminatorem. Pogoda jest widoczna tylko przez szybę, tło zmienia się na wersję z deszczem, szronem lub mgłą na iluminatorze, pioruny są wyłączone, a podczas burzy wnętrze lekko przygasa.
- **MARI to the Moon**: giełdowa pogoda widziana przez okno pokoju tradera. Deszcz pada jako zielone ticki, burza to krach z czerwonymi piorunami i czerwonymi ekranami, śnieg to spadające monety i diamenty, wiatr niesie banknoty, kwiaty wystrzeliwują małe rakiety, a mgła to FUD nad panoramą miasta.
- **Sanguine Keep**: pogoda widziana przez okna zamku. Szablon dla każdego tła trzyma deszcz, śnieg, płatki, liście i pioruny w szybach okien wielkiej sali (lub wieży schodowej na telefonie), nigdy nad kamieniem.
- **Crepuscular**: to samo morze czytane przez almanach. Śnieg to cukier puder, kurz to okruchy, świetliki to czujne oczy, wiatr niesie skrawki papieru, pioruny to cienkie rytowane gałązki, a czuwanie trwa dalej pod parasolami. We wnętrzach morze widać przez witrażowe okno w ołowianych ramkach.

## Powiązane poradniki

- [Poradnik autora motywów](theme-author-guide.md)
- [Własne motywy CSS](custom-css-themes.md)
- [Pasek HUD i trackery w trybie Roleplay](../roleplay/hud-and-trackers.md)
- [Ustawienia wyglądu](appearance-settings.md)
