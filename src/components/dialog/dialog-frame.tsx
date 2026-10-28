export function DialogFrame() {
  return (
    <div data-slot="dialog-frame" className="vui-dialog-frame" aria-hidden="true">
      <span className="vui-dialog-frame__top" />
      <span className="vui-dialog-frame__left" />
      <span className="vui-dialog-frame__right" />
      <span className="vui-dialog-frame__bottom" />
      <span className="vui-dialog-frame__dots" />
    </div>
  );
}
