# Blossomspelet

UTF-8
Ska även fungera på iPad.

## Målsättning

Ur en lista med el0-tal, ska de par väljas ut som minimerar den absoluta elo-differensen.
Elotalen ligger i intervallet 1400..2400, normalfördelat.

## Input

n väljes ur en lista med jämna tal 4 .. 50

## GUI

### En rond

En matris med möjliga celler visas.  
I varje cell befinner sig den kvadrerade skillnaden mellan de två elo-talen.  
Detta för få jämnast möjliga par. Inga outliers.  
Dock visas den okvadrerade, absoluta diffen.  
Då man klickar på en cell (x,y) markeras samtidigt (y,x).
Klickar man igen, avmarkeras de båda cellerna.
Man kan inte klicka på diagonalen.
Starkaste spelaren befinner sig högst upp till vänster.
Axlarna numreras med talen 1..n.
Enbart entalssiffran visas
Längst till höger visas elotalen.
Då man tror sig ha ett minimum klickar man på *Nästa* och då visas en optimal lösning.
(Rödmarkera celler som sk bort, grönmarkera celler som ska in)
Summan som visas ska vara den okvadrerade.

### Rond

Nu visas samma matris, men valen man gjort tidigare är inte tillgängliga.
De visas med en punkt, "·"
Antalet ronder är den upprundade tvålogaritmen av n. T ex 10 => 3

### Url

Urlen innehåller det frö som skapar elolistan, samt antalet spelare.
Man ska alltså kunna ge urlen till en kompis.

### Algoritm

Blossom