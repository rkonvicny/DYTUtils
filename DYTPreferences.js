/**
 * @author DSIS
 */

//Anonymous define here
define("DS/DYTUtils/DYTPreferences",["DS/DYTUtils/DYTLogger"], function(logger) {
    let tool = {
        initPref(namePref, type, label, defaultValue, options) {
            let wdgPref = widget.getPreference(namePref);
            if (typeof wdgPref === "undefined") {
                //Create it
                widget.addPreference({
                    name: namePref,
                    type: type,
                    label: label,
                    defaultValue: defaultValue,
                    options:options
                });
            }
        },
        initPreferences(...prefs) {
            //Expected format
            /*{
                name: string,
                type: string,
                label: string,
                defaultValue: {vaule:string,label:string},
                options: [{vaule:string,label:string},],
            }*/
            for (let i = 0; i < prefs.length; i++) {
                const objPref = prefs[i];
                this.initPref(objPref.name,objPref.type,objPref.label, objPref.defaultValue,objPref.options);
            }
        },
        getValue(namePref) {
            let val = widget.getValue(namePref);
            if (val) {
                try {
                    val = JSON.parse(val.trim());
                } catch (err) {
                    logger.log(-1,"JSON Parse error for preferences - not JSON - returning value : "+ namePref+ " val= "+ val+ " err "+ err.message);
                }
            }
            return val;
        },
        getValueAsBoolean(namePref) {
            return widget.getValue(namePref) === "true";
        },
        updateOptions(prefName,newOptions,newDefaultValue){
            pref = widget.getPreference(prefName);
            pref.options = newOptions;
            widget.setValue(prefName, newDefaultValue);
        }
    };
    return tool;
});