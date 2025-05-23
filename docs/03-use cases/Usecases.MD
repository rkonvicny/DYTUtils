# Combined Document

## Included Files
* 23		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-001_LOAD_JSON_DATA.MD
* 114		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-002_SAVE_JSON_DATA.MD
* 218		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-003_SEARCH_DOCUMENT_BY_TITLE.MD
* 284		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-004_GET_DOWNLOAD_TICKET_FOR_FILE.MD
* 363		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-005_GET_UPLOAD_TICKET_FOR_FILE.MD
* 428		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-006_CREATE_NEW_DOCUMENT.MD
* 502		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-007_RESERVE_DOCUMENT.MD
* 575		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-008_UNRESERVE_DOCUMENT.MD
* 652		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-009_DELETE_FILE_FROM_DOCUMENT.MD
* 739		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-010_ENSURE_DOCUMENT_EXISTS.MD
* 813		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-011_UPLOAD_FILE_CONTENT_TO_FCS.MD
* 886		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-013_GET_DOCUMENT_FILES_METADATA.MD
* 965		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-014_DOWNLOAD_FILE_FROM_FCS.MD
* 1029		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-015_COMPLETE_FILE_DOWNLOAD_FROM_DOCUMENT.MD
* 1094		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-016_COMPLETE_FILE_UPLOAD_TO_DOCUMENT.MD
* 1170		\\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-017_ATTACH_FILE_TO_DOCUMENT.MD

---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-001_LOAD_JSON_DATA.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-002_SAVE_JSON_DATA.MD
---
---
**ID Případu Užití:** UC-002
**Název Případu Užití:** Uložení JSON dat do dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.4 (Aktualizováno pro volání UC-010, UC-007, UC-009, UC-016, UC-008)
**Datum Revize:** 2025-05-13
**Poskytuje:** Json Manager
---

### 1. Název Případu Užití
Uložení (nebo nahrazení) JSON dat jako souboru v 3DEXPERIENCE "Document" objektu.

### 2. Aktér(ři)
-   Primární aktér: `Widget` (nebo jiná komponenta volající `Json Manager`)

### 3. Cíl
Widget potřebuje uložit (nebo aktualizovat) JSON data jako soubor do konkrétního "Document" objektu v 3DEXPERIENCE. Pokud soubor se stejným názvem již existuje, má být jeho obsah nahrazen.

### 4. Předpoklady
-   Widget je autentizován v prostředí 3DEXPERIENCE (toto zajišťuje platforma a `Connector3DSpace.js`).
-   Utilita `JSON Manager` je dostupná a inicializovaná.
-   Widget zná název "Document" objektu (`documentTitle`), název souboru (`fileName`), pod kterým se mají data uložit, a má připravena JSON data (`jsonData`).
-   `Document Helper` je dostupný a nakonfigurovaný.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Json Manager`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`Widget`)                | Volá metodu `saveJsonToDocument` `Json Manageru` s parametry `documentTitle`, `fileName` a `jsonData` (JavaScript objekt).                                                                                |
| 2    | Systém (`Json Manager`)         | Validuje vstupní parametry. Pokud neplatné, přejde na scénář 7.A.                                                                                                                                         |
| 3    | Systém (`Json Manager`)         | Serializuje `jsonData` na textový řetězec `fileContent` (JSON formát). Pokud chyba při serializaci, přejde na scénář 7.B.                                                                                 |
| 4    | Systém (`Json Manager`)         | `<<invokes>>` UC-010 (Zajištění existence dokumentu) s parametrem `documentTitle`. Získá `docId` a `documentInfo`. Pokud chyba, přejde na scénář 7.C.                                                      |
| 5    | Systém (`Json Manager`)         | `<<invokes>>` UC-007 (Zamčení dokumentu) s parametrem `docId`. Pokud chyba (např. dokument je již zamčen někým jiným), přejde na scénář 7.D.                                                              |
| 6    | Systém (`Json Manager`)         | `<<invokes>>` UC-009 (Smazání souboru z dokumentu) s parametry `docId` a `fileName`. Pokud chyba (jiná než "soubor nenalezen"), přejde na scénář 7.E. (Nenalezení souboru je v tomto kontextu v pořádku).    |
| 7    | Systém (`Json Manager`)         | `<<invokes>>` UC-016 (Kompletní nahrání souboru do dokumentu) s parametry `docId`, `fileName` a `fileContent`. Získá `fileInfo` nahraného souboru. Pokud chyba, přejde na scénář 7.F.                       |
| 8    | Systém (`Json Manager`)         | `<<invokes>>` UC-008 (Odemčení dokumentu) s parametrem `docId`. Pokud chyba, přejde na scénář 7.G.                                                                                                         |
| 9    | Systém (`Json Manager`)         | Vrátí volající komponentě (`Widget`) potvrzení o úspěšném uložení (např. `true` nebo `fileInfo`).                                                                                                           |

### 6. Výsledek (Úspěch)
-   JSON data jsou úspěšně serializována a uložena do specifikovaného souboru v dokumentu v 3DEXPERIENCE.
-   Dokument je po operaci odemčen.
-   `Json Manager` vrátí potvrzení o úspěchu (např. `FileInfo` nahraného souboru).

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Neplatné vstupní parametry**
    *   **Spouštěcí podmínka:** V kroku 2, vstupní parametry nejsou platné.
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při serializaci JSON**
    *   **Spouštěcí podmínka:** V kroku 3, `jsonData` nelze serializovat.
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Chyba při zajištění existence dokumentu**
    *   **Spouštěcí podmínka:** V kroku 4, volání UC-010 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu z UC-010 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Chyba při zamčení dokumentu**
    *   **Spouštěcí podmínka:** V kroku 5, volání UC-007 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu z UC-007 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.E. Chyba při mazání souboru (jiná než "soubor nenalezen")**
    *   **Spouštěcí podmínka:** V kroku 6, volání UC-009 selže s chybou, která není "soubor nenalezen".
    *   **Reakce systému (`Json Manager`):** Pokusí se odemknout dokument pomocí UC-008 (pokud byl zamčen). Propaguje chybu z UC-009 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem. Dokument by měl být (pokud možno) odemčen.

*   **7.F. Chyba při nahrávání souboru**
    *   **Spouštěcí podmínka:** V kroku 7, volání UC-016 selže.
    *   **Reakce systému (`Json Manager`):** Pokusí se odemknout dokument pomocí UC-008 (pokud byl zamčen). Propaguje chybu z UC-016 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem. Dokument by měl být (pokud možno) odemčen.

*   **7.G. Chyba při odemykání dokumentu**
    *   **Spouštěcí podmínka:** V kroku 8, volání UC-008 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu volající komponentě. Soubor je již nahrán, ale dokument může zůstat zamčený. Hlavní operace (uložení dat) je považována za úspěšnou, ale je zde vedlejší problém.
    *   **Výsledek:** Případ užití končí s chybou při odemykání, ale data jsou uložena.

### 8. Poznámky
-   Tento UC orchestruje komplexní operaci zahrnující zajištění existence dokumentu, jeho zamčení, správu souborů a odemčení.
-   Krok 8 (odemčení) by měl být proveden i v případě, že kroky 6 nebo 7 selžou, pokud byl dokument úspěšně zamčen v kroku 5 (logika `finally` bloku). Toto je důležité pro robustnost.
-   Pokud soubor se stejným názvem již v dokumentu existuje, je jeho obsah přepsán.

### 9. Volané Případy Užití
-   UC-010: Zajištění existence dokumentu
-   UC-007: Zamčení dokumentu
-   UC-009: Smazání souboru z dokumentu
-   UC-016: Kompletní nahrání souboru do dokumentu
-   UC-008: Odemčení dokumentu

### 10. Použito v Případech Užití
-   N/A (Tento UC je volán přímo z `Widgetu`)

---


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-003_SEARCH_DOCUMENT_BY_TITLE.MD
---
---
**ID Případu Užití:** UC-003
**Název Případu Užití:** Vyhledání dokumentu podle názvu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Vyhledání "Document" objektu(ů) v 3DEXPERIENCE na základě zadaného názvu.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Získat informace o existujících "Document" objektech, které odpovídají zadanému názvu, včetně jejich `physicalid` (dále `docId`) a dalších relevantních metadat.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná název hledaného dokumentu (`documentTitle`).

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                              |
| :--- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `searchDocumentByTitle` `Document Helpera` s parametrem `documentTitle`.                                                                                       |
| 2    | Systém (`Document Helper`)         | Sestaví URL a parametry (`options`) pro `GET /resources/v1/modeler/documents/search` s `searchStr` nastaveným na `documentTitle`.                                             |
| 3    | Systém (`Document Helper`)         | Volá `Connector3DSpace.callService` s připravenými `options` (metoda GET, bez CSRF). Získá odpověď (`platformResponse`) od `Connector3DSpace.callService`.                   |
| 4    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) celou přijatou `platformResponse` (např. objekt obsahující `dataResp`, kde `dataResp.member` je pole výsledků).                    |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí odpověď z platformy (`platformResponse`), která obsahuje informace o všech nalezených dokumentech odpovídajících zadanému názvu.
-   Pokud žádný dokument nebyl nalezen, odpověď bude obsahovat prázdné pole výsledků (nebo ekvivalentní strukturu dle API).

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při komunikaci s platformou 3DEXPERIENCE**
    *   **Spouštěcí podmínka:** V kroku 3 hlavního scénáře, `Connector3DSpace.callService` selže (např. síťová chyba, chyba serveru 5xx, neautorizovaný přístup 401/403).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji (throw error) volající komponentě (`JSON Manager`).
    *   **Výsledek:** Případ užití končí neúspěchem. Volající komponenta obdrží chybový objekt.

*   **7.B. Neplatný formát odpovědi od platformy**
    *   **Spouštěcí podmínka:** V kroku 3, `Connector3DSpace.callService` vrátí odpověď v neočekávaném formátu (např. není to validní JSON, chybí očekávané klíče).
    *   **Reakce systému (`Document Helper`):** `Connector3DSpace.callService` může selhat při parsování odpovědi (pokud je `type: 'json'`), nebo `Document Helper` vrátí neočekávanou strukturu. Pokud chyba nastane v `Connector3DSpace`, je propagována jako 7.A. Pokud `Document Helper` obdrží neočekávanou strukturu, vrátí ji tak, jak je.
    *   **Výsledek:** Může vést k chybě v `Document Helperu` (propagované jako 7.A) nebo k chybě ve volající komponentě při zpracování odpovědi.

### 8. Poznámky
-   Tento případ užití se zaměřuje pouze na vyhledávání. Nevytváří ani nemodifikuje dokumenty.
-   Očekává se, že volající komponenta (`JSON Manager`) bude zodpovědná za interpretaci vrácené odpovědi, včetně extrakce `docId` a dalších potřebných informací z pole výsledků (např. z `response.dataResp.member`).
-   `Document Helper` neprovádí žádné mapování na `DocumentInfo` objekty; to je ponecháno na volající komponentě.
-   Pro vyhledávání se používá `GET` požadavek, takže CSRF token není vyžadován.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací a nevolá další UC z této sady).

### 10. Použito v Případech Užití
-   UC-001: Načtení JSON dat z dokumentu
-   UC-010: Zajištění existence dokumentu


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-004_GET_DOWNLOAD_TICKET_FOR_FILE.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-005_GET_UPLOAD_TICKET_FOR_FILE.MD
---
---
**ID Případu Užití:** UC-005
**Název Případu Užití:** Získání Upload Ticketu pro Soubor
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Získání potřebného ticketu od platformy 3DEXPERIENCE pro následné nahrání souboru na File Collaboration Server (FCS).

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`, např. v rámci UC-016)

### 3. Cíl
Úspěšně získat Upload Ticket, který obsahuje URL (`fcsUploadUrl`) pro nahrání souboru na FCS a `fileReceipt` pro pozdější připojení souboru k dokumentu.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná název souboru (`fileName`), pro který se má získat ticket.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `getUploadTicketForFile` `Document Helpera` s parametrem `fileName`.                                                                                                                          |
| 2    | Systém (`Document Helper`)         | Sestaví tělo požadavku (payload) obsahující `fileName`: `{"fileName": "your_file_name.ext"}`.                                                                                                             |
| 3    | Systém (`Document Helper`)         | Sestaví požadavek (options) na získání "Upload Ticket" (endpoint: `POST /resources/v1/modeler/documents/files/GetTicketForUpload`).                                                                         |
| 4    | Systém (`Document Helper`)         | Odešle sestavený požadavek (pomocí `Connector3DSpace.callService` s metodou `POST`, CSRF tokenem a payloadem). Získá `ticketResponse`. Pokud chyba, přejde na scénář 7.A.                                  |
| 5    | Systém (`Document Helper`)         | Zpracuje `ticketResponse`. Pokud ticket nebyl získán nebo je neplatný, přejde na scénář 7.B. Jinak extrahuje `ticketURL` (což je `fcsUploadUrl`) a `receipt` (což je `fileReceipt`).                       |
| 6    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `fcsUploadUrl` a `fileReceipt` (např. `UploadTicketInfo`).                                                                                    |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `UploadTicketInfo` obsahující `fcsUploadUrl` a `fileReceipt`.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba platformy / komunikace při získávání ticketu**
    *   **Spouštěcí podmínka:** V kroku 4, při odesílání požadavku na získání ticketu, dojde k chybě komunikace s platformou (např. síťová chyba, chyba serveru 5xx, neplatný CSRF).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Ticket nelze získat / Neplatná odpověď**
    *   **Spouštěcí podmínka:** V kroku 4 platforma vrátí chybu (např. 400 Bad Request kvůli chybějícímu `fileName`) nebo v kroku 5 `ticketResponse` neobsahuje platný ticket (`ticketURL` nebo `receipt`).
    *   **Reakce systému (`Document Helper`):** Propaguje chybu (nebo specifickou informaci) volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC se zabývá pouze získáním ticketu pro nahrání. Samotné nahrání na FCS je řešeno v UC-011 (Nahrání Obsahu Souboru na FCS) a připojení k dokumentu v UC-017 (Připojení Souboru k Dokumentu).
-   Endpoint pro získání Upload Ticketu je `POST /resources/v1/modeler/documents/files/GetTicketForUpload`.
-   Vyžaduje CSRF token a payload `{"fileName": "string"}`.

### 9. Volané Případy Užití
-   N/A

### 10. Použito v Případech Užití
-   UC-016: Kompletní nahrání souboru do dokumentu


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-006_CREATE_NEW_DOCUMENT.MD
---
---
**ID Případu Užití:** UC-006
**Název Případu Užití:** Vytvoření nového dokumentu
**Datum Vytvoření:** 2025-05-15
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Vytvoření nového "Document" objektu v 3DEXPERIENCE se zadaným názvem a případnými dalšími atributy.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`, např. v rámci UC-010)

### 3. Cíl
Úspěšně vytvořit nový "Document" objekt v 3DEXPERIENCE a získat informace o něm (včetně `docId` a dalších metadat jako `DocumentInfo`).

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta poskytuje název nového dokumentu (`documentTitle`).
-   Volitelně mohou být poskytnuty další atributy pro nový dokument (např. popis, politika).
-   Platforma umožňuje vytvoření "Document" objektu s daným názvem a atributy.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `createDocument` `Document Helpera` s parametrem `documentTitle` (a volitelně dalšími atributy).                                                                                             |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options, včetně těla požadavku JSON) pro vytvoření dokumentu. Tělo požadavku bude obsahovat minimálně `ds6w:label` (titulek) nastavený na `documentTitle` a případné další předané atributy. |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na vytvoření dokumentu (např. pomocí `Connector3DSpace.callService` s metodou POST na endpoint jako `/documents` a CSRF tokenem). Získá `createResponse`. Pokud chyba, přejde na scénář 7.A. |
| 4    | Systém (`Document Helper`)         | Zpracuje `createResponse`. Extrahujte metadata o nově vytvořeném dokumentu (např. `physicalid`, `type`, `name`, `ds6w:label` atd.) a sestaví objekt `DocumentInfo`.                                       |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt `DocumentInfo` nově vytvořeného dokumentu.                                                                                                                |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `DocumentInfo` obsahující metadata o nově vytvořeném "Document" objektu.
-   Nový dokument je vytvořen v 3DEXPERIENCE.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při vytváření dokumentu (obecná chyba komunikace, chyba serveru)**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku na vytvoření dokumentu, dojde k chybě komunikace s platformou nebo platforma vrátí chybu (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Neplatná data pro vytvoření / Duplicitní název (pokud není povolen)**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 400 Bad Request, 409 Conflict) kvůli neplatným vstupním atributům nebo proto, že dokument s daným názvem již existuje a není povolena duplicita.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nedostatečná oprávnění**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 401/403) indikující, že uživatel nemá oprávnění vytvořit dokument.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint a metoda (typicky POST) pro vytvoření dokumentu a struktura těla požadavku (JSON) závisí na specifikaci API. **Toto je třeba ověřit!**
-   Seznam povinných a volitelných atributů pro nový dokument (např. `ds6w:description`, `policy`, `cestamp`) by měl být specifikován podle potřeb a možností API.
-   Pro operace modifikující stav (jako je vytvoření) je typicky vyžadován CSRF token.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací).

### 10. Použito v Případech Užití
-   UC-010: Zajištění existence dokumentu

---


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-007_RESERVE_DOCUMENT.MD
---
---
**ID Případu Užití:** UC-007
**Název Případu Užití:** Rezervace dokumentu
**Datum Vytvoření:** 2025-05-15
**Autor:** KONR
**Verze:** 0.3 (Aktualizováno dle API: metoda PUT, přesný endpoint)
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Zamčení (rezervace) "Document" objektu v 3DEXPERIENCE, aby se zabránilo jeho úpravám jinými uživateli/procesy.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`).

### 3. Cíl
Úspěšně rezervovat specifikovaný "Document" objekt, aby volající komponenta mohla bezpečně provádět modifikace.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu, který má být zamčen.
-   Dokument s daným `docId` existuje.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                       |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `reserveDocument` (dříve `lockDocument`) `Document Helpera` s parametrem `docId`.                                                                                                       |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options, případně s prázdným tělem) pro rezervaci dokumentu (endpoint: `/resources/v1/modeler/documents/{docId}/reserve`).                                                       |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na rezervaci dokumentu (pomocí `Connector3DSpace.callService` s metodou `PUT` a CSRF tokenem). Získá `reserveResponse`. Pokud chyba, přejde na scénář 7.A, 7.B nebo 7.C. |
| 4    | Systém (`Document Helper`)         | Zpracuje `reserveResponse` (může být prázdná nebo obsahovat potvrzení).                                                                                                                             |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) potvrzení o úspěšné rezervaci (např. `true` nebo data z odpovědi platformy).                                                                             |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí potvrzení, že dokument byl úspěšně rezervován.
-   Dokument je nyní rezervovaný pro aktuálního uživatele/kontext.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Dokument neexistuje**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 404 Not Found), protože dokument s daným `docId` neexistuje.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Dokument je již zamčený (jiným uživatelem nebo kontextem)**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu indikující, že dokument je již rezervovaný (např. 409 Conflict nebo specifický chybový kód).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nedostatečná oprávnění k zamčení / Jiná chyba serveru**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 401/403, 5xx) indikující, že uživatel nemá oprávnění rezervovat dokument nebo došlo k jiné serverové chybě.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro rezervaci dokumentu je `/resources/v1/modeler/documents/{docId}/reserve`.
-   Používá se HTTP metoda `PUT`.
-   Pro tuto operaci je vyžadován CSRF token.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací).

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu

---


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-008_UNRESERVE_DOCUMENT.MD
---
---
**ID Případu Užití:** UC-008
**Název Případu Užití:** Uvolnění rezervace dokumentu
**Datum Vytvoření:** 2025-05-15
**Autor:** KONR
**Verze:** 0.2 (Aktualizováno dle API: unreserve, metoda PUT)
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Odemčení (uvolnění rezervace) dříve zamčeného "Document" objektu v 3DEXPERIENCE.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Úspěšně uvolnit rezervaci specifikovaného "Document" objektu, aby byl opět dostupný pro rezervaci a modifikace jinými uživateli/procesy.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu, který má být odemčen.
-   Dokument s daným `docId` existuje a je zamčený aktuálním uživatelem/kontextem.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                 |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `unreserveDocument` `Document Helpera` s parametrem `docId`.                                                                        |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options, případně s prázdným tělem) pro uvolnění rezervace dokumentu (endpoint: `/resources/v1/modeler/documents/{docId}/unreserve`). |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na uvolnění rezervace dokumentu (pomocí `Connector3DSpace.callService` s metodou `PUT` a CSRF tokenem). Získá `unreserveResponse`. Pokud chyba, přejde na scénář 7.A, 7.B nebo 7.C. |
| 4    | Systém (`Document Helper`)         | Zpracuje `unreserveResponse` (může být prázdná nebo obsahovat potvrzení).                                                                                                                                      |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) potvrzení o úspěšném uvolnění rezervace (např. `true` nebo data z odpovědi platformy).                                                                               |
                           |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí potvrzení, že rezervace dokumentu byla úspěšně uvolněna.
-   Dokument již není rezervovaný aktuálním uživatelem/kontextem.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Dokument neexistuje**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku, platforma vrátí chybu (např. 404 Not Found), protože dokument s daným `docId` neexistuje.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu z `Connector3DSpace.callService` a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Dokument není zamčený (nebo je zamčený jiným uživatelem/kontextem)**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku, platforma vrátí chybu indikující, že rezervaci dokumentu nelze uvolnit (např. není rezervovaný, nebo je rezervovaný jiným uživatelem - specifický chybový kód).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nedostatečná oprávnění k odemčení**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku, platforma vrátí chybu (např. 401/403) indikující, že uživatel nemá oprávnění uvolnit rezervaci dokumentu (typicky by měl mít možnost uvolnit jen ten, kdo rezervoval, nebo administrátor).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Jiná chyba serveru**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí jinou serverovou chybu (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro uvolnění rezervace je `/resources/v1/modeler/documents/{docId}/unreserve`.
-   Používá se HTTP metoda `PUT`.
-   Pro tuto operaci je vyžadován CSRF token.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací a nevolá další UC z této sady).

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-009_DELETE_FILE_FROM_DOCUMENT.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-010_ENSURE_DOCUMENT_EXISTS.MD
---
---
**ID Případu Užití:** UC-010
**Název Případu Užití:** Zajištění existence dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Zkontrolovat, zda "Document" objekt se zadaným názvem existuje v 3DEXPERIENCE. Pokud neexistuje, vytvoří ho.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Zajistit, že "Document" objekt se specifikovaným názvem existuje, a vrátit informace o něm (včetně `docId`), ať už byl nalezen nebo nově vytvořen.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná název dokumentu (`documentTitle`), jehož existenci chce zajistit.
-   Pokud má být dokument vytvořen, platforma umožňuje vytvoření "Document" objektu s daným názvem.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                              |
| :--- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `ensureDocumentExists` `Document Helpera` s parametrem `documentTitle`.                                                                                        |
| 2    | Systém (`Document Helper`)         | `<<invokes>>` UC-003 (Vyhledání dokumentu podle názvu) s parametrem `documentTitle`.                                                                                       |
| 3    | Systém (UC-003)                    | Poskytne výsledek vyhledávání (data o nalezeném dokumentu/dokumentech nebo informaci o nenalezení).                                                                         |
| 4    | Systém (`Document Helper`)         | Zkontroluje výsledek z UC-003.                                                                                                                                             |
| 5    | Systém (`Document Helper`)         | **Pokud byl dokument nalezen** (např. odpověď z UC-003 obsahuje alespoň jeden dokument): Extrahujte `docId` a `DocumentInfo` prvního nalezeného dokumentu. Přejděte na krok 8. |
| 6    | Systém (`Document Helper`)         | **Pokud dokument nebyl nalezen:** `<<invokes>>` UC-006 (Vytvoření nového dokumentu) s parametrem `documentTitle` (a případně dalšími defaultními atributy).                 |
| 7    | Systém (UC-006)                    | Poskytne data o nově vytvořeném dokumentu (včetně `docId` a `DocumentInfo`).                                                                                               |
| 8    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `docId` a `DocumentInfo` existujícího nebo nově vytvořeného dokumentu.                                          |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt obsahující `docId` a `DocumentInfo` dokumentu, který buď již existoval, nebo byl nově vytvořen.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při vyhledávání dokumentu (UC-003)**
    *   **Spouštěcí podmínka:** V kroku 2, volání UC-003 selže (např. chyba komunikace s platformou).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu propagovanou z UC-003 a propaguje ji dále volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při vytváření dokumentu (UC-006)**
    *   **Spouštěcí podmínka:** V kroku 6, volání UC-006 selže (např. nedostatečná oprávnění k vytvoření, název je neplatný, chyba serveru).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu propagovanou z UC-006 a propaguje ji dále volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nalezeno více dokumentů se stejným názvem**
    *   **Spouštěcí podmínka:** V kroku 5, UC-003 vrátí více dokumentů odpovídajících `documentTitle`.
    *   **Reakce systému (`Document Helper`):** Použije první nalezený dokument. (Toto chování by mělo být zdokumentováno v poznámkách nebo případně konfigurovatelné).
    *   **Výsledek:** Případ užití pokračuje úspěšně s použitím prvního nalezeného dokumentu.

### 8. Poznámky
-   Tento případ užití kombinuje logiku vyhledávání a vytváření.
-   Při vytváření nového dokumentu (UC-006) mohou být použity defaultní atributy nebo atributy předané volající komponentou (pokud by API `ensureDocumentExists` bylo rozšířeno).
-   Zpracování odpovědi z UC-003 (vyhledávání) a UC-006 (vytváření) pro extrakci `docId` a `DocumentInfo` je zodpovědností `Document Helpera` v rámci tohoto UC.

### 9. Volané Případy Užití
-   UC-003: Vyhledání dokumentu podle názvu
-   UC-006: Vytvoření nového dokumentu (podmíněně)

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-011_UPLOAD_FILE_CONTENT_TO_FCS.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-013_GET_DOCUMENT_FILES_METADATA.MD
---
---
**ID Případu Užití:** UC-013
**Název Případu Užití:** Získání metadat souborů dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Získání metadat (např. název, ID, velikost, kdo zamknul) o všech souborech asociovaných s daným "Document" objektem.

### 2. Aktér(ři)
-   Primární aktér: `Document Helper` (interně, např. v rámci UC-009) nebo jiná komponenta volající `Document Helper`.

### 3. Cíl
Získat seznam objektů s metadaty (`FileInfo`) pro všechny soubory v dokumentu.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu.
-   Dokument s daným `docId` existuje.
-   Uživatel má oprávnění číst metadata souborů daného dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`Document Helper` interně)  | Volá metodu `getDocumentFilesMetadata` `Document Helpera` s parametrem `docId`.                                                                                                                           |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options) na získání metadat souborů pro daný `docId` (endpoint: `GET /resources/v1/modeler/documents/{docId}/files`).                                                                  |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek (pomocí `Connector3DSpace.callService` s metodou `GET`, bez CSRF). Získá `filesMetadataResponse`. Pokud chyba, přejde na scénář 7.A, 7.B nebo 7.C.                               |
| 4    | Systém (`Document Helper`)         | Zpracuje `filesMetadataResponse`. Extrahujte seznam objektů s metadaty souborů (`FileInfoList`).                                                                                                          |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`Document Helper` interně) seznam `FileInfoList`.                                                                                                                              |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí seznam objektů s metadaty (`FileInfo`) pro všechny soubory v dokumentu.
-   Pokud dokument neobsahuje žádné soubory, vrátí prázdný seznam.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při komunikaci s platformou (obecná)**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku, dojde k chybě komunikace s platformou nebo platforma vrátí obecnou chybu serveru (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Dokument neexistuje**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 404 Not Found), protože dokument s daným `docId` neexistuje.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nedostatečná oprávnění**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 401/403) indikující, že uživatel nemá oprávnění číst metadata souborů daného dokumentu.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Neplatný formát odpovědi / Metadata nelze extrahovat**
    *   **Spouštěcí podmínka:** V kroku 4, `filesMetadataResponse` neobsahuje očekávanou strukturu nebo data pro extrakci seznamu souborů.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro získání metadat souborů je `GET /resources/v1/modeler/documents/{docId}/files`.
-   Používá se HTTP metoda `GET`.
-   Pro tuto operaci není vyžadován CSRF token.
-   Odpověď by měla obsahovat pole objektů, kde každý objekt reprezentuje soubor a obsahuje atributy jako `id` (fileId), `title` (fileName), `fileSize`, `locker` atd.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací).

### 10. Použito v Případech Užití
-   UC-009: Smazání souboru z dokumentu (bude volat tento UC pro získání fileId)
-   UC-004: Stažení souboru z dokumentu (mohl by volat tento UC pro získání fileId před získáním download ticketu, pokud API pro ticket vyžaduje fileId místo fileName)


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-014_DOWNLOAD_FILE_FROM_FCS.MD
---
---
**ID Případu Užití:** UC-014
**Název Případu Užití:** Stažení Souboru z FCS
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Stažení obsahu souboru z File Collaboration Server (FCS) pomocí URL získané z Download Ticketu.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Získat obsah souboru z FCS jako textový řetězec a případně metadata o tomto souboru (`FileInfo`).

### 4. Předpoklady
-   Volající komponenta má k dispozici platnou URL adresu pro stažení z FCS (`fcsUrl`), získanou z UC-004 (Získání Download Ticketu pro Soubor).
-   Ticket asociovaný s `fcsUrl` je stále platný.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `downloadFileFromFCS` `Document Helpera` s parametrem `fcsUrl`.                                                                                                                               |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options) na stažení obsahu souboru z `fcsUrl` (typicky HTTP GET).                                                                                                                       |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na stažení souboru na FCS server (např. pomocí `Connector3DSpace.callService` nebo přímým HTTP GET požadavkem). Získá `fileContentResponse`. Pokud chyba, přejde na scénář 7.A. |
| 4    | Systém (`Document Helper`)         | Zpracuje `fileContentResponse`. Extrahujte textový obsah souboru (`fileContent`) a metadata souboru (`FileInfo`, pokud jsou součástí odpovědi FCS).                                                        |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `fileContent` a `FileInfo`.                                                                                                                    |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt obsahující textový obsah staženého souboru a metadata o souboru (`FileInfo`).

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při stahování souboru z FCS**
    *   **Spouštěcí podmínka:** V kroku 3, při pokusu o stažení souboru z `fcsUrl`, dojde k chybě (např. neplatný ticket/URL, síťová chyba, chyba FCS serveru, soubor na FCS již neexistuje).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Neplatný formát odpovědi z FCS / Obsah nelze extrahovat**
    *   **Spouštěcí podmínka:** V kroku 4, `fileContentResponse` neobsahuje očekávaný textový obsah nebo metadata.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC se zabývá pouze samotným stažením souboru z FCS. Získání `fcsUrl` je řešeno v UC-004.
-   Stažení souboru probíhá z URL získané v ticketu (`fcsUrl`), což je přímá interakce s FCS serverem. Přesný mechanismus volání (např. přímý `fetch` vs. proxování přes `Connector3DSpace`) závisí na implementaci `Connector3DSpace.js` nebo jiné HTTP klientské logiky.
-   Pro HTTP GET na FCS typicky není vyžadován CSRF token.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací, i když interaguje s externím systémem FCS).

### 10. Použito v Případech Užití
-   UC-001: Načtení JSON dat z dokumentu (bude volat UC-004 a následně tento UC)


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-015_COMPLETE_FILE_DOWNLOAD_FROM_DOCUMENT.MD
---
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


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-016_COMPLETE_FILE_UPLOAD_TO_DOCUMENT.MD
---
---
**ID Případu Užití:** UC-016
**Název Případu Užití:** Kompletní nahrání souboru do dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Kompletní nahrání nového souboru (s daným názvem a obsahem) do existujícího "Document" objektu (identifikovaného `docId`). Orchestruje získání upload ticketu, nahrání na FCS a připojení souboru k dokumentu.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Úspěšně nahrát soubor do 3DEXPERIENCE a připojit ho k zadanému dokumentu.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu, kam má být soubor nahrán.
-   Volající komponenta poskytuje název souboru (`fileName`) a jeho obsah (`fileContent`).
-   Dokument s daným `docId` existuje a je odemčený (nebo se o zamykání/odemykání stará vyšší UC, např. UC-002).
-   Uživatel má oprávnění nahrávat soubory do daného dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `uploadFileToDocument` (nebo podobný název pro kompozitní operaci) `Document Helpera` s parametry `docId`, `fileName` a `fileContent`.                                                        |
| 2    | Systém (`Document Helper`)         | `<<invokes>>` UC-005 (Získání Upload Ticketu pro Soubor) s parametrem `fileName`. Získá `UploadTicketInfo` (obsahující `fcsUploadUrl` a `fileReceipt`). Pokud chyba, přejde na scénář 7.A.                  |
| 3    | Systém (`Document Helper`)         | `<<invokes>>` UC-012 (Nahrání Souboru na FCS) s parametry `fcsUploadUrl` a `fileContent`. Získá potvrzení o úspěšném nahrání na FCS. Pokud chyba, přejde na scénář 7.B.                                     |
| 4    | Systém (`Document Helper`)         | `<<invokes>>` UC-017 (Připojení Souboru k Dokumentu) s parametry `docId`, `fileName` a `fileReceipt` (získaný v kroku 2). Získá `FileInfo` připojeného souboru. Pokud chyba, přejde na scénář 7.C.       |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt `FileInfo` nově nahraného a připojeného souboru.                                                                                                          |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `FileInfo` popisující nově nahraný a k dokumentu připojený soubor.
-   Soubor je fyzicky uložen na FCS a metadata o něm jsou asociována s dokumentem v 3DEXPERIENCE.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při získávání Upload Ticketu**
    *   **Spouštěcí podmínka:** V kroku 2, volání UC-011 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-005 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při nahrávání souboru na FCS**
    *   **Spouštěcí podmínka:** V kroku 3, volání UC-012 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-012 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Chyba při připojování souboru k dokumentu**
    *   **Spouštěcí podmínka:** V kroku 4, volání UC-008 selže.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu z UC-017 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC je kompoziční a zapouzdřuje třífázový proces nahrávání souborů (ticket, upload na FCS, připojení k dokumentu).
-   Poskytuje jednodušší rozhraní pro běžný případ užití kompletního nahrání.
-   Granulární operace (UC-011, UC-012, UC-008) jsou stále dostupné pro pokročilejší scénáře.
-   Předpokládá se, že pokud soubor se stejným `fileName` již v dokumentu existuje, bude přepsán (nebo se o smazání starší verze postará volající UC, např. UC-002, který by předtím volal UC-009).

### 9. Volané Případy Užití
-   UC-005: Získání Upload Ticketu pro Soubor
-   UC-011: Získání Upload Ticketu pro Soubor
-   UC-017: Připojení Souboru k Dokumentu

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu


---


> \\3DEXPPROD\WEBAPPS\DYTUTILS\DOCS\03-USE CASES\DESCRIPTIONS\UC-017_ATTACH_FILE_TO_DOCUMENT.MD
---
---
**ID Případu Užití:** UC-017
**Název Případu Užití:** Připojení Souboru k Dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Připojení existujícího souboru (nahraného na FCS a identifikovaného pomocí `fileReceipt`) k "Document" objektu v 3DEXPERIENCE.

### 2. Aktér(ři)
-   Primární aktér: `Json Manager` (nebo jiná komponenta volající `Document Helper`, např. v rámci UC-016)

### 3. Cíl
Úspěšně asociovat soubor (který již existuje na FCS) s daným dokumentem a získat metadata o připojeném souboru (`FileInfo`).

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu.
-   Volající komponenta zná `fileName` (název, pod kterým bude soubor v dokumentu) a `fileReceipt` (identifikátor souboru na FCS získaný z UC-011).
-   Dokument s daným `docId` existuje a je odemčený (nebo se o zamykání/odemykání stará vyšší UC).
-   Uživatel má oprávnění připojovat soubory k danému dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`Json Manager`)             | Volá metodu `attachFileToDocument` `Document Helpera` s parametry `docId`, `fileName` a `fileReceipt`.                                                                                                    |
| 2    | Systém (`Document Helper`)         | Sestaví tělo požadavku (payload) obsahující `fileName` a `receipt` (hodnota `fileReceipt`).                                                                                                               |
| 3    | Systém (`Document Helper`)         | Sestaví požadavek (options) na připojení souboru (endpoint: `POST /resources/v1/modeler/documents/{docId}/files`).                                                                                        |
| 4    | Systém (`Document Helper`)         | Odešle sestavený požadavek (pomocí `Connector3DSpace.callService` s metodou `POST`, CSRF tokenem a payloadem). Získá `attachResponse`. Pokud chyba, přejde na scénář 7.A, 7.B nebo 7.C.                     |
| 5    | Systém (`Document Helper`)         | Zpracuje `attachResponse`. Extrahujte metadata připojeného souboru (`FileInfo`).                                                                                                                          |
| 6    | Systém (`Document Helper`)         | Vrátí volající komponentě (`Json Manager`) objekt `FileInfo`.                                                                                                                                             |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `FileInfo` popisující nově připojený soubor.
-   Soubor je asociován s dokumentem v 3DEXPERIENCE.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Dokument neexistuje / Receipt je neplatný**
    *   **Spouštěcí podmínka:** V kroku 4 platforma vrátí chybu (např. 404 Not Found, 400 Bad Request), protože dokument neexistuje nebo `fileReceipt` je neplatný/neznámý.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Nedostatečná oprávnění / Dokument je zamčený jiným uživatelem**
    *   **Spouštěcí podmínka:** V kroku 4 platforma vrátí chybu (např. 401/403, 409 Conflict) indikující, že uživatel nemá oprávnění nebo je dokument zamčený.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Jiná chyba serveru při připojování**
    *   **Spouštěcí podmínka:** V kroku 4 platforma vrátí jinou serverovou chybu (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro připojení souboru je `POST /resources/v1/modeler/documents/{docId}/files`.
-   Používá se HTTP metoda `POST` a je vyžadován CSRF token.
-   Tělo požadavku obsahuje `fileName` a `receipt`.

### 9. Volané Případy Užití
-   N/A

### 10. Použito v Případech Užití
-   UC-016: Kompletní nahrání souboru do dokumentu


---
