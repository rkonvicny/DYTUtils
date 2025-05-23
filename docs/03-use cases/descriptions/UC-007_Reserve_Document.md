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
