---
**ID Případu Užití:** UC-012
**Název Případu Užití:** Finalizace Nahrání Souboru k Dokumentu
**Datum Vytvoření:** 2025-05-16
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Finalizace procesu nahrání souboru asociováním souboru (již nahraného na FCS) s konkrétním "Document" objektem v 3DEXPERIENCE pomocí "FCS receipt".

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta orchestrjící nahrání souboru, např. v rámci UC-002)

### 3. Cíl
Úspěšně zaregistrovat soubor (identifikovaný pomocí `fcsReceipt`) k danému `docId` s určeným `fileName` a `contentType`, a získat metadata (`FileInfo`) o nově asociovaném souboru.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu.
-   Volající komponenta poskytuje `fileName` (název, pod kterým bude soubor v dokumentu), `contentType` (MIME typ souboru) a platný `fcsReceipt` (získaný z UC-011).
-   Dokument s daným `docId` existuje a je odemčený (nebo se o zamykání/odemykání stará vyšší UC, např. UC-002).
-   Uživatel má oprávnění přidávat soubory k danému dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `finalizeFileUploadToDocument` `Document Helpera` s parametry `docId`, `fileName`, `contentType` a `fcsReceipt`.                                                                            |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options, včetně JSON těla) pro finalizaci nahrání. Tělo požadavku bude obsahovat `fileName` (jako `title`), `contentType` a `fcsReceipt` (jako `receipt`) pro endpoint `POST /resources/v1/modeler/documents/{docId}/files`. |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na finalizaci nahrání (pomocí `Connector3DSpace.callService` s metodou `POST` a CSRF tokenem). Získá `finalUploadResponse`. Pokud chyba, přejde na scénář 7.A, 7.B nebo 7.C.   |
| 4    | Systém (`Document Helper`)         | Zpracuje `finalUploadResponse`. Extrahujte metadata o nově asociovaném souboru (`FileInfo`). Pokud chyba nebo `FileInfo` nelze extrahovat, přejde na scénář 7.D.                                          |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt `FileInfo`.                                                                                                                                               |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `FileInfo` obsahující metadata o nově asociovaném souboru.
-   Soubor je nyní úspěšně přiřazen k dokumentu v 3DEXPERIENCE.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při komunikaci s platformou (obecná)**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku na finalizaci, dojde k chybě komunikace s platformou nebo platforma vrátí obecnou chybu serveru (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Dokument neexistuje / Nedostatečná oprávnění / Dokument zamčený**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 404 Not Found pro `docId`, 401/403 pro oprávnění, 409 Conflict pro zamčený dokument).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Neplatný FCS Receipt / Chyba serveru při zpracování receiptu**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 400 Bad Request) indikující, že `fcsReceipt` je neplatný nebo došlo k chybě při jeho zpracování.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Neplatný formát odpovědi / FileInfo nelze extrahovat**
    *   **Spouštěcí podmínka:** V kroku 4, `finalUploadResponse` neobsahuje očekávanou strukturu nebo data pro extrakci `FileInfo`.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro finalizaci nahrání souboru k dokumentu je `POST /resources/v1/modeler/documents/{docId}/files`.
-   Používá se HTTP metoda `POST`.
-   Pro tuto operaci je vyžadován CSRF token.
-   Tělo požadavku musí obsahovat minimálně `title` (název souboru) a `receipt` (FCS receipt). Další metadata jako `comments`, `fileType` mohou být také součástí.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací).

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu (bude volat tento UC jako třetí a poslední krok nahrávání)
