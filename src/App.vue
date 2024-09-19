<template>
  <main>
    Test
  </main>
</template>

<script setup>
import apiServices from '@/utils/api/apiServices.js'
import { onMounted, ref } from 'vue'

const jobs = ref(null)
const regions = ref(null)
const cities = ref(null)
const companies = ref(null)


const getArrayByFilterKey = (arr, elem, filterKey) => {
  return  arr.filter(el => el[filterKey] === elem[filterKey])
}

const getArrayByMapKey = (arr, mapKey) => {
  return Array.from(new Set(arr.map(el => el[mapKey])))
}

const uniqueArray = (objects, uniqueBy) => {
  return Array.from(
      objects.reduce((map, e) => {
        const key = uniqueBy.map(key => [e[key], typeof e[key]]).flat().join('-')
        return map.has(key) ? map : map.set(key, e)
      }, new Map()).values()
  )
}



const getList = async () => {
  const result = await apiServices.getList()

  if (result.status === 200) {
    const start = new Date().getTime()

    console.log('START')
    jobs.value = result.data

    regions.value = uniqueArray(result.data.map(el => {
      const arr = getArrayByFilterKey(jobs.value, el, 'region_id')

      return {
        client_id: getArrayByMapKey(arr, 'clientid'),
        place_id: getArrayByMapKey(arr, 'placeid'),
        region_id: el.region_id,
        region_name: el.regionname
      }
    }), ['region_id'])

    cities.value = uniqueArray(result.data.map(el => {
      const arr = getArrayByFilterKey(jobs.value, el, 'placeid')

      return {
        region_id: getArrayByMapKey(arr, 'region_id'),
        client_id: getArrayByMapKey(arr, 'clientid'),
        place_id: el.placeid,
        place_title: el.placetitle
      }
    }), ['place_id'])

    companies.value = uniqueArray(result.data.map(el => {
      const arr = getArrayByFilterKey(jobs.value, el, 'clientname')

      return {
        place_id: getArrayByMapKey(arr, 'region_id'),
        region_id: getArrayByMapKey(arr, 'region_id'),
        client_id: el.clientid,
        client_name: el.clientname
      }
    }), ['client_name'])

    // console.log('Regions: ', regions.value)
    // console.log('Cities: ', cities.value.sort((a, b) => a.place_title < b.place_title ? -1 : 1))
    // console.log('Companies: ', companies.value.sort((a, b) => a.client_name < b.client_name ? -1 : 1))
    //

    const time = new Date().getTime() - start
    console.log('FINISH: sec ', time / 1000)

  } else {
    console.log('ERROR')
  }

  return result.status === 200 ? result.data : console.log('ERROR')
}

onMounted(async () => {
  await getList()
})
</script>
