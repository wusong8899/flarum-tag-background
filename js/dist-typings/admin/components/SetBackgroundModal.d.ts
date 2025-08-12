import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import type Tag from 'flarum/tags/common/models/Tag';
interface SetBackgroundModalAttrs extends IInternalModalAttrs {
    tagData: Tag;
}
export default class SetBackgroundModal extends Modal<SetBackgroundModalAttrs> {
    static isDismissibleViaBackdropClick: boolean;
    static isDismissibleViaCloseButton: boolean;
    loading: boolean;
    tagData: Tag;
    backgroundUrl: Stream<string | null>;
    oninit(vnode: Mithril.Vnode<SetBackgroundModalAttrs, this>): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    saveData(): void;
}
export {};
