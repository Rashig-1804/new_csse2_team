---
layout: opencs
title: Red Riding Hood Game 
permalink: /gamify/redridinghood
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- GameEnv will create canvas dynamically -->
</div>

<script type="module">
    // Red Riding Hood Game assets locations
    import Core from "{{site.baseurl}}/assets/js/GameEnginev1/essentials/Game.js";
    import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1/essentials/GameControl.js";
    import GameLevelRedRidingHood1 from "{{site.baseurl}}/assets/js/GameEnginev1/redridinghood/level1.js";
    import GameLevelRedRidingHood2 from "{{site.baseurl}}/assets/js/GameEnginev1/redridinghood/level2.js";
    import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const gameLevelClasses = [GameLevelRedRidingHood1, GameLevelRedRidingHood2];

    // Web Server Environment data
    const environment = {
        path:"{{site.baseurl}}",
        pythonURI: pythonURI,
        javaURI: javaURI,
        fetchOptions: fetchOptions,
        gameContainer: document.getElementById("gameContainer"),
        gameLevelClasses: gameLevelClasses

    }
    // Launch Red Riding Hood Game using the central core and adventure GameControl
    Core.main(environment, GameControl);
</script>
