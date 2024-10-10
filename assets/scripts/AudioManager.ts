import { assert, AssetManager, assetManager, AudioClip, AudioSource, Component, director, find, isValid, log, Node, resources, warn } from "cc";

// import Tools from "./Tools";

export enum AUDIO_LOCAL_KEY {

    MUSIC_VOLUME = "MUSIC_VOLUME",

    EFFECT_VOLUME = "EFFECT_VOLUME"

}

export class AudioManager extends Component {

    private static _instance: AudioManager = null;

    public static get Instance(): AudioManager {

        this._instance = this._instance || new AudioManager();

        return this._instance;

    }

    // bundle 资源

    private _soundBundle?: AssetManager.Bundle;

    //声音资源的缓存

    private _cachedAudioClipMap: Record<string, AudioClip> = {};

    //音乐节点组件

    private m_musicSource?: AudioSource;

    //音效组件

    private m_soundSource?: AudioSource;

    //音乐和音效的音量大小

    private m_musicVolume: number = -1;

    private m_soundVolume: number = -1;

    //音乐音效是否静音

    // private m_musicMute: boolean = false;

    // private m_soundMute: boolean = false;

    //模块初始化

    public init() {

        // let musicVolume_record = Number(Tools.getLocalRecord(AUDIO_LOCAL_KEY.EFFECT_VOLUME));
        let musicVolume_record = Number(AUDIO_LOCAL_KEY.EFFECT_VOLUME);
        let soundVolume_record = Number(AUDIO_LOCAL_KEY.MUSIC_VOLUME);

        this.m_musicVolume = (this.m_musicVolume === -1 && musicVolume_record === 0) ? 0.2 : musicVolume_record;

        this.m_soundVolume = (this.m_soundVolume === -1 && soundVolume_record === 0) ? 0.7 : soundVolume_record;

        this.addSoundPersistRootNode();

    }

    //初始化常驻节点

    private addSoundPersistRootNode() {

        let node = new Node("AudioManagerNode");

        let comp = node.addComponent(AudioManager);

        //加入场景节点

        let scene = director.getScene();

        scene.addChild(node);

        director.addPersistRootNode(node);

        //播放音效的组件

        this.m_soundSource = comp.addComponent(AudioSource);

        this.m_soundSource.loop = false;

        //播放BGM的组件

        this.m_musicSource = comp.addComponent(AudioSource);

        this.m_musicSource.loop = true;

    }

    //加载本地bundle包

    private loadSoundBundle() {

        return new Promise((resolve, reject) => {

            if (this._soundBundle) {

                resolve(this._soundBundle);

            } else {

                assetManager.loadBundle('resources', (err, bundle) => {

                    if (err) {

                        return reject(err);

                    }

                    this._soundBundle = bundle;

                    resolve(bundle);

                })

            }

        });

    }

    //***********************************音乐********************************************************** */

    /**

     * 播放音乐

     * @param {String} name  音乐名称

     * @param {Number} volumeScale 音乐声音大小

     */

    public playMusic(name: string, volumeScale: number = 1) {

        // if (this.musicVolume === 0) return;

        const musicAudioSource = this.m_musicSource!;

        if (musicAudioSource.clip && musicAudioSource.clip.name === name) {

            if (!musicAudioSource.playing) {

                let volume = Math.min(1, Math.max(0, this.musicVolume * volumeScale));

                musicAudioSource.volume = volume;

                musicAudioSource.play();

            }

        } else {
            
            this.stopMusic();
            this.m_musicSource.clip = null;
            let clip: AudioClip = this._cachedAudioClipMap[name];

            if (clip) {

                musicAudioSource.clip = clip;

                let volume = Math.min(1, Math.max(0, this.musicVolume * volumeScale));

                musicAudioSource.volume = volume;

                musicAudioSource.play();

            } else {

                this.loadSoundBundle().then((bundle: AssetManager.Bundle) => {

                    bundle.load(name, AudioClip, (err: Error, audioClip: AudioClip) => {

                        if (err) {

                            warn(`load audioClip ${name} failed: `, err.message);

                            return;

                        }

                        this._cachedAudioClipMap[name] = audioClip;

                        musicAudioSource.clip = audioClip;

                        let volume = Math.min(1, Math.max(0, this.musicVolume * volumeScale));

                        musicAudioSource.volume = volume;

                        musicAudioSource.play();

                    });

                })

            }

        }

    }

    public switchMusic(name: string, volumeScale: number = 1) {

        this.playMusic(name, volumeScale);
    }


    /** 音量 */

    get musicVolume(): number { return this.m_musicVolume; }

    set musicVolume(value: number) {

        this.m_musicVolume = Math.min(1, Math.max(0, value));

        this.m_musicSource.volume = value;

    }

    public stopMusic() {

        if (this.m_musicSource.clip) {

            this.m_musicSource.stop();

        }

    }

    public pauseMusic(): void {

        if (this.m_musicSource.playing) {

            this.m_musicSource.pause();

        }

    }

    public resumeMusic(): void {

        if (this.m_musicSource.clip) {

            this.m_musicSource.play();

        }

    }

    //***********************************音效********************************************************** */

    /**

    * 播放音效

    * @param {String} name 音效名称

    * @param {Number} volumeScale 音效声音缩放值

    */

    public playSound(name: string, volumeScale: number = 1) {

        if (this.soundVolume === 0) return;

        let clip = this._cachedAudioClipMap[name];

        const soundAudioSource = this.m_soundSource!;

        if (clip) {

            let volume = Math.min(1, Math.max(0, this.soundVolume * volumeScale));

            soundAudioSource.playOneShot(clip, volume);

        } else {

            this.loadSoundBundle().then((bundle: AssetManager.Bundle) => {

                bundle.load(name, AudioClip, (err: Error, audioClip: AudioClip) => {

                    if (err) {

                        warn(`load audioClip ${name} failed: `, err.message);

                        return;

                    }

                    this._cachedAudioClipMap[name] = audioClip;

                    let volume = Math.min(1, Math.max(0, this.soundVolume * volumeScale));

                    soundAudioSource.playOneShot(audioClip, volume);

                })

            })

        }

    }

    /** 音量 */

    get soundVolume(): number { return this.m_soundVolume; }

    set soundVolume(value: number) {

        this.m_soundVolume = Math.min(1, Math.max(0, value));

    }

}
