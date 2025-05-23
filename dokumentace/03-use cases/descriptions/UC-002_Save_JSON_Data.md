---
**ID Případu Užití:** UC-002
**Název Případu Užití:** Uložení JSON dat do dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.4 (Aktualizováno pro volání UC-010, UC-007, UC-009, UC-016, UC-008)
**Datum Revize:** 2025-05-13
**Poskytuje:** Json Manager
---

### 1. Název Případu Užití
Uložení (nebo nahrazení) JSON dat jako souboru v 3DEXPERIENCE "Document" objektu.

### 2. Aktér(ři)
-   Primární aktér: `Widget` (nebo jiná komponenta volající `Json Manager`)

### 3. Cíl
Widget potřebuje uložit (nebo aktualizovat) JSON data jako soubor do konkrétního "Document" objektu v 3DEXPERIENCE. Pokud soubor se stejným názvem již existuje, má být jeho obsah nahrazen.

### 4. Předpoklady
-   Widget je autentizován v prostředí 3DEXPERIENCE (toto zajišťuje platforma a `Connector3DSpace.js`).
-   Utilita `JSON Manager` je dostupná a inicializovaná.
-   Widget zná název "Document" objektu (`documentTitle`), název souboru (`fileName`), pod kterým se mají data uložit, a má připravena JSON data (`jsonData`).
-   `Document Helper` je dostupný a nakonfigurovaný.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Json Manager`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`Widget`)                | Volá metodu `saveJsonToDocument` `Json Manageru` s parametry `documentTitle`, `fileName` a `jsonData` (JavaScript objekt).                                                                                |
| 2    | Systém (`Json Manager`)         | Validuje vstupní parametry. Pokud neplatné, přejde na scénář 7.A.                                                                                                                                         |
| 3    | Systém (`Json Manager`)         | Serializuje `jsonData` na textový řetězec `fileContent` (JSON formát). Pokud chyba při serializaci, přejde na scénář 7.B.                                                                                 |
| 4    | Systém (`Json Manager`)         | `<<invokes>>` UC-010 (Zajištění existence dokumentu) s parametrem `documentTitle`. Získá `docId` a `documentInfo`. Pokud chyba, přejde na scénář 7.C.                                                      |
| 5    | Systém (`Json Manager`)         | `<<invokes>>` UC-007 (Zamčení dokumentu) s parametrem `docId`. Pokud chyba (např. dokument je již zamčen někým jiným), přejde na scénář 7.D.                                                              |
| 6    | Systém (`Json Manager`)         | `<<invokes>>` UC-009 (Smazání souboru z dokumentu) s parametry `docId` a `fileName`. Pokud chyba (jiná než "soubor nenalezen"), přejde na scénář 7.E. (Nenalezení souboru je v tomto kontextu v pořádku).    |
| 7    | Systém (`Json Manager`)         | `<<invokes>>` UC-016 (Kompletní nahrání souboru do dokumentu) s parametry `docId`, `fileName` a `fileContent`. Získá `fileInfo` nahraného souboru. Pokud chyba, přejde na scénář 7.F.                       |
| 8    | Systém (`Json Manager`)         | `<<invokes>>` UC-008 (Odemčení dokumentu) s parametrem `docId`. Pokud chyba, přejde na scénář 7.G.                                                                                                         |
| 9    | Systém (`Json Manager`)         | Vrátí volající komponentě (`Widget`) potvrzení o úspěšném uložení (např. `true` nebo `fileInfo`).                                                                                                           |

### 6. Výsledek (Úspěch)
-   JSON data jsou úspěšně serializována a uložena do specifikovaného souboru v dokumentu v 3DEXPERIENCE.
-   Dokument je po operaci odemčen.
-   `Json Manager` vrátí potvrzení o úspěchu (např. `FileInfo` nahraného souboru).

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Neplatné vstupní parametry**
    *   **Spouštěcí podmínka:** V kroku 2, vstupní parametry nejsou platné.
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při serializaci JSON**
    *   **Spouštěcí podmínka:** V kroku 3, `jsonData` nelze serializovat.
    *   **Reakce systému (`Json Manager`):** Vrátí chybovou zprávu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Chyba při zajištění existence dokumentu**
    *   **Spouštěcí podmínka:** V kroku 4, volání UC-010 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu z UC-010 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Chyba při zamčení dokumentu**
    *   **Spouštěcí podmínka:** V kroku 5, volání UC-007 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu z UC-007 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.E. Chyba při mazání souboru (jiná než "soubor nenalezen")**
    *   **Spouštěcí podmínka:** V kroku 6, volání UC-009 selže s chybou, která není "soubor nenalezen".
    *   **Reakce systému (`Json Manager`):** Pokusí se odemknout dokument pomocí UC-008 (pokud byl zamčen). Propaguje chybu z UC-009 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem. Dokument by měl být (pokud možno) odemčen.

*   **7.F. Chyba při nahrávání souboru**
    *   **Spouštěcí podmínka:** V kroku 7, volání UC-016 selže.
    *   **Reakce systému (`Json Manager`):** Pokusí se odemknout dokument pomocí UC-008 (pokud byl zamčen). Propaguje chybu z UC-016 volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem. Dokument by měl být (pokud možno) odemčen.

*   **7.G. Chyba při odemykání dokumentu**
    *   **Spouštěcí podmínka:** V kroku 8, volání UC-008 selže.
    *   **Reakce systému (`Json Manager`):** Propaguje chybu volající komponentě. Soubor je již nahrán, ale dokument může zůstat zamčený. Hlavní operace (uložení dat) je považována za úspěšnou, ale je zde vedlejší problém.
    *   **Výsledek:** Případ užití končí s chybou při odemykání, ale data jsou uložena.

### 8. Poznámky
-   Tento UC orchestruje komplexní operaci zahrnující zajištění existence dokumentu, jeho zamčení, správu souborů a odemčení.
-   Krok 8 (odemčení) by měl být proveden i v případě, že kroky 6 nebo 7 selžou, pokud byl dokument úspěšně zamčen v kroku 5 (logika `finally` bloku). Toto je důležité pro robustnost.
-   Pokud soubor se stejným názvem již v dokumentu existuje, je jeho obsah přepsán.

### 9. Volané Případy Užití
-   UC-010: Zajištění existence dokumentu
-   UC-007: Zamčení dokumentu
-   UC-009: Smazání souboru z dokumentu
-   UC-016: Kompletní nahrání souboru do dokumentu
-   UC-008: Odemčení dokumentu

### 10. Použito v Případech Užití
-   N/A (Tento UC je volán přímo z `Widgetu`)

---
