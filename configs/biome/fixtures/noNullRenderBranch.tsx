export const View = ({ isOpen }: { isOpen: boolean }) => (
  <div>
    {isOpen && <span>open</span>}
    {isOpen ? null : <span>closed</span>} // flag
  </div>
)
