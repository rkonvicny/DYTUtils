---
**ID Případu Užití:** UC-004
**Název Případu Užití:** Získání Download Ticketu pro Soubor
**Datum Vytvoření:** 2025-05-17
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Získání potřebného ticketu a URL od platformy 3DEXPERIENCE pro následné stažení konkrétního souboru (identifikovaného názvem) z daného "Document" objektu (identifikovaného `docId`).

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Úspěšně získat Download Ticket, který obsahuje URL (`fcsUrl`) pro stažení souboru z FCS a případné další informace potřebné pro stažení.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu a název souboru (`fileName`), pro který se má získat ticket.
-   Dokument s daným `docId` existuje.
-   Uživatel má oprávnění stahovat soubory z daného dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `getDownloadTicketForFile` `Document Helpera` s parametry `docId` a `fileName`.                                                                                                               |
| 2    | Systém (`Document Helper`)         | `<<invokes>>` UC-013 (Získání metadat souborů dokumentu) s parametrem `docId`. Získá `FileInfoList`. Pokud chyba, přejde na scénář 7.A.                                                                    |
| 3    | Systém (`Document Helper`)         | Prohledá `FileInfoList` a najde soubor, jehož název (`title` v `FileInfo`) odpovídá zadanému `fileName`. Získá `fileId`. Pokud soubor není nalezen, přejde na scénář 7.B.                                   |
| 4    | Systém (`Document Helper`)         | Sestaví požadavek (options) na získání "File Download Ticket" pro daný `docId` a `fileId` (endpoint: `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket`).                           |
| 5    | Systém (`Document Helper`)         | Odešle sestavený požadavek na získání ticketu (pomocí `Connector3DSpace.callService` s metodou `PUT` a CSRF tokenem). Získá `ticketResponse`. Pokud chyba, přejde na scénář 7.C.                             |
| 6    | Systém (`Document Helper`)         | Zpracuje `ticketResponse`. Pokud ticket nebyl získán nebo je neplatný, přejde na scénář 7.D. Jinak extrahuje URL pro stažení souboru z FCS (`fcsUrl`) a případné další informace z ticketu (např. `fileName` z ticketu, pokud se liší). |
| 7    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `fcsUrl` a další relevantní informace z ticketu (např. `DownloadTicketInfo`).                                                                 |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `DownloadTicketInfo` obsahující `fcsUrl` a další informace potřebné pro stažení souboru z FCS.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při získávání metadat souborů**
    *   **Spouštěcí podmínka:** V kroku 2, volání UC-013 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-013 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Soubor s daným názvem nebyl v dokumentu nalezen**
    *   **Spouštěcí podmínka:** V kroku 3 není v `FileInfoList` nalezen soubor odpovídající `fileName`.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu (nebo specifickou informaci o nenalezení) volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Chyba při získávání Download Ticketu (obecná chyba komunikace)**
    *   **Spouštěcí podmínka:** V kroku 5, při odesílání požadavku na získání ticketu, dojde k chybě komunikace s platformou (např. síťová chyba, chyba serveru 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Dokument nebo soubor (dle fileId) neexistuje / Ticket nelze získat**
    *   **Spouštěcí podmínka:** V kroku 5 platforma vrátí chybu (např. 404 Not Found), protože dokument nebo soubor (dle `fileId`) neexistuje, nebo v kroku 6 `ticketResponse` neobsahuje platný ticket.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu (nebo specifickou informaci o nenalezení) volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC se zabývá pouze získáním ticketu pro stažení. Samotné stažení je řešeno v UC-014.
-   Nejprve se získá `fileId` pomocí UC-013.
-   Endpoint pro získání Download Ticketu je `PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket` a vyžaduje CSRF.
-   Odpověď z platformy (`ticketResponse`) typicky obsahuje `ticketURL` (což je naše `fcsUrl`) a může obsahovat i `fileName`.

### 9. Volané Případy Užití
-   UC-013: Získání metadat souborů dokumentu

### 10. Použito v Případech Užití
-   UC-001: Načtení JSON dat z dokumentu (bude volat tento UC a následně UC-014)
