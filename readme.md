DOKUMENATION

    KURZBESCHREIBUNG
        New York City ist eine riesige Stadt mit rund 8,4 Mio. Einwohner:innen – eine Stadt, in der bestimmt nicht immer alles rund läuft. Unser Projekt zeigt auf, in welchen der fünf Stadtteile (Brooklyn, Queens, Staten Island, Bronx und Manhattan) die meisten Beschwerden eingehen.
        Unsere API liefert dazu verschiedene Informationen, wie die Kategorie der Beschwerde (z.B. „Noise“) sowie eine genauere Beschreibung wie „Loud Music/Party“. Mithilfe eines Datepickers kann ein beliebiges Datum in der Vergangenheit ausgewählt werden. Daraufhin zeigt eine New-York-City-Karte an, in welchem Viertel an diesem Tag die meisten Beschwerden eingegangen sind. Zusätzlich stellt ein Podest die Top drei Beschwerden dar und macht sichtbar, worüber sich die Bewohner:innen am häufigsten beschweren.

        Mit etwas Fantasie könnte unser Projekt beispielsweise für Behörden in New York City spannend sein, um gezielt zu erkennen, in welchen Stadtteilen Handlungsbedarf besteht.
               

    LEARNINGS
        Aus dem Projekt haben wir gelernt, dass es wichtiger ist, Daten aussagekräftig zu präsentieren, als möglichst viele Daten darzustellen. Auch wenn das bedeutet, gewisse Informationen wegzulassen, kann dies sinnvoller sein, als irrelevante Daten beizubehalten, die keine klare Aussage liefern.


    SCHWIERIGKEITEN
        Beim Projekt-Pitch haben wir unsere API gemeinsam mit Lea besprochen, da wir anfangs einige Probleme hatten. Es war zunächst unklar, ob die API überhaupt noch aktualisiert wird. Deshalb haben wir die API über eine Woche hinweg beobachtet und parallel nach alternativen APIs gesucht. Nach dieser Beobachtungsphase kamen wir zum Schluss, dass die API zwar aktualisiert wird, jedoch nur einmal täglich und nicht fortlaufend. Daraufhin haben wir unser Projekt konkret umgesetzt.
        In einer späteren Unterrichtseinheit haben wir ein Liniendiagramm mit Timepicker eingebaut, das anzeigen sollte, zu welchen Uhrzeiten die Beschwerden eingegangen sind. Das Diagramm sah jedoch unabhängig vom gewählten Datum nahezu identisch aus: Die Linien aller Viertel lagen meist bei null, ausser zwischen zwei und vier Uhr nachts. Dadurch war das Diagramm für unser Projekt wenig aussagekräftig.

        Gemeinsam mit Lea haben wir überprüft, ob dies an unserer Datenbank lag, stellten jedoch fest, dass die Ursache bei der API selbst lag. Da diese nur einmal täglich aktualisiert wird, hatten alle Beschwerden praktisch denselben Zeitstempel. Die Zeitangaben waren somit nicht sinnvoll nutzbar. Lea empfahl uns, das Diagramm weiter zu beobachten und es gegebenenfalls zu entfernen. Nach zwei weiteren Wochen ohne Veränderung haben wir uns entschieden, das Diagramm vollständig aus dem Projekt zu streichen – nach dem Prinzip: lieber weglassen als etwas zu zeigen, das keine Aussagekraft hat.

        (Eine weitere Schwierigkeit bestand darin, die gesamte Website responsive umzusetzen. Zu Beginn hatten wir die einzelnen Stadtteile der Karte als separate Bilder eingebunden, um einen coolen Hover-Effekt realisieren zu können. Dies stellte jedoch eine grosse Herausforderung dar, da sich die Elemente zusammen mit den Prozentangaben dynamisch verschieben mussten. Dadurch entstanden zwischen den Stadtteilen Lücken, was wie ein Darstellungsfehler wirkte.
        Aus diesem Grund haben wir uns gegen den Hover-Effekt entschieden und die Karte schliesslich als eine einzelne Datei eingebunden.)
        


    BENUTZTE RESSOURCEN
        Den grössten Teil des Projekts konnten wir im Unterricht umsetzen, was eine grosse Hilfe war. Dadurch konnten wir gemeinsam arbeiten, uns austauschen und direkt Live-Coaching in Anspruch nehmen. Zusätzlich haben wir viel mit AI bzw. ChatGPT gearbeitet. Dabei war es wichtig, sehr klare und präzise Prompts zu formulieren. So haben wir häufig bereits gut funktionierenden Code erhalten, den wir nur noch leicht anpassen mussten.

