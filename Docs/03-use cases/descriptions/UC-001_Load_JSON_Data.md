---
**ID Případu Užití:** UC-001
**Název Případu Užití:** Načtení JSON dat z dokumentu
**Datum Vytvoření:** 2025-05-12
**Autor:** KONR
**Verze:** 0.2 (Formát akce-reakce)
---

### 1. Název Případu Užití
Načtení JSON dat z konkrétního souboru v 3DEXPERIENCE "Document" objektu.

### 2. Aktér(ři)
-   Primární aktér: Widget

### 3. Cíl
Widget potřebuje načíst a deserializovat obsah JSON souboru uloženého v konkrétním "Document" objektu v 3DEXPERIENCE, aby mohl tato data dále zpracovat (např. zobrazit konfiguraci, načíst data pro vizualizaci).

### 4. Předpoklady
-   Widget je autentizován v prostředí 3DEXPERIENCE (toto zajišťuje platforma a `Connector3DSpace.js`).
-   Utilita `DYTUtils - Document Extension` je dostupná a inicializovaná.
-   Widget zná název "Document" objektu (`documentTitle`) a název souboru (`fileName`) v něm.

### 5. Hlavní úspěšný scénář (Akce - Reakce)

| Krok | Aktér (Widget) / Systém (Utilita) | Akce / Reakce                                                                                                                               |
| :--- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Aktér (Widget)                    | Volá funkci `loadJsonFromDocument` utility `DYTUtils - Document Extension` s parametry `documentTitle` a `fileName`.                        |
| 2    | Systém (Utilita Doc Extension)    | Validuje vstupní parametry.                                                                                                                 |
| 3    | Systém (Utilita Doc Extension)    | Volá `DocumentWebServiceHelper.ensureDocumentExists(documentTitle)`.                                                                        |
| 4    | Systém (Helper)                   | Vyhledá dokument. Pokud existuje, vrátí `docId` a `DocumentInfo`.                                                                           |
| 5    | Systém (Utilita Doc Extension)    | Pokud dokument existuje, volá `DocumentWebServiceHelper.downloadFileContentByName(docId, fileName)`.                                          |
| 6    | Systém (Helper)                   | Vyhledá soubor, získá ticket, stáhne obsah z FCS. Vrátí obsah souboru (string) a `FileInfo`.                                                 |
| 7    | Systém (Utilita Doc Extension)    | Deserializuje stažený obsah souboru na JSON objekt.                                                                                         |
| 8    | Systém (Utilita Doc Extension)    | Sestaví objekt `DownloadedJson` (obsahující deserializovaná data, `FileInfo` a `DocumentInfo`) a resolvuje Promise s tímto objektem Widgetu. |

### 6. Výsledek (Úspěch)
-   JSON data z požadovaného souboru jsou úspěšně načtena, deserializována a vrácena Widgetu ve formě objektu `DownloadedJson`.
-   Widget může nyní s těmito daty pracovat.

### 7. Rozšíření (Alternativní scénáře / Chybové stavy)

*   **7.A. Dokument neexistuje**
    *   **Spouštěcí podmínka:** V kroku 4 hlavního scénáře, `DocumentWebServiceHelper.ensureDocumentExists` zjistí, že dokument neexistuje.
    *   **Reakce systému (Utilita Doc Extension):** Rejectuje Promise vrácenou Widgetu s chybovou zprávou (např. "Dokument '{documentTitle}' nenalezen.").
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.B. Soubor v dokumentu neexistuje**
    *   **Spouštěcí podmínka:** V kroku 6 hlavního scénáře, `DocumentWebServiceHelper.downloadFileContentByName` zjistí, že soubor neexistuje (např. vrátí `null`).
    *   **Reakce systému (Utilita Doc Extension):** Rejectuje Promise vrácenou Widgetu s chybovou zprávou (např. "Soubor '{fileName}' v dokumentu '{documentTitle}' nenalezen.").
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.C. Obsah souboru není validní JSON**
    *   **Spouštěcí podmínka:** V kroku 7 hlavního scénáře, při pokusu o deserializaci obsahu souboru dojde k chybě.
    *   **Reakce systému (Utilita Doc Extension):** Zachytí chybu parsování a rejectuje Promise vrácenou Widgetu s chybovou zprávou (např. "Obsah souboru '{fileName}' není validní JSON.").
    *   **Výsledek:** Případ užití končí neúspěchem.

*   **7.D. Chyba při komunikaci s platformou 3DEXPERIENCE**
    *   **Spouštěcí podmínka:** Během kteréhokoli kroku zahrnujícího volání na `DocumentWebServiceHelper` nebo `Connector3DSpace.js` dojde k chybě komunikace.
    *   **Reakce systému (Utilita Doc Extension):** Přijme chybový objekt od `DocumentWebServiceHelper` a rejectuje Promise vrácenou Widgetu s tímto chybovým objektem.
    *   **Výsledek:** Případ užití končí neúspěchem.

### 8. Poznámky
-   Tento případ užití se zaměřuje na čtení existujících dat. Nevytváří nový dokument, pokud neexistuje.
-   Předpokládá se, že Widget má oprávnění číst daný dokument a soubor. Řešení oprávnění je na straně platformy 3DEXPERIENCE.
