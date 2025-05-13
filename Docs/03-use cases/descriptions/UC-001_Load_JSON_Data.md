---
**ID Případu Užití:** UC-001
**Název Případu Užití:** Načtení JSON dat z dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.3 (Aktualizováno pro volání UC-015 místo přímého UC-004)
**Datum Revize:** 2025-05-13
**Poskytuje:** Json Manager
---

### 1. Název Případu Užití
Načtení a deserializace JSON dat uložených v souboru v rámci "Document" objektu v 3DEXPERIENCE.

### 2. Aktér(ři)
-   Primární aktér: `Widget` (nebo jiná komponenta volající `Json Manager`)

### 3. Cíl
Získat JSON data ze specifikovaného souboru v dokumentu a poskytnout je volající komponentě jako JavaScriptový objekt.

### 4. Předpoklady
-   Volající komponenta (`Widget`) je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná název "Document" objektu (`documentTitle`) a název souboru (`fileName`) obsahujícího JSON data.
-   `Document Helper` je dostupný a nakonfigurovaný.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Json Manager`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`Widget`)                | Volá metodu `loadJsonFromDocument` `Json Manageru` s parametry `documentTitle` a `fileName`.                                                                                                              |
| 2    | Systém (`Json Manager`)         | Validuje vstupní parametry (`documentTitle`, `fileName`). Pokud neplatné, přejde na scénář 7.A.                                                                                                           |
| 3    | Systém (`Json Manager`)         | `<<invokes>>` UC-003 (Vyhledání dokumentu podle názvu) s parametrem `documentTitle`. Získá `searchResult`. Pokud chyba při vyhledávání, přejde na scénář 7.B.                                               |
| 4    | Systém (`Json Manager`)         | Zpracuje `searchResult`. Validuje, že byl nalezen právě jeden dokument. Pokud ne, přejde na scénář 7.C. Jinak extrahuje `docId` a další relevantní `documentInfo`.                                        |
| 5    | Systém (`Json Manager`)         | `<<invokes>>` UC-015 (Kompletní stažení souboru z dokumentu) s parametry `docId` (získaným v kroku 4) a `fileName` (z kroku 1). Získá `FileContentAndInfo` (obsahující `fileContent` a `fileInfo`). Pokud chyba při stahování (včetně nenalezení souboru v dokumentu), přejde na scénář 7.D. |
| 6    | Systém (`Json Manager`)         | Validuje `fileContent` a `fileInfo` (např. kontrola typu souboru, neprázdný obsah). Pokud neplatné, přejde na scénář 7.E.                                                                                 |
| 7    | Systém (`Json Manager`)         | Deserializuje `fileContent` (textový obsah souboru) z formátu JSON na JavaScriptový objekt. Pokud chyba při deserializaci, přejde na scénář 7.F.                                                          |
| 8    | Systém (`Json Manager`)         | Vrátí volající komponentě (`Widget`) deserializovaný JSON objekt.                                                                                                                                         |

### 6. Výsledek (Úspěch)
-   `Json Manager` vrátí JavaScriptový objekt reprezentující JSON data stažená ze souboru v dokumentu.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Neplatné vstupní parametry**
    *   **Spouštěcí podmínka:** V kroku 2, vstupní parametry nejsou platné (např. prázdný `documentTitle` nebo `fileName`).
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při vyhledávání dokumentu**
    *   **Spouštěcí podmínka:** V kroku 3, volání UC-003 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu z UC-003 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Dokument s daným názvem nebyl nalezen nebo nalezeno více dokumentů**
    *   **Spouštěcí podmínka:** V kroku 4, `searchResult` z UC-003 neobsahuje žádný dokument nebo obsahuje více než jeden dokument odpovídající `documentTitle`.
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě (např. "Dokument nenalezen" nebo "Nalezeno více dokumentů se stejným názvem").
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Chyba při stahování souboru**
    *   **Spouštěcí podmínka:** V kroku 5, volání UC-015 selže (např. chyba při získání ticketu, chyba při stahování z FCS, nebo soubor s daným názvem nebyl v dokumentu nalezen - toto by mělo být ošetřeno v UC-015 a propagováno jako chyba).
    *   **Reakce systému (`Json Manager`):** Propaguje chybu z UC-015 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.E. Neplatný výsledek stahování**
    *   **Spouštěcí podmínka:** V kroku 6, stažený `fileContent` nebo `fileInfo` je neplatný pro další zpracování (např. prázdný obsah, neočekávaný typ souboru).
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.F. Chyba při deserializaci JSON**
    *   **Spouštěcí podmínka:** V kroku 7, `fileContent` není platný JSON řetězec.
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě (např. "Obsah souboru není platný JSON").
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   `Json Manager` funguje jako fasáda, která zjednodušuje interakci s `Document Helperem` pro specifický účel práce s JSON daty.
-   Tento UC orchestruje několik nižších úrovní operací poskytovaných `Document Helperem`.

### 9. Volané Případy Užití
-   UC-003: Vyhledání dokumentu podle názvu
-   UC-015: Kompletní stažení souboru z dokumentu

### 10. Použito v Případech Užití
-   N/A (Tento UC je volán přímo z `Widgetu`)

---
