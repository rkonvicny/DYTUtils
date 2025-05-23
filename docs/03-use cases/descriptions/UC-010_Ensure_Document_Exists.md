---
**ID Případu Užití:** UC-010
**Název Případu Užití:** Zajištění existence dokumentu
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Zkontrolovat, zda "Document" objekt se zadaným názvem existuje v 3DEXPERIENCE. Pokud neexistuje, vytvoří ho.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Zajistit, že "Document" objekt se specifikovaným názvem existuje, a vrátit informace o něm (včetně `docId`), ať už byl nalezen nebo nově vytvořen.

### 4. Předpoklady
-   Volající komponenta je autentizována v prostředí 3DEXPERIENCE.
-   Volající komponenta zná název dokumentu (`documentTitle`), jehož existenci chce zajistit.
-   Pokud má být dokument vytvořen, platforma umožňuje vytvoření "Document" objektu s daným názvem.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                              |
| :--- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `ensureDocumentExists` `Document Helpera` s parametrem `documentTitle`.                                                                                        |
| 2    | Systém (`Document Helper`)         | `<<invokes>>` UC-003 (Vyhledání dokumentu podle názvu) s parametrem `documentTitle`.                                                                                       |
| 3    | Systém (UC-003)                    | Poskytne výsledek vyhledávání (data o nalezeném dokumentu/dokumentech nebo informaci o nenalezení).                                                                         |
| 4    | Systém (`Document Helper`)         | Zkontroluje výsledek z UC-003.                                                                                                                                             |
| 5    | Systém (`Document Helper`)         | **Pokud byl dokument nalezen** (např. odpověď z UC-003 obsahuje alespoň jeden dokument): Extrahujte `docId` a `DocumentInfo` prvního nalezeného dokumentu. Přejděte na krok 8. |
| 6    | Systém (`Document Helper`)         | **Pokud dokument nebyl nalezen:** `<<invokes>>` UC-006 (Vytvoření nového dokumentu) s parametrem `documentTitle` (a případně dalšími defaultními atributy).                 |
| 7    | Systém (UC-006)                    | Poskytne data o nově vytvořeném dokumentu (včetně `docId` a `DocumentInfo`).                                                                                               |
| 8    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `docId` a `DocumentInfo` existujícího nebo nově vytvořeného dokumentu.                                          |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt obsahující `docId` a `DocumentInfo` dokumentu, který buď již existoval, nebo byl nově vytvořen.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při vyhledávání dokumentu (UC-003)**
    *   **Spouštěcí podmínka:** V kroku 2, volání UC-003 selže (např. chyba komunikace s platformou).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu propagovanou z UC-003 a propaguje ji dále volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Chyba při vytváření dokumentu (UC-006)**
    *   **Spouštěcí podmínka:** V kroku 6, volání UC-006 selže (např. nedostatečná oprávnění k vytvoření, název je neplatný, chyba serveru).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu propagovanou z UC-006 a propaguje ji dále volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Nalezeno více dokumentů se stejným názvem**
    *   **Spouštěcí podmínka:** V kroku 5, UC-003 vrátí více dokumentů odpovídajících `documentTitle`.
    *   **Reakce systému (`Document Helper`):** Použije první nalezený dokument. (Toto chování by mělo být zdokumentováno v poznámkách nebo případně konfigurovatelné).
    *   **Výsledek:** Případ užití pokračuje úspěšně s použitím prvního nalezeného dokumentu.

### 8. Poznámky
-   Tento případ užití kombinuje logiku vyhledávání a vytváření.
-   Při vytváření nového dokumentu (UC-006) mohou být použity defaultní atributy nebo atributy předané volající komponentou (pokud by API `ensureDocumentExists` bylo rozšířeno).
-   Zpracování odpovědi z UC-003 (vyhledávání) a UC-006 (vytváření) pro extrakci `docId` a `DocumentInfo` je zodpovědností `Document Helpera` v rámci tohoto UC.

### 9. Volané Případy Užití
-   UC-003: Vyhledání dokumentu podle názvu
-   UC-006: Vytvoření nového dokumentu (podmíněně)

### 10. Použito v Případech Užití
-   UC-002: Uložení JSON dat do dokumentu
