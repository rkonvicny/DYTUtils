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
-   Primární aktér: [Např. Widget]
-   [Případní sekundární aktéři]

### 3. Cíl
[Stručný popis toho, čeho chce aktér dosáhnout pomocí tohoto případu užití.]

### 4. Předpoklady
-   [Podmínka 1, která musí být splněna před zahájením případu užití.]
-   [Podmínka 2]

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém                     | Akce / Reakce                                                                                                                               |
| :--- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Aktér ([Název aktéra])             | [Popis akce aktéra, např. Volá funkci `nazevFunkce` s parametry (param1, param2).]                                                          |
| 2    | Systém ([Název komponenty systému]) | [Popis reakce systému, např. Validuje vstupní parametry.]                                                                                   |
| 3    | Systém ([Název komponenty systému]) | [Popis dalšího kroku systému, např. Volá interní službu X.]                                                                                 |
| ...  | ...                                | ...                                                                                                                                         |
| N    | Systém ([Název komponenty systému]) | [Popis finální akce systému, např. Resolvuje Promise s výsledkem Z aktérovi.]                                                               |

### 6. Výsledek (Úspěch)
-   [Popis stavu po úspěšném dokončení případu užití.]
-   [Případně jaká data jsou vrácena aktérovi.]

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. [Název alternativního scénáře nebo chybového stavu]**
    *   **Spouštěcí podmínka:** V kroku [X] hlavního scénáře, [popis podmínky, která vede k tomuto scénáři].
    *   **Reakce systému ([Název komponenty systému]):** [Popis reakce systému].
    *   **Výsledek:** Případ užití končí [úspěchem/neúspěchem].

*   **7.B. [Název dalšího alternativního scénáře nebo chybového stavu]**
    *   **Spouštěcí podmínka:** Během kroku [Y] hlavního scénáře, [popis podmínky].
    *   **Reakce systému ([Název komponenty systému]):** [Popis reakce systému].
    *   **Výsledek:** Případ užití končí [úspěchem/neúspěchem].

### 8. Poznámky
-   [Jakékoli další relevantní informace, speciální požadavky, body k diskusi atd.]

### 9. Související Funkční Požadavky
-   `[^FR-XXX]` - [Název funkčního požadavku]
-   `[^FR-YYY]` - [Název funkčního požadavku]

---
<!-- Definice poznámek pod čarou pro FR -->
<!-- Příklad:
[^FR-XXX]: FR-XXX - Název funkčního požadavku
-->