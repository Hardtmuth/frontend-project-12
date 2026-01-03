import { toast } from 'react-toastify'
import i18next from 'i18next'

export default {
  test: () => toast.error(i18next.t('errors.network')),
  loading: () => toast.warning(i18next.t('content.loading')),
  networkError: () => toast.error(i18next.t('errors.network')),
  add: () => toast.success(i18next.t('notifications.add')),
  delete: () => toast.success(i18next.t('notifications.delete')),
  rename: () => toast.success(i18next.t('notifications.rename')),
}
