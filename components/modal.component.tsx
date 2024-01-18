export default function Modal({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button id={id + "btn"}>close</button>
      </form>
    </dialog>
  );
}
