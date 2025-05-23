---
**ID Případu Užití:** UC-011
**Název Případu Užití:** Nahrání Obsahu Souboru na FCS
**Datum Vytvoření:** 2025-05-16
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Nahrání obsahu souboru na File Collaboration Server (FCS) pomocí dříve získaného Checkin Ticketu.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta orchestrjící nahrání souboru, např. v rámci UC-002)

### 3. Cíl
Úspěšně nahrát zadaný obsah souboru na FCS a získat "FCS receipt", který potvrzuje úspěšné nahrání a je potřebný pro finální asociaci souboru s dokumentem.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE (pokud je interakce s FCS proxována přes platformu).
-   Volající komponenta má k dispozici platné informace z Checkin Ticketu získané z UC-005:
    -   `fcsUploadUrl`: URL adresa FCS serveru pro nahrání.
    -   `ticketParamName`: Název parametru pro ticket.
    -   `ticketValue`: Hodnota ticketu.
-   Volající komponenta poskytuje obsah souboru (`fileContent` jako string) a název souboru (`fileName` - může být potřeba pro `multipart/form-data`).

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `uploadFileContentToFCS` `Document Helpera` s parametry `fcsUploadUrl`, `ticketParamName`, `ticketValue`, `fileName` a `fileContent`.                                                        |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options, typicky `multipart/form-data`) pro nahrání souboru na `fcsUploadUrl`. Požadavek bude obsahovat `fileContent` (jako soubor) a `ticketValue` pod názvem `ticketParamName`.        |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na `fcsUploadUrl` (např. pomocí `Connector3DSpace.callService`, pokud podporuje `multipart/form-data` a externí URL, nebo přímým HTTP POST požadavkem). Získá `fcsUploadResponse`. Pokud chyba, přejde na scénář 7.A nebo 7.B. |
| 4    | Systém (`Document Helper`)         | Zpracuje `fcsUploadResponse`. Pokud nahrání nebylo úspěšné nebo odpověď neobsahuje "FCS receipt", přejde na scénář 7.C. Jinak extrahuje `fcsReceipt`.                                                      |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) získaný `fcsReceipt`.                                                                                                                                            |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí `fcsReceipt` potvrzující úspěšné nahrání souboru na FCS.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při komunikaci s FCS serverem**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku na FCS, dojde k chybě komunikace (síťová chyba, FCS server nedostupný).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Neplatný ticket / Chyba autorizace na FCS**
    *   **Spouštěcí podmínka:** V kroku 3 FCS server odmítne požadavek kvůli neplatnému nebo expirovanému ticketu, nebo jiné chybě autorizace.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu (na základě odpovědi FCS) a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nahrání na FCS selhalo / Chybějící FCS Receipt**
    *   **Spouštěcí podmínka:** V kroku 4, `fcsUploadResponse` indikuje neúspěšné nahrání nebo neobsahuje platný `fcsReceipt`.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC se zabývá pouze nahráním obsahu na FCS. Finální asociace souboru s dokumentem v 3DEXPERIENCE je řešena v samostatném UC (např. UC-012).
-   Přesný mechanismus sestavení požadavku (krok 2) a odeslání (krok 3) na FCS (zejména pokud se používá `multipart/form-data`) je třeba detailně prozkoumat a implementovat. `Connector3DSpace.callService` nemusí být pro tento typ požadavku přímo vhodný, pokud nepodporuje `FormData` a volání na externí URL (FCS). Může být potřeba použít nativní `fetch` nebo `XMLHttpRequest`.
-   Formát `fcsReceipt` je třeba zjistit z dokumentace nebo experimentálně.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací, i když interaguje s externím systémem FCS).

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu (bude volat tento UC jako druhý krok nahrávání)
