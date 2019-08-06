import Game from './Game';
import MainCharacter from './MainCharacter';
import Input from './Input';

export default class World {
    public game: Game;
    public tick: number;
    public player: MainCharacter;

    public constructor(game: Game) {
        this.game = game;
        this.tick = 0;
        this.player = new MainCharacter(this);
    }

    public update(input: Input): void {
        this.tick++;
        this.player.update();
    }
}
