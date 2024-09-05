<template>
    <div class="music">
        <div class="boby-content">
            <div class="cover">
                <img src="@/assets/music_cover.png" />
            </div>
            <div ref="playerRef" class="music-player">

            </div>
        </div>  
    </div>
</template>

<script setup>
import APlayer from "APlayer";
import "APlayer/dist/APlayer.min.css";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  url: {
    type: String,
  },
  fileName: {
    type: String,
  },
  artist: {
    type: String,
    default: "未知作者",
  }
});

const player = ref();
const playerRef = ref();

onMounted(()=>{
    player.value = new APlayer({
        container: playerRef.value,
        audio: {
            url: `/api${props.url}`,
            name: `${props.fileName}`,
            cover: new URL(`@/assets/music_icon.png`, import.meta.url).href,
            artist: `${props.artist}`,
        },
    });
});

onUnmounted(()=>{
    player.value.destroy();
});


</script>

<style lang="less" scoped>
.music{
    padding: 30px;
    .boby-content{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .music-player{
            width: 60%;
        }
    }  
}
</style>