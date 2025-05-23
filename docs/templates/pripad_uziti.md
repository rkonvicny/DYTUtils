---
**ID Případu Užití:** UC-XXX
**Název Případu Užití:** [Název případu užití]
**Datum Vytvoření:** RRRR-MM-DD
**Autor:** [Jméno autora]
**Verze:** 0.1
---

### 1. Název Případu Užití
[Detailnější název případu užití]

### 2. Aktér(ři)
-   [Primární aktér, např. Widget]
-   [Případní sekundární aktéři]

### 3. Cíl
[Stručný popis toho, čeho chce aktér dosáhnout pomocí tohoto případu užití.]

### 4. Předpoklady
-   [Podmínka 1, která musí být splněna před zahájením případu užití, např. Aktér je autentizován.]
-   [Podmínka 2, např. Systém (Utilita) je dostupný a inicializovaný.]

### 5. Hlavní úspěšný scénář (Kroky)
1.  **Aktér:** [Popis akce aktéra, např. Widget volá funkci `nazevFunkce` s parametry (param1, param2).]
2.  **Systém (Utilita):** [Popis reakce systému, např. Utilita validuje vstupní parametry.]
3.  **Systém (Utilita):** [Popis dalšího kroku systému, např. Utilita volá interní službu X.]
4.  **Systém (Utilita):** [Popis dalšího kroku systému, např. Interní služba X vrací výsledek Y.]
5.  **Systém (Utilita):** [Popis finální akce systému, např. Utilita vrací výsledek Z aktérovi.]

### 6. Výsledek (Úspěch)
-   [Popis stavu po úspěšném dokončení případu užití, např. JSON data jsou úspěšně načtena a dostupná Widgetu.]
-   [Případně jaká data jsou vrácena aktérovi.]

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. [Název alternativního scénáře nebo chybového stavu, např. Dokument neexistuje]**
    1.  V kroku [X] hlavního scénáře, [popis podmínky, která vede k tomuto scénáři, např. Systém zjistí, že dokument se zadaným názvem neexistuje].
    2.  **Systém (Utilita):** [Popis reakce systému, např. Utilita vrátí chybovou zprávu "Dokument nenalezen" aktérovi.]
    3.  Případ užití končí.

*   **7.B. [Název dalšího alternativního scénáře nebo chybového stavu, např. Chyba při komunikaci s platformou]**
    1.  Během kroku [Y] hlavního scénáře, [popis podmínky, např. dojde k chybě při volání externí služby].
    2.  **Systém (Utilita):** [Popis reakce systému, např. Utilita zaznamená chybu a vrátí obecnou chybovou zprávu aktérovi.]
    3.  Případ užití končí.

### 8. Poznámky
-   [Jakékoli další relevantní informace, speciální požadavky, body k diskusi atd.]
