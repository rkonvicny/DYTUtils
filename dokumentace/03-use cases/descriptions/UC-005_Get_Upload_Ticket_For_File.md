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
