import enemySpawnSound from './data/enemySpawn';
import areaSpawn1V2Sound from './data/areaSpawn1V2';
import areaSpawn2V2Sound from './data/areaSpawn2V2';
import areaSpawn3V2Sound from './data/areaSpawn3V2';
import chargeV2Sound from './data/chargeV2';
import gameOverSound from './data/gameOver';
const CPlayer = require('./soundbox-player-small.js');

export default class SoundPlayer {
    private soundsData: SoundsData[];
    private sounds: Sounds;

    constructor() {
        this.sounds = {};
        this.soundsData = [
            {
                name: SOUND_NAMES.AreaSpawn1,
                data: areaSpawn1V2Sound,
            },
            {
                name: SOUND_NAMES.AreaSpawn2,
                data: areaSpawn2V2Sound,
            },
            {
                name: SOUND_NAMES.AreaSpawn3,
                data: areaSpawn3V2Sound,
            },
            {
                name: SOUND_NAMES.EnemySpawn,
                data: enemySpawnSound,
            },
            {
                name: SOUND_NAMES.ChargeSound,
                data: chargeV2Sound,
            },
            {
                name: SOUND_NAMES.GameOver,
                data: gameOverSound,
            },
        ];
        this.prepareSounds();
    }

    private prepareSounds(): void {
        this.soundsData.forEach((soundData) => {
            const soundGenerator = new CPlayer();
            soundGenerator.init(soundData.data);
            let done = false;
            setInterval(() => {
                if (done) {
                    return;
                }
                done = soundGenerator.generate() === 1;
                if (done) {
                    const wave = soundGenerator.createWave().buffer;

                    audioCtx.decodeAudioData(wave, (buffer) => {
                        this.sounds[soundData.name] = buffer;
                    });
                }
            }, 0);
        });
    }

    public playSound(soundName: string, options: PlaySoundOptions = {}): void {
        const source = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();
        const panNode = audioCtx.createStereoPanner();
        const biquadFilter = audioCtx.createBiquadFilter();

        source.buffer = this.sounds[soundName];
        source.connect(panNode);
        panNode.connect(gainNode);
        gainNode.connect(biquadFilter);
        biquadFilter.connect(audioMaster);

        source.playbackRate.value = options.playbackRate || 1;
        source.loop = options.loop || false;
        gainNode.gain.value = options.volume || 0.5;
        panNode.pan.value = options.pan || 0;
        biquadFilter.type = 'allpass';
        biquadFilter.detune.value = options.detune || 0;
        source.start();
    }
}

export const SOUND_NAMES = {
    AreaSpawn1: 'AreaSpawn1',
    AreaSpawn2: 'AreaSpawn2',
    AreaSpawn3: 'AreaSpawn3',
    EnemySpawn: 'EnemySpawn',
    ChargeSound: 'ChargeSound',
    GameOver: 'GameOver'
};

interface PlaySoundOptions {
    playbackRate?: number,
    pan?: number,
    volume?: number,
    loop?: boolean,
    detune?: number;
}

interface Sounds {
    [soundName: string]: AudioBuffer;
}

interface SoundsData {
    name: string;
    data: any;
}

const audioCtx = new AudioContext;
const audioMaster = audioCtx.createGain();
audioMaster.connect(audioCtx.destination);
