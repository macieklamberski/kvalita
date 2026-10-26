type Slot = { text: string }
export const normalize = (slot: Slot | undefined) => {
  return slot && { ...slot, text: slot.text.trim() } // flag
}
export const keep = (slot: Slot | undefined) => {
  return slot
}
export const spread = (slot: Slot | undefined) => {
  return { ...(slot && { text: slot.text }) }
}
