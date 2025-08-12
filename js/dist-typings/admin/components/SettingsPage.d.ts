import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import type Mithril from 'mithril';
export default class SettingsPage extends ExtensionPage {
    loading: boolean;
    oninit(vnode: Mithril.Vnode<unknown, this>): void;
    content(vnode: Mithril.VnodeDOM<unknown, this>): JSX.Element;
}
