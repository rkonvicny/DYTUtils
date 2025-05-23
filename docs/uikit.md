# Uživatelská příručka k UIKITu (na základě analýzy kódu)

Tento dokument poskytuje přehled UI frameworku UIKIT používaného na platformě 3DEXPERIENCE, jeho API a práce s jeho styly, na základě analýzy poskytnutých zdrojových kódů.

## 1. Prostředí UIKITu v 3DEXPERIENCE Widgetu

UIKIT je sada UI komponent a stylů navržených pro použití v rámci 3DEXPERIENCE platformy, konkrétně ve widgetech postavených na UWA (Universal Widget API).

*   **Integrace:** UIKIT komponenty jsou definovány jako AMD moduly (pomocí `define`). Pro jejich použití ve tvém JavaScriptovém kódu (např. v `helperTest.js`) je potřeba je načíst pomocí `require`.
*   **Základní třída:** Většina UIKIT komponent dědí z `UWA/Controls/Abstract`. To znamená, že sdílejí společné metody pro správu životního cyklu (např. `init`, `destroy`), manipulaci s DOM (např. `inject`, `getElement`, `getContent`), správu událostí (např. `addEvent`, `dispatchEvent`) a nastavení možností (`setOptions`).
*   **DOM:** Komponenty UIKITu vytvářejí a spravují své vlastní DOM elementy, které se typicky vkládají do `widget.body` nebo jiného kontejneru v rámci widgetu.
*   **Styly:** Vizuální vzhled komponent je definován v souboru `UIKIT.css`, který je kompilován ze zdrojových SCSS souborů. Tyto styly jsou založeny na CSS třídách (např. `btn`, `form-control`, `modal`).
*   **Závislosti:** UIKIT využívá další moduly platformy, jako je `UWA/Core`, `UWA/Element`, `UWA/Event`, `UWA/Utils`, `UWA/Controls/Abstract`, `UWA/Data`, `UWA/Json`, `UWA/Promise`, `UWA/Utils/Client`, a pro specifické funkce i externí knihovny jako Hammer.js (pro dotykové ovládání) nebo interní moduly platformy jako `DS/CefCommunication` (pro nativní integraci).

## 2. API UIKITu

UIKIT poskytuje různé komponenty, které lze použít k sestavení UI. Typické použití komponenty zahrnuje její načtení pomocí `require`, vytvoření instance s konfiguračními možnostmi a vložení jejího DOM elementu do těla widgetu.

```javascript
// Příklad použití komponenty Button
define(["DS/UIKIT/Input/Button"], function(Button) {
    // ... uvnitř metody start nebo jiné logiky widgetu
    var myButton = new Button({
        value: "Klikni na mě", // Text tlačítka
        className: "btn-primary", // CSS třída pro primární vzhled
        events: {
            onClick: function(event) {
                console.log("Tlačítko bylo kliknuto!");
                // Zde můžeš volat další logiku
            }
        }
    });

    // Vložení tlačítka do těla widgetu
    myButton.inject(widget.body);

    // Příklad volání metody na instanci
    // myButton.disable(); // Zakáže tlačítko
});
