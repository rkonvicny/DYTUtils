---
**ID Požadavku:** FR-001
**Datum Vytvoření:** 2025-05-10
**Autor Požadavku:** KONR
**Verze:** 0.3 (aktualizace aktéra)
---

### Název Funkčního Požadavku:
Vytvoření nového 3DEXPERIENCE "Document" objektu pro ukládání JSON dat

**1. Popis Aktéra/Uživatele:**
   - Widget (který volá funkce této utility)
   - Utilita samotná (pokud provádí interní volání svých vlastních funkcí jako součást komplexnější operace)

**2. Cíl/Potřeba Aktéra:**
   - Widget potřebuje vytvořit v 3DEXPERIENCE nový kontejner (objekt typu "Document") pro následné ukládání JSON souborů (např. konfigurací, malých datových sad).

**3. Popis Funkcionality:**
   - Utilita poskytne funkci pro vytvoření nového objektu typu "Document" v prostředí 3DEXPERIENCE.
   - **Vstupní podmínky/Data:**
     - Název pro nový "Document" objekt (povinné, mapuje se na `dataelements.name` nebo `dataelements.title` v API).
     - Volitelně další metadata pro "Document" (např. `description`, `policy`, `collabspace`).
   - **Hlavní scénář (Kroky):**
     1. Utilita přijme požadavek od Widgetu na vytvoření nového "Document" objektu s definovanými parametry (název, popis atd.).
     2. Utilita sestaví JSON payload pro request body podle schématu `documents` (definovaného v OpenAPI).
        - Klíčové atributy budou v `dataelements` (např. `title`, `description`).
        - Pro základní vytvoření prázdného dokumentu nebudou zahrnuty `receipt` ani `relateddata.files`.
     3. Utilita použije `Connector3DSpace.js` pro volání `POST /resources/v1/modeler/documents` s připraveným JSON payloadem.
     4. Utilita zpracuje odpověď od 3DEXPERIENCE.
   - **Výstupní podmínky/Data:**
     - V případě úspěchu: Identifikátor (`id`) nově vytvořeného "Document" objektu a případně další vrácená metadata.
     - V případě neúspěchu: Chybová zpráva/kód.
   - **Alternativní scénáře/Chybové stavy:**
     - Selhání komunikace s 3DEXPERIENCE.
     - Nedostatečná oprávnění pro vytvoření objektu.
     - Nevalidní vstupní parametry.

**4. Kritéria Přijetí (Acceptance Criteria):**
   - Po zavolání funkce Widgetem s validními parametry je v 3DEXPERIENCE vytvořen nový "Document" objekt.
   - Funkce vrátí Widgetu validní identifikátor nově vytvořeného "Document" objektu.
   - V případě chyby je Widgetu vrácena srozumitelná chybová informace.

**5. Priorita:**
   - [X] Musí být (Critical/Must-have) - Základní funkce pro práci s novými daty.

**6. Závislosti:**
   - `\\3dexpprod\webapps\DYTUtils\webapps\DYTUtils\Connector3DSpace.js` (pro komunikaci s 3DEXPERIENCE).
   - Přístup k WebAPI 3DEXPERIENCE pro tvorbu "Document" objektů.

**7. Předpoklady:**
   - Widget (resp. uživatel, v jehož kontextu Widget běží) je autentizován v 3DEXPERIENCE.
   - `Connector3DSpace.js` je správně inicializován a funkční.

**8. Otevřené Otázky/Poznámky:**
   - [VYŘEŠENO] Jaká konkrétní WebAPI metoda (přes `Connector3DSpace.js`) bude použita pro vytvoření "Document" objektu? -> `POST /resources/v1/modeler/documents`
   - Jaké povinné a volitelné atributy z `documents` schématu budeme podporovat při vytváření (např. `policy`, `collabspace`)?
   - Jak se bude řešit případ, kdy "Document" s daným názvem (`dataelements.title` nebo `dataelements.name`) již existuje v daném kontextu (pokud je název myšlen jako unikátní)? API samo o sobě toto nemusí kontrolovat, záleží na konfiguraci ENOVIA.
