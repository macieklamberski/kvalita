import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
export const items = pgTable('items', {}, (table) => [
  index('items_channel_id').on(table.id),
  index('channel_items_id').on(table.id), // flag
  uniqueIndex('items_link').on(table.id),
])
