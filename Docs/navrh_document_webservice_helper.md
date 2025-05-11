---
**Název Dokumentu:** Návrh systému - DYTUtils - DocumentWebServiceHelper
**Datum Vytvoření:** 2025-05-11
**Autor:** KONR
**Verze:** 0.1
---
<div style="text-align:center; page-break-after:always;">

# Návrh systému

## DYTUtils - DocumentWebServiceHelper

<br>
<br>
<br>

**Verze:** 0.1

**Datum:** 2025-05-11

**Autor:** KONR

</div>
---
## Obsah

- [Návrh systému](#návrh-systému)
  - [DYTUtils - DocumentWebServiceHelper](#dytutils---documentwebservicehelper)
  - [](#)
  - [Obsah](#obsah)
  - [1. Úvod a účel](#1-úvod-a-účel)
  - [2. Návrh rozhraní (API)](#2-návrh-rozhraní-api)
    - [2.1. Práce s dokumenty](#21-práce-s-dokumenty)
    - [2.2. Práce se soubory](#22-práce-se-soubory)
  - [3. Datové struktury](#3-datové-struktury)
  - [4. Zpracování chyb](#4-zpracování-chyb)
  - [5. Otevřené otázky](#5-otevřené-otázky)

---

## 1. Úvod a účel

Tento dokument popisuje návrh pomocné utility `DYTUtils - DocumentWebServiceHelper` (dále jen "Helper"). Účelem Helperu je poskytnout sadu granulárních funkcí pro přímou interakci s 3DEXPERIENCE Document Web Services a File Collaboration Server (FCS). Helper zapouzdřuje jednotlivé kroky potřebné pro operace s dokumenty a soubory, jako je vytváření, vyhledávání, zamčení/odemčení dokumentů a nahrávání/stahování/mazání souborů.

`DYTUtils - DocumentWebServiceHelper` bude interně využívat existující modul `Connector3DSpace.js` pro veškerou nízkoúrovňovou komunikaci s platformou 3DEXPERIENCE.

Hlavní utilita `DYTUtils - Document Extension` (definovaná v `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Docs\navrh_systemu.md`) bude využívat tento Helper k orchestraci komplexnějších, vysokoúrovňových operací, jako je načtení nebo uložení celého JSON objektu do/z dokumentu.

Cílem Helperu je:
- Implementovat jednotlivé funkční požadavky (`[^FR-001]` až `[^FR-007]`) jako samostatné, znovupoužitelné funkce.
- Poskytnout jasné a dobře definované rozhraní pro práci s dokumenty a soubory na nižší úrovni abstrakce než `DYTUtils - Document Extension`.
- Zjednodušit vývoj `DYTUtils - Document Extension` tím, že komplexitu interakce s WebAPI přesune do tohoto specializovaného modulu.

---

## 2. Návrh rozhraní (API)

Následující funkce budou poskytovány modulem `DYTUtils - DocumentWebServiceHelper`. Všechny funkce budou vracet `Promise`.

### 2.1. Práce s dokumenty

*   `ensureDocumentExists(documentTitle: string): Promise<DocumentInfo>`
    *   **Popis:** Zajišťuje existenci "Document" objektu se zadaným `documentTitle`. Pokud dokument existuje (první nalezený), vrátí jeho `DocumentInfo`. Pokud neexistuje, vytvoří nový "Document" objekt se zadaným titulkem a vrátí jeho `DocumentInfo`.
    *   **Implementuje:** `[^FR-001]` (a interně využívá logiku z `[^FR-007]`)
    *   **Vstup:**
        *   `documentTitle` (string): Požadovaný titulek dokumentu.
    *   **Výstup (Promise resolvuje na):** `DocumentInfo` objekt (viz `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Docs\navrh_systemu.md`, sekce 4.1).

*   `searchDocumentByTitle(documentTitle: string): Promise<DocumentInfo[] | null>`
    *   **Popis:** Vyhledá "Document" objekty, jejichž titulek odpovídá zadanému `documentTitle`.
    *   **Implementuje:** `[^FR-007]`
    *   **Vstup:**
        *   `documentTitle` (string): Titulek dokumentu k vyhledání.
    *   **Výstup (Promise resolvuje na):** Pole `DocumentInfo` objektů, nebo `null` (případně prázdné pole), pokud žádný dokument nebyl nalezen.

*   `lockDocument(docId: string, comment?: string): Promise<void>`
    *   **Popis:** Zamkne (rezervuje) "Document" objekt se zadaným `docId`.
    *   **Implementuje:** `[^FR-004]`
    *   **Vstup:**
        *   `docId` (string): ID dokumentu k zamčení.
        *   `comment` (string, volitelný): Komentář k zamčení.
    *   **Výstup (Promise resolvuje na):** `void` (v případě úspěchu).

*   `unlockDocument(docId: string): Promise<void>`
    *   **Popis:** Odemkne (uvolní rezervaci) "Document" objekt se zadaným `docId`.
    *   **Implementuje:** `[^FR-006]`
    *   **Vstup:**
        *   `docId` (string): ID dokumentu k odemčení.
    *   **Výstup (Promise resolvuje na):** `void` (v případě úspěchu).

### 2.2. Práce se soubory

*   `uploadFileToDocument(docId: string, fileName: string, fileContent: string, contentType: string): Promise<FileInfo>`
    *   **Popis:** Nahraje obsah (`fileContent`) jako nový soubor se zadaným `fileName` a `contentType` do "Document" objektu identifikovaného `docId`. Předpokládá, že dokument je již zamčený.
    *   **Implementuje:** `[^FR-002]`
    *   **Vstup:**
        *   `docId` (string): ID dokumentu, do kterého se nahrává.
        *   `fileName` (string): Název vytvářeného souboru.
        *   `fileContent` (string): Obsah souboru.
        *   `contentType` (string): MIME typ obsahu (např. "application/json").
        *   `comment` (string, volitelný): Komentář k souboru.
    *   **Výstup (Promise resolvuje na):** `FileInfo` objekt (viz `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Docs\navrh_systemu.md`, sekce 4.2) popisující nahraný soubor.

*   `deleteFileByNameFromDocument(docId: string, fileName: string): Promise<void>`
    *   **Popis:** Smaže všechny soubory se zadaným `fileName` z "Document" objektu identifikovaného `docId`. Předpokládá, že dokument je již zamčený. Interně nejprve vyhledá `fileId` (nebo `fileIds`) odpovídající `fileName`.
    *   **Implementuje:** `[^FR-005]`
    *   **Vstup:**
        *   `docId` (string): ID dokumentu, ze kterého se maže.
        *   `fileName` (string): Název souboru k smazání.
    *   **Výstup (Promise resolvuje na):** `void` (v případě úspěchu).

*   `downloadFileContentByName(docId: string, fileName: string): Promise<{ content: string, fileInfo: FileInfo } | null>`
    *   **Popis:** Stáhne obsah souboru se zadaným `fileName` (aktuální/první nalezenou verzi) z "Document" objektu identifikovaného `docId`.
    *   **Implementuje:** `[^FR-003]`
    *   **Vstup:**
        *   `docId` (string): ID dokumentu, ze kterého se stahuje.
        *   `fileName` (string): Název souboru ke stažení.
    *   **Výstup (Promise resolvuje na):** Objekt obsahující `content` (string - obsah souboru) a `fileInfo` (`FileInfo` objekt popisující stažený soubor), nebo `null`, pokud soubor není nalezen.

## 3. Datové struktury

`DYTUtils - DocumentWebServiceHelper` bude primárně pracovat s následujícími datovými strukturami, které jsou definovány v hlavním návrhu systému (`\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Docs\navrh_systemu.md`, sekce 4):

-   **`DocumentInfo`**: Reprezentuje metadata "Document" objektu.
-   **`FileInfo`**: Reprezentuje metadata souboru připojeného k "Document" objektu.

Výstup funkce `downloadFileContentByName` bude specifický objekt obsahující jak obsah souboru, tak jeho `FileInfo` (jak je definováno v sekci 2.2 tohoto dokumentu).

V této fázi se nepředpokládá potřeba dalších specifických datových struktur pouze pro tento Helper. Pokud by se taková potřeba objevila během detailnějšího návrhu nebo implementace, bude tato sekce doplněna.

## 4. Zpracování chyb

-   Všechny funkce Helperu budou vracet `Promise`. V případě chyby bude Promise `reject`-ována.
-   Helper bude pro chybové objekty primárně využívat (předávat dál) formát chybových objektů poskytovaný knihovnou `Connector3DSpace.js`. To zajistí konzistenci v chybovém hlášení.
-   Pokud Helper generuje vlastní chybu (např. validace vstupů před voláním `Connector3DSpace.js`), měl by se snažit formátovat chybový objekt podobně, aby byl co nejvíce kompatibilní.
-   Helper se nebude snažit chyby "maskovat" nebo vracet `null` tam, kde je chyba neočekávaná (např. selhání sítě, neočekávaná chyba serveru). Výjimkou může být scénář "nenalezeno" (např. `searchDocumentByTitle` může vrátit `null` nebo prázdné pole, `downloadFileContentByName` může vrátit `null`), což by mělo být jasně dokumentováno u každé funkce.
-   V případě vícekrokových operací (např. `ensureDocumentExists`, které interně volá vyhledání a pak případně vytvoření), pokud dojde k chybě v jednom z kroků, celá operace selže a vrátí chybu. Helper se nebude pokoušet o komplexní "rollback" logiku, pokud to není explicitně vyžadováno a definováno.

## 5. Otevřené otázky

-   **[ROZHODNUTO] Detailní parametry pro vytvoření dokumentu (`ensureDocumentExists`):** (Viz `[^FR-001]`)
    -   Při vytváření nového dokumentu se explicitně nastaví pouze `title`.
    -   Atribut `description` se nebude nastavovat.
    -   Ostatní atributy jako `policy`, `collabspace` atd. si doplní platforma 3DEXPERIENCE sama (použijí se výchozí hodnoty).
    -   Tyto hodnoty není třeba v Helperu konfigurovat.
-   **[ROZHODNUTO] Zpracování více souborů se stejným názvem:** (Viz `[^FR-005]`, `[^FR-003]`)
    -   `deleteFileByNameFromDocument`: Smaže **všechny** soubory s daným `fileName`.
    -   `downloadFileContentByName`: Použije **první nalezený** soubor s daným `fileName`.
-   **[ROZHODNUTO] Podpora komentářů u `CheckinTicket` / nahrávání souboru:** (Viz `[^FR-002]`)
    -   V této verzi Helperu se nebudou komentáře k souborům předávat platformě 3DEXPERIENCE během nahrávání. Funkce `uploadFileToDocument` tedy nepřijímá parametr pro komentář.
-   **[ROZHODNUTO] Formát chybových objektů:**
    -   Helper bude primárně využívat a předávat formát chybových objektů z knihovny `Connector3DSpace.js`.
-   **[ROZHODNUTO] Verzování souborů při stahování:** (Viz `[^FR-003]`)
    -   Funkce `downloadFileContentByName` nebude přijímat `versionId`. Vždy se stáhne aktuální (první nalezená) verze souboru.
 
---
[^FR-001]: FR-001 - Zajištění existence/Vytvoření nového 3DEXPERIENCE "Document" objektu
[^FR-002]: FR-002 - Nahrání JSON souboru do "Document" objektu
[^FR-003]: FR-003 - Stažení obsahu JSON souboru z "Document" objektu
[^FR-004]: FR-004 - Zamčení (Rezervace) "Document" objektu pro modifikaci
[^FR-005]: FR-005 - Smazání souboru z "Document" objektu
[^FR-006]: FR-006 - Odemčení (Uvolnění rezervace) "Document" objektu
[^FR-007]: FR-007 - Vyhledání "Document" objektu podle názvu
