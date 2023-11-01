<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { deleteMenu, getMenuList } from '@/api/system/menu'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElTag } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import * as MenuApi from '@/api/system/menu'

const { t } = useI18n()

const queryParams = reactive({
  name: undefined,
  status: undefined
})
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getMenuList(queryParams)
    return {
      list: res.data || []
    }
  },
  fetchDelApi: async () => {
    const res = await deleteMenu(unref(id))
    return !!res
  }
})

const { dataList, loading } = tableState
const { getList, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'title',
    label: t('menu.menuName')
  },
  {
    field: 'icon',
    label: t('menu.icon'),
    slots: {
      default: (data: any) => {
        const icon = data.row.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  {
    field: 'permission',
    label: t('menu.permission'),
    slots: {
      default: (data: any) => {
        const permission = data.row.permission
        return permission ? <>{permission.join(', ')}</> : null
      }
    }
  },
  {
    field: 'component',
    label: t('menu.component'),
    slots: {
      default: (data: any) => {
        const component = data.row.component
        return <>{component === '#' ? '顶级目录' : component === '##' ? '子目录' : component}</>
      }
    }
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === 0 ? 'success' : 'danger'}>
              {data.row.status === 0 ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <ElButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </ElButton>
            <ElButton type="danger" onClick={() => delData(row)}>
              {t('exampleDemo.del')}
            </ElButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: t('menu.menuName'),
    component: 'Input'
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const id = ref<number>(-1)

const delData = async (row?: any) => {
  delLoading.value = true
  id.value = row.id

  await delList(row.id).finally(() => {
    delLoading.value = false
  })
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      let res
      if (actionType.value === 'edit') {
        res = await MenuApi.updateMenu(formData)
      } else {
        res = await MenuApi.createMenu(formData)
      }
      if (res) {
        await getList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
