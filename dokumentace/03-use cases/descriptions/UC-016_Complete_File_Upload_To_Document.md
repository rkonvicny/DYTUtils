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
