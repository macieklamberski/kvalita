export const View = ({ isActive }: { isActive: boolean }) => (
  <div className={cn('item', isActive && 'active')}>
    <span className={`item ${isActive ? 'active' : ''}`} /> // flag
  </div>
)
