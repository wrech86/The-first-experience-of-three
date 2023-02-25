<template>
  <div v-for="(item, index) in state" :key="index" :ref="setItemRef">
	{{item.item}}
</div>
</template>

<script setup>
import {ref,reactive,onMounted,onBeforeUpdate,onUpdated} from 'vue'

	let itemRef = ref([])
	let state = reactive([
    {
      item:'hh',
    },
    {
      item:'ww'
    },
    {
      item:'oo'
    }
  ])
	const setItemRef = (el) => {
		itemRef.value.push(el)
    console.log(itemRef.value[0]);
	}
	onMounted(()=>{
		// 模拟调用接口
		setTimeout(()=>{
			state.push({item:'rr'})
		},1000)
	})
  // 更新之后会重复拿REF所以需要设置为空
	onBeforeUpdate(() => {
		itemRef.value = [];
	});
	
	onUpdated(()=>{
		itemRef.value.map(d=>{
      console.log(d);
			d.style.height = '100px'
		})
    console.log(itemRef.value);
	})
	

</script>

<style scoped>

</style>