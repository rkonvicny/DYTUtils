---
**ID Případu Užití:** UC-014
**Název Případu Užití:** Stažení Souboru z FCS
**Datum Vytvoření:** 2025-05-13
**Autor:** KONR
**Verze:** 0.1
**Poskytuje:** Document Helper
---

### 1. Název Případu Užití
Stažení obsahu souboru z File Collaboration Server (FCS) pomocí URL získané z Download Ticketu.

### 2. Aktér(ři)
-   Primární aktér: `JSON Manager` (nebo jiná komponenta volající `Document Helper`)

### 3. Cíl
Získat obsah souboru z FCS jako textový řetězec a případně metadata o tomto souboru (`FileInfo`).

### 4. Předpoklady
-   Volající komponenta má k dispozici platnou URL adresu pro stažení z FCS (`fcsUrl`), získanou z UC-004 (Získání Download Ticketu pro Soubor).
-   Ticket asociovaný s `fcsUrl` je stále platný.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér / Systém (`Document Helper`) | Akce / Reakce                                                                                                                                                                                             |
| :--- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Aktér (`JSON Manager`)             | Volá metodu `downloadFileFromFCS` `Document Helpera` s parametrem `fcsUrl`.                                                                                                                               |
| 2    | Systém (`Document Helper`)         | Sestaví požadavek (options) na stažení obsahu souboru z `fcsUrl` (typicky HTTP GET).                                                                                                                       |
| 3    | Systém (`Document Helper`)         | Odešle sestavený požadavek na stažení souboru na FCS server (např. pomocí `Connector3DSpace.callService` nebo přímým HTTP GET požadavkem). Získá `fileContentResponse`. Pokud chyba, přejde na scénář 7.A. |
| 4    | Systém (`Document Helper`)         | Zpracuje `fileContentResponse`. Extrahujte textový obsah souboru (`fileContent`) a metadata souboru (`FileInfo`, pokud jsou součástí odpovědi FCS).                                                        |
| 5    | Systém (`Document Helper`)         | Vrátí volající komponentě (`JSON Manager`) objekt obsahující `fileContent` a `FileInfo`.                                                                                                                    |

### 6. Výsledek (Úspěch)
-   `Document Helper` vrátí objekt obsahující textový obsah staženého souboru a metadata o souboru (`FileInfo`).

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Chyba při stahování souboru z FCS**
    *   **Spouštěcí podmínka:** V kroku 3, při pokusu o stažení souboru z `fcsUrl`, dojde k chybě (např. neplatný ticket/URL, síťová chyba, chyba FCS serveru, soubor na FCS již neexistuje).
    *   **Reakce systému (`Document Helper`):** Zachytí chybu a propaguje ji volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Neplatný formát odpovědi z FCS / Obsah nelze extrahovat**
    *   **Spouštěcí podmínka:** V kroku 4, `fileContentResponse` neobsahuje očekávaný textový obsah nebo metadata.
    *   **Reakce systému (`Document Helper`):** Propaguje chybu volající komponentě.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento UC se zabývá pouze samotným stažením souboru z FCS. Získání `fcsUrl` je řešeno v UC-004.
-   Stažení souboru probíhá z URL získané v ticketu (`fcsUrl`), což je přímá interakce s FCS serverem. Přesný mechanismus volání (např. přímý `fetch` vs. proxování přes `Connector3DSpace`) závisí na implementaci `Connector3DSpace.js` nebo jiné HTTP klientské logiky.
-   Pro HTTP GET na FCS typicky není vyžadován CSRF token.

### 9. Volané Případy Užití
-   N/A (Tento UC je základní operací, i když interaguje s externím systémem FCS).

### 10. Použito v Případech Užití
-   UC-001: Načtení JSON dat z dokumentu (bude volat UC-004 a následně tento UC)
