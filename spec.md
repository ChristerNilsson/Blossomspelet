# Blossomspelet

UTF-8
Ska även fungera på iPad.
Heltalen i matrisens celler ska alltid vara centrerade
Inga celler ska vara utgråade.
Skapa en readme till nya användare. Den ska kunna innehålla åäö.
Ge en bra introduktion till nybörjare istf ```Klicka par i matrisen. Samma val markeras åt båda håll.```

Tag bort de tre redundanta panelerna med följande rubriker:
* Rond
* Vald summa
* optimal summa

Tag bort tre redundanta knappar:
* Rond -1
* Rond 1
* Rond +1

## Målsättning

Ur en lista med el0-tal, ska de par väljas ut som minimerar den absoluta elo-differensen.
Elotalen ligger i intervallet 1400..2400, normalfördelat.

## Input

n väljes ur en lista med jämna tal 4 .. 20

## GUI

### En rond

En matris med möjliga celler visas.  
I varje cell befinner sig skillnaden mellan de två elo-talen, upphöjd till 1.01
Detta för få jämnast möjliga par. Inga outliers.  
Dock visas den absoluta diffen, ej upphöjd till 1.01
Då man klickar på en cell (x,y) markeras samtidigt (y,x).
Klickar man igen, avmarkeras de båda cellerna.
Man kan inte klicka på diagonalen.
Starkaste spelaren befinner sig högst upp till vänster.
Axlarna numreras med talen 1..n.
Enbart entalssiffran visas
Längst till höger visas elotalen.
Då man tror sig ha ett minimum klickar man på *Nästa* och då visas en optimal lösning.
(Rödmarkera celler som ska bort, grönmarkera celler som ska in, gulmarkera celler där spelaren valt optimum.)
Summan som visas ska vara den oupphöjda.

### Rond

Nu visas samma matris, men valen man gjort tidigare är inte tillgängliga.
De visas med en punkt, "·"
Antalet ronder är den upprundade tvålogaritmen av n. T ex 10 => 3

### Final

Klick i tabellen ska välja rond.

Då man klarat av alla ronderna, visas resultatet upp.
Detta innebär att rondernas delsummor visas upp samt den egna totalen.
Även optimum visas.
Man ska här kunna välja att inspektera de tidigare ronderna.
Därför finns knapparna, *rond-1* och *rond+1*

Dessa ronder ska visa både spelarens val och den optimala lösningen. Med röd, gul och grönmarkering som tidigare.
Här visas bara elodiffar i cellerna.

```
Din total
1627
Optimum
1221
Rond 1
267 / 267
Rond 2
781 / 477
Rond 3
579 / 477
```

mot 

```
          rond 1 rond 2 rond 3 total
Mina val   267    781    579    1627
Optimum    267    477    477    1221
```

## Url

Urlen innehåller det frö som skapar elolistan, samt antalet spelare.
Man ska alltså kunna ge urlen till en kompis.

## Algoritm

Blossom