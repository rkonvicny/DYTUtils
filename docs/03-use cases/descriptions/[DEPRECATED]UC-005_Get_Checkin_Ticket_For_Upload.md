---
**ID Případu Užití:** UC-005
**Název Případu Užití:** Získání Checkin Ticketu pro Nahrání Souboru
**Datum Vytvoření:** 2025-05-16
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Získání potřebného ticketu a URL od platformy 3DEXPERIENCE pro nahrání souboru na File Collaboration Server (FCS) v rámci procesu přidání souboru k dokumentu.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta orchestrjící nahrání souboru, např. v rámci UC-002)

### 3. Cíl
Úspěšně získat Checkin Ticket, který umožní následné nahrání obsahu souboru na FCS.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná `docId` (physicalid) "Document" objektu, ke kterému se bude soubor nahrávat.
-   Dokument s daným `docId` existuje.
-   Uživatel má oprávnění nahrávat soubory k danému dokumentu.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `getCheckinTicketForUpload` `Document Helpera` s parametrem `docId`.                                                                                                                          |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options) na získání "Checkin Ticketu" pro daný `docId` (endpoint: `PUT /resources/v1/modeler/documents/{docId}/files/CheckinTicket`).                                                   |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na získání ticketu (pomocí `Connector3DSpace.callService` s metodou `PUT` a CSRF tokenem). Získá `checkinTicketResponse`. Pokud chyba, přejde na scénář 7.A, 7.B nebo 7.C.        |
| 4    | Systém (`Document Helper`)         | Zpracuje `checkinTicketResponse`. Pokud ticket nebyl získán nebo je neplatný, přejde na scénář 7.D. Jinak extrahuje `fcsUploadUrl`, `ticketParamName` a `ticketValue` z odpovědi.                           |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `fcsUploadUrl`, `ticketParamName` a `ticketValue`.                                                                                           |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt obsahující `fcsUploadUrl`, `ticketParamName` a `ticketValue`, které jsou potřebné pro nahrání souboru na FCS.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při komunikaci s platformou (obecná)**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku na získání ticketu, dojde k chybě komunikace s platformou nebo platforma vrátí obecnou chybu serveru (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Dokument neexistuje**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 404 Not Found), protože dokument s daným `docId` neexistuje.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nedostatečná oprávnění k získání ticketu**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 401/403) indikující, že uživatel nemá oprávnění získat ticket pro daný dokument.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Neplatný formát odpovědi / Ticket nelze extrahovat**
    *   **Spouštěcí podmínka:** V kroku 4, `checkinTicketResponse` neobsahuje očekávanou strukturu nebo data pro extrakci ticketu a URL.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint pro získání Checkin Ticketu je `/resources/v1/modeler/documents/{docId}/files/CheckinTicket`.
-   Používá se HTTP metoda `PUT`.
-   Pro tuto operaci je vyžadován CSRF token.
-   Tento UC se zabývá pouze získáním ticketu, nikoliv samotným nahráním souboru na FCS.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací).

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu (bude volat tento UC jako první krok nahrávání)
