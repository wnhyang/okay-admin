<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, ref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import * as MenuApi from '@/api/system/menu'
import { listToTree } from '@/utils/tree'
import { MenuVO } from '@/api/system/menu'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

let menuTree = ref<any>([])
const getTree = async () => {
  menuTree.value = []
  const res = await MenuApi.getSimpleMenusList()
  if (res) {
    menuTree.value.push({ id: 0, name: '根目录', children: listToTree(res.data) })
  } else {
    menuTree.value.push({ id: 0, name: '根目录' })
  }
}
getTree()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'parentId',
    label: t('menu.parentId'),
    component: 'TreeSelect',
    componentProps: {
      data: menuTree,
      nodeKey: 'id',
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      }
    }
  },
  {
    field: 'meta.title',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'component',
    label: t('menu.component'),
    component: 'Input',
    remove: `meta.title`.endsWith(String(2))
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input'
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    component: 'Input'
  },
  {
    field: 'path',
    label: t('menu.path'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: 0
        },
        {
          label: t('userDemo.enable'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'permission',
    label: t('menu.permission'),
    component: 'CheckboxGroup',
    componentProps: {
      options: [
        {
          label: 'add',
          value: 'add'
        },
        {
          label: 'edit',
          value: 'edit'
        },
        {
          label: 'delete',
          value: 'delete'
        }
      ]
    }
  },
  {
    field: 'meta.hidden',
    label: t('menu.hidden'),
    component: 'Switch'
  },
  {
    field: 'meta.alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch'
  },
  {
    field: 'meta.noCache',
    label: t('menu.noCache'),
    component: 'Switch'
  },
  {
    field: 'canTo',
    label: t('menu.canTo'),
    component: 'Switch'
  }
])

const rules = reactive({
  parentId: [required()],
  component: [required()],
  path: [required()],
  'meta.title': [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData<MenuVO>()
    console.log(formData)
    await MenuApi.createMenu(formData)
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
