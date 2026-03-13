---
layout: opencs
title: Red Riding Hood Game 
permalink: /ridinghoodportfolio
codemirror: true
---

# The Red Riding Hood Game
## Made by Anika, Rashi, and Mateo! 


{% capture ridinghood_code %}
import GameControl from '{{site.baseurl}}/assets/js/GameEnginev1/essentials/GameControl.js';
import GameLevelRedRidingHood1 from '{{site.baseurl}}/assets/js/GameEnginev1/redridinghood/level1.js';
import GameLevelRedRidingHood2 from '{{site.baseurl}}/assets/js/GameEnginev1/redridinghood/level2.js';

export const gameLevelClasses = [GameLevelRedRidingHood1, GameLevelRedRidingHood2];
export { GameControl };
{% endcapture %}

{% include game-runner.html
   runner_id="red_riding_hood"
   challenge="Help Red Riding Hood collect 5 cookies!"
   code=ridinghood_code
   height="580px"
%}