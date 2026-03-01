export interface AudioAsset {
    title: string;
    url: string; //path from audio.d.ts module declaration
}

//importing the songs
import mwana_wangye from '/mwana_wangye.mp3';
import we_live_to_love from '/we_live_to_love.mp3';
// import 03-in-his-image_trim from '/03-in-his-image_trim.mp3';
// import 04-humura_trim from '/04-humura_trim.mp3';
// import 05-nvudde-wala_trim from '/05-nvudde-wala_trim.mp3';
// import 06-abaana-bangye_trim from '/06-abaana-bangye_trim.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.mp3';
// import from '/.wav';
// import from '/.wav';
// import from '/.wav';
// import from '/.wav';

export const audioLibrary: Record<string, AudioAsset> = {
  mwana_wangye: { title: "mwana wangye", url: mwana_wangye },
  we_live_to_love: { title: "we live to love", url: we_live_to_love },
};