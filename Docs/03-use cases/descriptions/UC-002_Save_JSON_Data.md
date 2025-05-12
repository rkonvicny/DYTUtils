---
**ID Případu Užití:** UC-002
**Název Případu Užití:** Uložení JSON dat do dokumentu
**Datum Vytvoření:** 2025-05-12
**Autor:** KONR
**Verze:** 0.1
---

### 1. Název Případu Užití
Uložení (nebo nahrazení) JSON dat jako souboru v 3DEXPERIENCE "Document" objektu.

### 2. Aktér(ři)
-   Primární aktér: Widget

### 3. Cíl
Widget potřebuje uložit (nebo aktualizovat) JSON data jako soubor do konkrétního "Document" objektu v 3DEXPERIENCE. Pokud soubor se stejným názvem již existuje, má být jeho obsah nahrazen.

### 4. Předpoklady
-   Widget je autentizován v prostředí 3DEXPERIENCE (toto zajišťuje platforma a `Connector3DSpace.js`).
-   Utilita `DYTUtils - Document Extension` je dostupná a inicializovaná.
-   Widget zná název "Document" objektu (`documentTitle`), název souboru (`fileName`), pod kterým se mají data uložit, a má připravena JSON data (`jsonData`).

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém                     | Akce / Reakce                                                                                                                               |
| :--- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Aktér (Widget)                     | Volá funkci `saveJsonToDocument` utility `DYTUtils - Document Extension` s parametry `documentTitle`, `fileName` a `jsonData`.                |
| 2    | Systém (Utilita Doc Extension)     | Validuje vstupní parametry.                                                                                                                 |
| 3    | Systém (Utilita Doc Extension)     | Volá `DocumentWebServiceHelper.ensureDocumentExists(documentTitle)`.                                                                        |
| 4    | Systém (Helper)                    | Zajistí existenci dokumentu (vytvoří, pokud neexistuje) a vrátí `docId`.                                                                    |
| 5    | Systém (Utilita Doc Extension)     | Volá `DocumentWebServiceHelper.lockDocument(docId)`.                                                                                        |
| 6    | Systém (Helper)                    | Zamkne dokument.                                                                                                                            |
| 7    | Systém (Utilita Doc Extension)     | Volá `DocumentWebServiceHelper.deleteFileByNameFromDocument(docId, fileName)` (pro zajištění nahrazení).                                    |
| 8    | Systém (Helper)                    | Smaže existující soubor(y) s daným `fileName` (pokud existují).                                                                             |
| 9    | Systém (Utilita Doc Extension)     | Serializuje `jsonData` na JSON string.                                                                                                      |
| 10   | Systém (Utilita Doc Extension)     | Volá `DocumentWebServiceHelper.uploadFileToDocument(docId, fileName, jsonString, "application/json")`.                                      |
| 11   | Systém (Helper)                    | Nahraje nový soubor na FCS a připojí metadata k dokumentu. Vrátí `FileInfo` nahraného souboru.                                               |
| 12   | Systém (Utilita Doc Extension)     | Volá `DocumentWebServiceHelper.unlockDocument(docId)`.                                                                                      |
| 13   | Systém (Helper)                    | Odemkne dokument.                                                                                                                           |
| 14   | Systém (Utilita Doc Extension)     | Resolvuje Promise s objektem `FileInfo` nahraného souboru Widgetu.                                                                          |

### 6. Výsledek (Úspěch)
-   JSON data jsou úspěšně serializována a uložena jako soubor do specifikovaného "Document" objektu.
-   Widget obdrží metadata (`FileInfo`) o nově nahraném souboru.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při zajištění existence dokumentu**
    *   **Spouštěcí podmínka:** V kroku 4 hlavního scénáře, `DocumentWebServiceHelper.ensureDocumentExists` selže (např. nelze vytvořit dokument, chyba při vyhledávání).
    *   **Reakce systému (Utilita Doc Extension):** Rejectuje Promise vrácenou Widgetu s příslušnou chybou.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při zamčení dokumentu**
    *   **Spouštěcí podmínka:** V kroku 6 hlavního scénáře, `DocumentWebServiceHelper.lockDocument` selže (např. dokument je již zamčen jiným uživatelem, nedostatečná oprávnění).
    *   **Reakce systému (Utilita Doc Extension):** Rejectuje Promise vrácenou Widgetu s příslušnou chybou.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Chyba při nahrávání souboru**
    *   **Spouštěcí podmínka:** V kroku 11 hlavního scénáře, `DocumentWebServiceHelper.uploadFileToDocument` selže (např. chyba FCS, chyba při připojování metadat).
    *   **Reakce systému (Utilita Doc Extension):** Pokusí se odemknout dokument voláním `DocumentWebServiceHelper.unlockDocument(docId)`. Rejectuje Promise vrácenou Widgetu s chybou z nahrávání.
    *   **Výsledek:** Případ užití končí neúspěchem. Dokument by měl být (pokud možno) odemčen.

*   **7.D. Chyba při odemčení dokumentu (po úspěšném nahrání)**
    *   **Spouštěcí podmínka:** V kroku 13 hlavního scénáře, `DocumentWebServiceHelper.unlockDocument` selže, ale nahrání souboru v kroku 11 bylo úspěšné.
    *   **Reakce systému (Utilita Doc Extension):** Resolvuje Promise s `FileInfo` (protože hlavní operace – uložení dat – byla úspěšná). Chyba při odemčení by měla být zaznamenána (logována), ale neměla by bránit vrácení úspěšného výsledku hlavní operace.
    *   **Výsledek:** Případ užití končí úspěchem (data jsou uložena), ale s potenciálním problémem (dokument zůstává zamčený).

*   **7.E. Chyba při komunikaci s platformou 3DEXPERIENCE (obecná)**
    *   **Spouštěcí podmínka:** Během kteréhokoli kroku zahrnujícího volání na `DocumentWebServiceHelper` nebo `Connector3DSpace.js` dojde k neočekávané chybě komunikace.
    *   **Reakce systému (Utilita Doc Extension):** Pokud je to možné (např. pokud byl dokument zamčen), pokusí se dokument odemknout. Rejectuje Promise vrácenou Widgetu s chybovým objektem.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento případ užití zajišťuje, že dokument existuje (vytvoří ho, pokud je potřeba).
-   Pokud soubor se stejným názvem již v dokumentu existuje, je jeho obsah přepsán (starý soubor je smazán a nahrán nový).
-   Utilita se stará o zamčení a odemčení dokumentu během operace.

### 9. Související Funkční Požadavky
-   `[^FR-001]` - Zajištění existence/Vytvoření nového 3DEXPERIENCE "Document" objektu
-   `[^FR-002]` - Nahrání JSON souboru do "Document" objektu
-   `[^FR-004]` - Zamčení (Rezervace) "Document" objektu pro modifikaci
-   `[^FR-005]` - Smazání souboru z "Document" objektu
-   `[^FR-006]` - Odemčení (Uvolnění rezervace) "Document" objektu
-   `[^FR-007]` - Vyhledání "Document" objektu podle názvu

---
<!-- Definice poznámek pod čarou pro FR -->
[^FR-001]: FR-001 - Zajištění existence/Vytvoření nového 3DEXPERIENCE "Document" objektu
[^FR-002]: FR-002 - Nahrání JSON souboru do "Document" objektu
[^FR-004]: FR-004 - Zamčení (Rezervace) "Document" objektu pro modifikaci
[^FR-005]: FR-005 - Smazání souboru z "Document" objektu
[^FR-006]: FR-006 - Odemčení (Uvolnění rezervace) "Document" objektu
[^FR-007]: FR-007 - Vyhledání "Document" objektu podle názvu
