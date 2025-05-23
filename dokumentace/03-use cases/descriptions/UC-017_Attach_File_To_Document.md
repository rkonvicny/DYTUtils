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
