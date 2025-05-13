---
**ID Případu Užití:** UC-015
**Název Případu Užití:** Kompletní stažení souboru z dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Kompletní stažení obsahu konkrétního souboru (identifikovaného názvem) z daného "Document" objektu (identifikovaného `docId`). Orchestruje získání ticketu a následné stažení souboru.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Získat obsah souboru uloženého v 3DEXPERIENCE dokumentu jako textový řetězec a metadata o tomto souboru (`FileInfo`).

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu a název souboru (`fileName`), který má být stažen.
-   Dokument s daným `docId` existuje.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `downloadFileFromDocument` (nebo podobný název pro kompozitní operaci) `Document Helpera` s parametry `docId` a `fileName`.                                                                   |
| 2    | Systém (`Document Helper`)         | `<<invokes>>` UC-004 (Získání Download Ticketu pro Soubor) s parametry `docId` a `fileName`. Získá `DownloadTicketInfo` (obsahující `fcsUrl`). Pokud chyba, přejde na scénář 7.A.                           |
| 3    | Systém (`Document Helper`)         | `<<invokes>>` UC-014 (Stažení Souboru z FCS) s parametrem `fcsUrl` (získaným v předchozím kroku). Získá `FileContentAndInfo` (obsahující `fileContent` a `FileInfo`). Pokud chyba, přejde na scénář 7.B.    |
| 4    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) získaný objekt `FileContentAndInfo`.                                                                                                                             |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt obsahující textový obsah požadovaného souboru a metadata o souboru (`FileInfo`).

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při získávání Download Ticketu**
    *   **Spouštěcí podmínka:** V kroku 2, volání UC-004 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-004 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při stahování souboru z FCS**
    *   **Spouštěcí podmínka:** V kroku 3, volání UC-014 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-014 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC je kompoziční a zapouzdřuje dvoufázový proces stahování souborů.
-   Poskytuje jednodušší rozhraní pro běžný případ užití kompletního stažení.
-   Granulární operace (UC-004, UC-014) jsou stále dostupné pro pokročilejší scénáře.

### 9. Volané Případy Užití
-   UC-004: Získání Download Ticketu pro Soubor
-   UC-014: Stažení Souboru z FCS

### 10. Použito v Případech Užití
-   UC-001: Načtení JSON dat z dokumentu
