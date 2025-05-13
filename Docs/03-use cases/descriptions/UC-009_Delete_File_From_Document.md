---
**ID Případu Užití:** UC-009
**Název Případu Užití:** Smazání souboru z dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Smazání konkrétního souboru (identifikovaného názvem) z daného "Document" objektu (identifikovaného `docId`).

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Úspěšně smazat specifikovaný soubor z dokumentu v 3DEXPERIENCE.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu a název souboru (`fileName`), který má být smazán.
-   Dokument s daným `docId` existuje.
-   Dokument je odemčený (nebo se o zamykání/odemykání stará vyšší UC, např. UC-002).
-   Uživatel má oprávnění mazat soubory z daného dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `deleteFileFromDocument` `Document Helpera` s parametry `docId` a `fileName`.                                                                                                                 |
| 2    | Systém (`Document Helper`)         | `<<invokes>>` UC-013 (Získání metadat souborů dokumentu) s parametrem `docId`. Získá `FileInfoList`. Pokud chyba, přejde na scénář 7.A.                                                                    |
| 3    | Systém (`Document Helper`)         | Prohledá `FileInfoList` a najde soubor, jehož název (`title` v `FileInfo`) odpovídá zadanému `fileName`. Získá `fileId`. Pokud soubor není nalezen, přejde na scénář 7.B.                                   |
| 4    | Systém (`Document Helper`)         | Sestaví požadavek (options) na smazání souboru (endpoint: `DELETE /resources/v1/modeler/documents/{docId}/files/{fileId}`).                                                                                |
| 5    | Systém (`Document Helper`)         | Odešle sestavený požadavek na smazání souboru (pomocí `Connector3DSpace.callService` s metodou `DELETE` a CSRF tokenem). Získá `deleteResponse`. Pokud chyba, přejde na scénář 7.C, 7.D nebo 7.E.          |
| 6    | Systém (`Document Helper`)         | Zpracuje `deleteResponse` (může být prázdná nebo obsahovat potvrzení).                                                                                                                                    |
| 7    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) potvrzení o úspěšném smazání (např. `true`).                                                                                                                     |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí potvrzení, že soubor byl úspěšně smazán.
-   Soubor již není asociován s dokumentem v 3DEXPERIENCE.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při získávání metadat souborů**
    *   **Spouštěcí podmínka:** V kroku 2, volání UC-013 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-013 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Soubor s daným názvem nebyl v dokumentu nalezen**
    *   **Spouštěcí podmínka:** V kroku 3 není v `FileInfoList` nalezen soubor odpovídající `fileName`.
    *   **Reakce systému (`Document Helper`):** Vrátí informaci/chybu o nenalezení souboru volající komponentě (může být považováno za úspěch, pokud cílem bylo zajistit, že soubor neexistuje, nebo za chybu, pokud se očekávalo jeho smazání). Pro účely `DYTUtils`, kde se toto volá před nahráním nového souboru, je nenalezení souboru v pořádku. Může vrátit `true` (jakože soubor byl "smazán", protože neexistuje).
    *   **Výsledek:** Případ užití končí (pro `DYTUtils` úspěšně).

*   **7.C. Dokument nebo soubor neexistuje (chyba platformy při mazání)**
    *   **Spouštěcí podmínka:** V kroku 5 platforma vrátí chybu (např. 404 Not Found), protože dokument s daným `docId` nebo soubor s daným `fileId` neexistuje (i když byl `fileId` získán v kroku 3).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Nedostatečná oprávnění / Dokument je zamčený**
    *   **Spouštěcí podmínka:** V kroku 5 platforma vrátí chybu (např. 401/403, 409 Conflict) indikující, že uživatel nemá oprávnění smazat soubor nebo je dokument zamčený.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.E. Jiná chyba serveru při mazání**
    *   **Spouštěcí podmínka:** V kroku 5 platforma vrátí jinou serverovou chybu (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro smazání souboru je `DELETE /resources/v1/modeler/documents/{docId}/files/{fileId}`.
-   Používá se HTTP metoda `DELETE`.
-   Pro tuto operaci je vyžadován CSRF token.
-   Tento UC nejprve získá `fileId` pomocí UC-013, protože API pro smazání vyžaduje `fileId`.
-   Chování v případě, že soubor není nalezen (scénář 7.B), je specifické pro kontext `DYTUtils`. Pokud by tento UC byl volán v jiném kontextu, kde se očekává, že soubor existuje, nenalezení by bylo chybou.

### 9. Volané Případy Užití
-   UC-013: Získání metadat souborů dokumentu

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu
