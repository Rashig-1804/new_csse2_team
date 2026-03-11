import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Barrier from './essentials/Barrier.js';

/**
 * @class GameLevelCustom
 * @description FA2: Interaction Design for SkyKingdom.
 * This class implements a proximity-based interaction system within the game loop.
 */
class GameLevelCustom {
    constructor(gameEnv) {
        const path = gameEnv.path;

        /** @type {Object} bgData - Configuration for the cloud background. */
        const bgData = {
            name: "custom_bg",
            src: path + "/images/gamebuilder/bg/clouds.jpg",
            pixels: { height: 720, width: 1280 }
        };

        /** @type {Object} playerData - The Player character.
         * Movement is enabled via keypress listeners to facilitate interaction testing.
         */
        const playerData = {
            id: 'playerData',
            src: path + "/images/gamebuilder/sprites/astro.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 100, y: 300 },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 } // WASD
        };

        /** @type {Object} npcData1 - The Guide NPC.
         * @interaction Occurrence: Proximity is checked every frame in the game loop's update cycle.
         * @property {Object} hitbox - Controls the execution trigger for the interaction zone.
         * @reaction Trigger: The reaction function updates the UI state to display the dialogue system.
         */
        const npcData1 = {
            id: 'Astronaut1',
            greeting: 'Welcome to Space Kingdom!',
            src: path + "/images/gamebuilder/sprites/astro.png",
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 500, y: 300 },
            pixels: { height: 770, width: 513 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Welcome to Space Kingdom!'],
            reaction: function() { 
                if (this.dialogueSystem) { 
                    this.showReactionDialogue(); 
                } else { 
                    console.log(this.greeting); 
                } 
            },
            interact: function() { 
                if (this.dialogueSystem) { 
                    this.showRandomDialogue(); 
                } 
            }
        };

        /** @type {Object} dbarrier_1 - Static collision barrier defining level boundaries. */
        const dbarrier_1 = {
            id: 'dbarrier_1', 
            x: 315, 
            y: 42, 
            width: 228, 
            height: 117, 
            visible: true,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: npcData1 },
            { class: Barrier, data: dbarrier_1 }
        ];

        /* BUILDER_ONLY_START */
        // Environment metrics and builder communication logic
        try {
            setTimeout(() => {
                try {
                    const objs = Array.isArray(gameEnv?.gameObjects) ? gameEnv.gameObjects : [];
                    const summary = objs.map(o => ({ cls: o?.constructor?.name || 'Unknown', id: o?.canvas?.id || '', z: o?.canvas?.style?.zIndex || '' }));
                    if (window && window.parent) window.parent.postMessage({ type: 'rpg:objects', summary }, '*');
                } catch (_) {}
            }, 250);
        } catch (_) {}
        /* BUILDER_ONLY_END */
    }
}

export default GameLevelCustom;

export const gameLevelClasses = [GameLevelCustom];