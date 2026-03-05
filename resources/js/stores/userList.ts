import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ListStatus } from '@/types'

export const useUserListStore = defineStore('userList', () => {
    const activeStatus = ref<ListStatus>('watching')

    function setActiveStatus(status: ListStatus) {
        activeStatus.value = status
    }

    return { activeStatus, setActiveStatus }
})
