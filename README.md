# Blossomspelet

Blossomspelet är ett webbaserat spel där du parar spelare så att Elo-skillnaderna blir så jämna som möjligt. Appen skapar en slumpad Elo-lista, visar en matris med skillnader mellan alla spelare och jämför dina val med en optimal lösning.

## Kom igång

Öppna `index.html` i en webbläsare. Ingen installation eller server behövs.

Välj antal spelare i listan. Tillåtna värden är jämna tal från 4 till 20. Klicka `Ny lista` om du vill skapa en ny Elo-lista.

## Så spelar du

Spelarna är sorterade med starkaste spelaren högst upp och längst till vänster. Axlarna visar spelarens nummer, men bara entalssiffran. Elo-talet visas längst till höger.

Klicka på en cell för att välja paret. Samma par markeras automatiskt i spegelcellen. Klicka igen för att ta bort valet. Diagonalen kan inte väljas.

När du har valt en komplett parning klickar du `Nästa`. Då visas den optimala lösningen för ronden:

- Röd: ditt val ska bort.
- Grön: optimalt par som saknas i ditt val.
- Gul: ditt val är också optimalt.

I nästa rond visas samma matris, men tidigare valda par är blockerade och visas med en punkt.

## Final

Resultatpanelen visas hela tiden med raderna `Rond`, `Min summa` och `Optimal summa`. Under spelet fylls aktuell rond i när det finns resultat. Efter sista ronden kan du klicka på en rond i tabellen för att inspektera den. Matrisen visar då Elo-differenserna och markerar dina val mot optimum med samma röd/gul/grön logik.

## Delbar länk

URL:en innehåller antal spelare och ett frö som skapar Elo-listan. Skicka URL:en till någon annan för att låta dem spela samma lista.

## Teknisk notis

Optimeringen använder Blossom-algoritmen via `blossom.js`. Algoritmen minimerar Elo-skillnaden upphöjd till 1.01 för att undvika ojämna outliers, medan appen visar och summerar vanliga absoluta Elo-differenser.
