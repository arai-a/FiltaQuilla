

(async () => {

  // main background script for FiltaQuilla
  messenger.WindowListener.registerDefaultPrefs("defaults/preferences/filtaquilla.js");
  // dropped ["resource", "filtaquilla",           "skin/"],

  messenger.WindowListener.registerChromeUrl([ 
      ["resource", "filtaquilla",           "content/"],  
      ["resource", "filtaquilla-skin",      "skin/"],  // make a separate resource (we can't have 2 different resources mapped to to the same name)
      ["content",  "filtaquilla",           "content/"],
      ["locale",   "filtaquilla", "en",     "locale/en/"],
      ["locale",   "filtaquilla", "sv",     "locale/sv/"],
      ["locale",   "filtaquilla", "de",     "locale/de/"],
      ["locale",   "filtaquilla", "nl",     "locale/nl/"],
      ["locale",   "filtaquilla", "ru",     "locale/ru/"]
    ]
  );  
  
  messenger.WindowListener.registerOptionsPage("chrome://filtaquilla/content/options.xhtml"); 
    
  
  /* OVERLAY CONVERSIONS */
  
  // overlay  chrome://messenger/content/messenger.xul chrome://filtaquilla/content/filtaquilla.xul 
  messenger.WindowListener.registerWindow("chrome://messenger/content/messenger.xhtml", "content/scripts/filtaquilla-messenger.js");
  
  // overlay  chrome://messenger/content/FilterEditor.xul chrome://filtaquilla/content/filterEditorOverlay.xul
  messenger.WindowListener.registerWindow("chrome://messenger/content/FilterEditor.xhtml", "content/scripts/filtaquilla-filterEditor.js");
  
  // overlay  chrome://messenger/content/SearchDialog.xul chrome://filtaquilla/content/filterEditorOverlay.xul
  messenger.WindowListener.registerWindow("chrome://messenger/content/SearchDialog.xhtml", "content/scripts/filtaquilla-filterEditor.js");
  
  // overlay  chrome://messenger/content/mailViewSetup.xul chrome://filtaquilla/content/filterEditorOverlay.xul
  messenger.WindowListener.registerWindow("chrome://messenger/content/mailViewSetup.xhtml", "content/scripts/filtaquilla-filterEditor.js");
  
  // overlay  chrome://messenger/content/virtualFolderProperties.xul chrome://filtaquilla/content/filterEditorOverlay.xul
  messenger.WindowListener.registerWindow("chrome://messenger/content/virtualFolderProperties.xhtml", "content/scripts/filtaquilla-filterEditor.js");
  
  
  
  messenger.NotifyTools.onNotifyBackground.addListener(async (data) => {
    const legacy_root = "extensions.filtaquilla.";
    let isLog = await messenger.LegacyPrefs.getPref(legacy_root + "debug.notifications");
    if (isLog && data.func) {
      console.log ("=========================\n" +
                   "BACKGROUND LISTENER received: " + data.func + "\n" +
                   "=========================");
    }
    switch (data.func) {
      case "printMessage": // [issue 152] - PrintingTools NG support
        // third "options" parameter must be passed to be able to have extensionId as 1st parameter , not sure whether it requires a particular format, or null is allowed
        const PrintingTools_Addon_Name = "PrintingToolsNG@cleidigh.kokkini.net";
        let options = {};
        

        let result = await messenger.runtime.sendMessage(
          PrintingTools_Addon_Name, 
          { command: "printMessage", messageHeader: data.msgKey },
          options 
        );
        break;
    }
  });
  
  
  messenger.WindowListener.startListening();

})();

