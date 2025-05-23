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
