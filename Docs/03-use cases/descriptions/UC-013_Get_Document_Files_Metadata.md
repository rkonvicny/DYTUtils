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
