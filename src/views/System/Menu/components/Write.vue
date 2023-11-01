<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, ref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import * as MenuApi from '@/api/system/menu'
import { MenuVO } from '@/api/system/menu'
import { listToTree } from '@/utils/tree'

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
    menuTree.value.push({ id: 0, title: '根目录', children: listToTree(res.data) })
  } else {
    menuTree.value.push({ id: 0, title: '根目录' })
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
        label: 'title',
        children: 'children'
      },
      defaultExpandedKeys: [0],
      checkStrictly: true
    }
  },
  {
    field: 'title',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButton',
    componentProps: {
      options: [
        {
          label: '目录',
          value: 1
        },
        {
          label: '菜单',
          value: 2
        },
        {
          label: '按钮',
          value: 3
        }
      ],
      on: {
        change: (value: number) => {
          setSchema([
            {
              field: 'component',
              path: 'remove',
              value: value !== 2
            },
            {
              field: 'name',
              path: 'remove',
              value: value !== 2
            },
            {
              field: 'icon',
              path: 'remove',
              value: value === 3
            },
            {
              field: 'path',
              path: 'remove',
              value: value === 3
            },
            {
              field: 'permission',
              path: 'remove',
              value: value === 1
            },
            {
              field: 'hidden',
              path: 'remove',
              value: value === 3
            },
            {
              field: 'alwaysShow',
              path: 'remove',
              value: value === 3
            },
            {
              field: 'onCache',
              path: 'remove',
              value: value !== 2
            }
          ])
        }
      }
    }
  },
  {
    field: 'component',
    label: t('menu.component'),
    component: 'Input'
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input'
  },
  {
    field: 'icon',
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
          value: 1
        },
        {
          label: t('userDemo.enable'),
          value: 0
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
        },
        {
          label: 'query',
          value: 'query'
        },
        {
          label: 'import',
          value: 'import'
        },
        {
          label: 'export',
          value: 'export'
        }
      ]
    }
  },
  {
    field: 'hidden',
    label: t('menu.hidden'),
    component: 'Switch'
  },
  {
    field: 'alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch'
  },
  {
    field: 'noCache',
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
  title: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, setSchema, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    return await getFormData<MenuVO>()
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
