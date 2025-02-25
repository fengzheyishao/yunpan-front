<template>
  <el-tooltip ref="tooltipRef" effect="dark" :disabled="disabled" :content="tooltipContent || content">
    <p ref="contentRef" class="text-overflow" :class="[className]" :style="{ '-webkit-line-clamp': lineClamp }" @mouseover="isOverflow">
      {{ content }}
    </p>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  className: {
    type: String
  },
  lineClamp: {
    type: Number,
  },
  tooltipContent: {
    type: String
  },
})

const tooltipRef = ref()
const contentRef = ref()

const disabled = ref(true)

const isOverflow = () => {
  const el = contentRef.value
  if (el) {
    if (props.lineClamp) {
      disabled.value = el.offsetHeight >= el.scrollHeight
    } else {
      disabled.value = el.offsetWidth >= el.scrollWidth
    }
  }
}
</script>