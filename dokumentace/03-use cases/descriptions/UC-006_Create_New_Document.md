---
**ID Případu Užití:** UC-006
**Název Případu Užití:** Vytvoření nového dokumentu
**Datum Vytvoření:** 2025-05-15
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Vytvoření nového "Document" objektu v 3DEXPERIENCE se zadaným názvem a případnými dalšími atributy.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`, např. v rámci UC-010)

### 3. Cíl
Úspěšně vytvořit nový "Document" objekt v 3DEXPERIENCE a získat informace o něm (včetně `docId` a dalších metadat jako `DocumentInfo`).

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta poskytuje název nového dokumentu (`documentTitle`).
-   Volitelně mohou být poskytnuty další atributy pro nový dokument (např. popis, politika).
-   Platforma umožňuje vytvoření "Document" objektu s daným názvem a atributy.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `createDocument` `Document Helpera` s parametrem `documentTitle` (a volitelně dalšími atributy).                                                                                             |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options, včetně těla požadavku JSON) pro vytvoření dokumentu. Tělo požadavku bude obsahovat minimálně `ds6w:label` (titulek) nastavený na `documentTitle` a případné další předané atributy. |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na vytvoření dokumentu (např. pomocí `Connector3DSpace.callService` s metodou POST na endpoint jako `/documents` a CSRF tokenem). Získá `createResponse`. Pokud chyba, přejde na scénář 7.A. |
| 4    | Systém (`Document Helper`)         | Zpracuje `createResponse`. Extrahujte metadata o nově vytvořeném dokumentu (např. `physicalid`, `type`, `name`, `ds6w:label` atd.) a sestaví objekt `DocumentInfo`.                                       |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt `DocumentInfo` nově vytvořeného dokumentu.                                                                                                                |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt `DocumentInfo` obsahující metadata o nově vytvořeném "Document" objektu.
-   Nový dokument je vytvořen v 3DEXPERIENCE.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při vytváření dokumentu (obecná chyba komunikace, chyba serveru)**
    *   **Spouštěcí podmínka:** V kroku 3, při odesílání požadavku na vytvoření dokumentu, dojde k chybě komunikace s platformou nebo platforma vrátí chybu (např. 5xx).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Neplatná data pro vytvoření / Duplicitní název (pokud není povolen)**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 400 Bad Request, 409 Conflict) kvůli neplatným vstupním atributům nebo proto, že dokument s daným názvem již existuje a není povolena duplicita.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nedostatečná oprávnění**
    *   **Spouštěcí podmínka:** V kroku 3 platforma vrátí chybu (např. 401/403) indikující, že uživatel nemá oprávnění vytvořit dokument.
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Endpoint a metoda (typicky POST) pro vytvoření dokumentu a struktura těla požadavku (JSON) závisí na specifikaci API. **Toto je třeba ověřit!**
-   Seznam povinných a volitelných atributů pro nový dokument (např. `ds6w:description`, `policy`, `cestamp`) by měl být specifikován podle potřeb a možností API.
-   Pro operace modifikující stav (jako je vytvoření) je typicky vyžadován CSRF token.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací).

### 10. Použito v Případech Užití
-   UC-010: Zajištění existence dokumentu

---
