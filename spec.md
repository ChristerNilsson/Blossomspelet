# Blossomspelet

## Syfte

Blossomspelet är ett webbaserat spel där användaren parar ihop spelare från en Elo-lista. Målet är att hitta parningar som ger så jämna Elo-skillnader som möjligt.

Appen ska vara enkel att förstå för nya användare och fungera bra på både dator och iPad.

## Definitioner

- `n`: antal spelare.
- `Elo`: spelarens ratingtal.
- `diff`: vanlig absolut Elo-differens, `|eloA - eloB|`.
- `kostnad`: optimeringsvärde, `diff ^ 1.01`.
- `rond`: en omgång där varje spelare kan paras exakt en gång.
- `valt par`: par som användaren har valt i aktuell eller tidigare rond.
- `optimalt par`: par som ingår i Blossom-lösningen för aktuell rond.
- `låst par`: par som valdes i en tidigare rond och därför inte får väljas igen.

## Tekniska krav

- Alla filer ska vara UTF-8.
- Text och dokumentation ska kunna innehålla svenska tecken: å, ä och ö.
- Appen ska kunna köras direkt i webbläsaren utan server.
- Appen ska vara användbar på iPad med touch.
- README ska ge en nybörjarvänlig introduktion till spelet.
- README ska inte börja med eller luta sig mot den gamla texten `Klicka par i matrisen. Samma val markeras åt båda håll.`
- URL:en ska innehålla både antal spelare och frö, så att samma spel kan delas med någon annan.

## Indata och Elo-lista

- Användaren väljer `n` ur en lista med jämna tal från 4 till 20.
- Elo-talen ska ligga i intervallet 1400 till 2400.
- Elo-listan ska skapas normalfördelat.
- Elo-listan ska sorteras fallande.
- Starkaste spelaren ska visas längst upp och längst till vänster i matrisen.

## Målfunktion

Optimeringen ska använda den absoluta Elo-differensen upphöjd till `1.01`:

```text
kostnad = |eloA - eloB| ^ 1.01
```

Detta används för att undvika ojämna outliers.

Gränssnittet ska däremot alltid visa och summera vanlig absolut Elo-differens:

```text
diff = |eloA - eloB|
```

Det upphöjda värdet får alltså inte visas i matrisen eller i resultatpanelen.

## Algoritm

- Optimal parning ska beräknas med Blossom.
- Blossom ska välja en komplett parning för de spelare som ingår i ronden.
- Parningen ska minimera summan av `kostnad`.
- Låsta par får inte användas när senare ronders optimum beräknas.
- Resultat som visas för användaren ska summeras med `diff`, inte `kostnad`.

## Matris

Matrisen är huvudytan för spelet.

Krav:

- Matrisen visar alla möjliga spelarpar.
- Varje klickbar cell visar `diff`.
- Alla heltal i cellerna ska vara centrerade.
- Alla celler ska ha samma textstorlek.
- Inga celler ska vara utgråade.
- Diagonalen ska inte kunna väljas.
- Axlarna numreras med spelare `1..n`.
- Endast entalssiffran visas på axlarna.
- Elo-tal visas längst till höger.
- När användaren klickar cell `(x, y)` ska motsvarande par `(y, x)` markeras samtidigt.
- När användaren klickar samma par igen ska paret avmarkeras.
- En spelare kan bara ingå i ett valt par per rond.
- Om användaren väljer ett nytt par för en spelare som redan ingår i ett valt par ska det gamla paret tas bort.

## Ronder

- Antalet ronder är avrundad tvålogaritm av `n`.
- Exempel: `n = 10` ger `3` ronder.
- En rond är komplett när användaren har valt `n / 2` par.
- Knappen `Nästa` ska vara inaktiv tills ronden är komplett.
- När användaren klickar `Nästa` efter en komplett rond ska optimal lösning för aktuell rond visas.
- Efter avslöjad lösning går användaren vidare till nästa rond med `Nästa rond`.
- Efter sista avslöjade ronden går användaren vidare till final med `Resultat`.
- I senare ronder är tidigare valda par låsta.
- Låsta par visas med en punkt: `·`.
- Låsta par ska inte vara klickbara.
- Låsta par ska inte vara utgråade.

## Färgmarkering

När en optimal lösning visas ska cellerna markeras så här:

- Röd: användaren har valt ett par som inte ingår i optimal lösning.
- Grön: paret ingår i optimal lösning men saknas i användarens val.
- Gul: paret är valt av användaren och ingår i optimal lösning.

Samma färglogik ska användas vid inspektion av tidigare ronder i finalen.

## Resultatpanel

Resultatpanelen ska alltid visas, även innan finalen.

Panelen ska vara en tabell med denna struktur:

```text
Rond             1      2      3      total
Min summa      267    781    579     1627
Optimal summa  267    477    477     1221
```

Krav:

- Första raden heter `Rond`.
- Rondkolumnerna visar endast rondnummer, exempelvis `1`, `2`, `3`.
- Sista kolumnen heter `total`.
- Användarens rad heter `Min summa`.
- Optimumraden heter `Optimal summa`.
- Tabellen visar delsummor per rond och totaler.
- Under spelet får framtida ronder vara tomma tills resultat finns.
- Summor i tabellen ska alltid beräknas med vanlig `diff`.
- Klick i tabellen ska välja rond för inspektion när finalen är nådd.

## Final

När alla ronder är klara visas slutresultatet i resultatpanelen.

I finalen ska användaren kunna inspektera tidigare ronder genom att klicka på rondens kolumn i tabellen.

Vid inspektion ska matrisen visa:

- användarens val,
- den optimala lösningen,
- röd, gul och grön markering enligt färgreglerna,
- endast vanlig `diff` i cellerna.

## Saker som inte ska finnas

Följande separata paneler ska inte finnas, eftersom resultatpanelen ersätter dem:

- `Rond`
- `Vald summa`
- `optimal summa`

Följande knappar ska inte finnas:

- `Rond -1`
- `Rond 1`
- `Rond +1`

## Acceptanskriterier

- En ny användare ska kunna förstå spelets mål via README och status-texten i appen.
- För `n = 4, 6, 8, ..., 20` ska appen kunna skapa en spelbar lista.
- Matrisens cellvärden ska vara centrerade och ha jämn textstorlek.
- Inga låsta eller inaktiva celler ska se utgråade ut.
- Ett valt par ska alltid markeras symmetriskt i båda riktningar.
- En komplett rond ska kunna avslöja både användarens summa och optimal summa.
- Resultatpanelen ska synas från start och uppdateras under spelet.
- Finalen ska kunna inspektera varje tidigare rond genom klick i resultatpanelen.
- URL-delning ska återskapa samma `n` och samma Elo-lista.
