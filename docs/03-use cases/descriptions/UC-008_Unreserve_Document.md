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
