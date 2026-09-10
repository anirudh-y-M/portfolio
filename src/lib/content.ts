import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

type Publishable = { draft: boolean; reviewed: boolean };

export function isPublished(data: Publishable): boolean {
  return data.draft === false && data.reviewed === true;
}

export async function getPublished<C extends 'work' | 'notes'>(collection: C): Promise<CollectionEntry<C>[]> {
  const all = await getCollection(collection);
  // In dev show drafts so they can be previewed; in build publish only reviewed, non-draft entries.
  return import.meta.env.DEV ? all : all.filter((e) => isPublished(e.data as Publishable));
}

export function sortWork(entries: CollectionEntry<'work'>[]): CollectionEntry<'work'>[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export function sortNotesNewest(entries: CollectionEntry<'notes'>[]): CollectionEntry<'notes'>[] {
  const stamp = (e: CollectionEntry<'notes'>) => (e.data.updated ?? e.data.published).getTime();
  return [...entries].sort((a, b) => stamp(b) - stamp(a));
}

export function groupByStatus(entries: CollectionEntry<'notes'>[]) {
  const order = ['evergreen', 'growing', 'seed'] as const;
  return order.map((status) => ({ status, entries: entries.filter((e) => e.data.status === status) }));
}

export async function latestNow(): Promise<CollectionEntry<'now'>> {
  const all = await getCollection('now');
  if (all.length === 0) throw new Error('No entries in src/content/now');
  return [...all].sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime())[0];
}
