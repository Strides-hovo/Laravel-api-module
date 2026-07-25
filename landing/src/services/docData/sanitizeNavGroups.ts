import { NavGroup, PageId } from '../../types';
import { NAV_GROUPS_V1_0_0 } from '../../data/defaults';

/**
 * Normalizes nav groups coming from MockAPI (old records may reference
 * page ids that were later renamed/merged) so the sidebar never breaks.
 */
export function sanitizeNavGroups(groups: NavGroup[]): NavGroup[] {
  if (!Array.isArray(groups)) return NAV_GROUPS_V1_0_0;

  return groups.map((group) => {
    if (group.id === 'community' || group.label?.toLowerCase().includes('community')) {
      return { ...group, items: [{ id: 'github' as PageId, label: 'GitHub' }] };
    }

    let items = (group.items || []).map((item) => {
      if ((item.id as string) === 'configuration') {
        return { id: 'commands' as PageId, label: 'Artisan Commands' };
      }
      if ((item.id as string) === 'issues' || (item.id as string) === 'discussions') {
        return { id: 'github' as PageId, label: 'GitHub' };
      }
      return item;
    });

    items = items.filter((item, idx, self) => idx === self.findIndex((t) => t.id === item.id));

    if (group.id === 'core-concepts' && !items.some((item) => item.id === 'transformer')) {
      items.push({ id: 'transformer' as PageId, label: 'Module Transformer', badge: 'New' });
    }

    return { ...group, items };
  });
}
