---
**ID Požadavku:** FR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.5 (Uzavření otevřených otázek, zmínka o DocumentWebServiceHelper)
---

### Název Funkčního Požadavku:
Zajištění existence/Vytvoření nového 3DEXPERIENCE "Document" objektu

**1. Popis Aktéra/Uživatele:**
   - Utilita `DYTJSONManager` (která volá funkce z `DocumentWebServiceHelper`)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje zajistit existenci "Document" objektu se specifickým titulkem v 3DEXPERIENCE pro následné ukládání JSON souborů (např. konfigurací, malých datových sad). Pokud dokument neexistuje, má být vytvořen.

**3. Popis Funkcionality:**
   - Utilita `DocumentWebServiceHelper` poskytne funkci, která nejprve ověří existenci "Document" objektu se zadaným titulkem. Pokud dokument neexistuje, vytvoří nový. Pokud existuje, vrátí informace o existujícím dokumentu.
   - **Vstupní podmínky/Data:**
     - Titulek ("title") pro "Document" objekt (povinné).
   - **Hlavní scénář (Kroky):**
     1. Utilita `DocumentWebServiceHelper` přijme požadavek na zajištění existence "Document" objektu se zadaným titulkem.
     2. Utilita interně zavolá funkci odpovídající požadavku `FR-007` (Vyhledání "Document" objektů) s použitím zadaného titulku jako `searchString`.
     3. **Pokud je nalezen jeden nebo více dokumentů s odpovídajícím titulkem:**
        a. Utilita vrátí identifikátor (`id`) a metadata prvního nalezeného dokumentu. (Strategie pro výběr v případě více shod bude definována v `FR-007`, pro účely této funkce se použije první nalezený).
     4. **Pokud není nalezen žádný dokument s odpovídajícím titulkem (nebo pokud strategie v `FR-007` určí, že se má vytvořit nový i přes existenci jiných):**
        a. Utilita sestaví JSON payload pro request body pro vytvoření nového dokumentu podle schématu `documents` (definovaného v OpenAPI).
           - Povinný atribut v `dataelements`: `title` (zadaný Widgetem).
           - Ostatní atributy (např. `name`, `policy`, `collabspace`, `description`) nebudou explicitně nastaveny utilitou a ponechají se na defaultním chování platformy 3DEXPERIENCE (např. autonaming pro `name`).
        b. Utilita použije `Connector3DSpace.js` pro volání `POST /resources/v1/modeler/documents` s připraveným JSON payloadem.
        c. Utilita zpracuje odpověď od 3DEXPERIENCE.
        d. Utilita vrátí identifikátor (`id`) a metadata nově vytvořeného "Document" objektu.
   - **Výstupní podmínky/Data (pro funkci v `DocumentWebServiceHelper`):**
     - V případě úspěchu (dokument nalezen nebo nově vytvořen): Identifikátor (`id`) "Document" objektu a jeho základní metadata.
     - V případě neúspěchu (např. chyba při vyhledávání nebo vytváření): Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE (při vyhledávání nebo vytváření).
     - Nedostatečná oprávnění pro vyhledání nebo vytvoření objektu.
     - Nevalidní vstupní parametry (např. prázdný titulek).

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce z `DocumentWebServiceHelper` s validním titulkem:
     - Pokud dokument s daným titulkem existuje (a strategie `FR-007` neurčí jinak), funkce vrátí jeho `id` a metadata.
     - Pokud dokument s daným titulkem neexistuje (nebo strategie `FR-007` určí vytvoření), je v 3DEXPERIENCE vytvořen nový "Document" objekt se zadaným titulkem a funkce vrátí jeho `id` a metadata.
   - V případě chyby je vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have) - Základní funkce pro práci s novými daty.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js` (pro komunikaci s 3DEXPERIENCE).
   - Přístup k WebAPI 3DEXPERIENCE pro tvorbu "Document" objektů (`POST /resources/v1/modeler/documents`).
   - Funkcionalita pro vyhledávání dokumentů (dle `FR-007`).

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován v 3DEXPERIENCE.
   - `Connector3DSpace.js` je správně inicializován a funkční.

**8. Otevřené Otázky/Poznámky:**
   - [VYŘEŠENO] Jaká konkrétní WebAPI metoda (přes `Connector3DSpace.js`) bude použita pro vytvoření "Document" objektu?
     - Odpověď: `POST /resources/v1/modeler/documents`
   - [ROZHODNUTO] Povinné a volitelné atributy: Povinný bude pouze `title`. Ostatní (např. `name`, `description`, `policy`, `collabspace`) nebudou utilitou explicitně nastavovány.
   - [ROZHODNUTO] Existence dokumentu: Utilita nejprve vyhledá dokument podle titulku (využitím `FR-007`). Pokud existuje, vrátí jeho ID. Pokud neexistuje, vytvoří nový.
   - [VYŘEŠENO] Jak se bude řešit případ, kdy vyhledávání (`FR-007`) vrátí více dokumentů se stejným titulkem?
     - Odpověď: Pro účely `FR-001` se vezme první nalezený dokument. Detailní strategie pro `FR-007` je definována tamtéž.
   - Poznámka: Tato funkcionalita bude primárně implementována v rámci modulu `DYTUtils - DocumentWebServiceHelper` a využívána hlavní utilitou `DYTUtils - Document Extension`.
