import app from 'flarum/admin/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import type Tag from 'flarum/tags/common/models/Tag';

interface SetBackgroundModalAttrs extends IInternalModalAttrs {
  tagData: Tag;
}

export default class SetBackgroundModal extends Modal<SetBackgroundModalAttrs> {
  static isDismissibleViaBackdropClick = false;
  static isDismissibleViaCloseButton = true;

  loading = false;
  tagData!: Tag;
  backgroundUrl!: Stream<string | null>;

  oninit(vnode: Mithril.Vnode<SetBackgroundModalAttrs, this>) {
    super.oninit(vnode);
    this.loading = false;
    this.tagData = this.attrs.tagData;
    this.backgroundUrl = Stream(this.tagData.attribute<string | null>('wusong8899BackgroundURL'));
  }

  className(): string {
    return 'Modal--small';
  }

  title(): Mithril.Children {
    return app.translator.trans('wusong8899-tag-background.admin.set-background');
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group" style="text-align: center;">
            <div className="ModuleItemSettingsLabel">
              {app.translator.trans('wusong8899-tag-background.admin.item-background-url')}
            </div>
            {/* `bidi` is a compat attr supported by Flarum's Stream */}
            <input maxlength="200" className="FormControl" bidi={this.backgroundUrl as any} />
          </div>

          <div className="Form-group" style="text-align: center;">
            {Button.component(
              {
                style: 'min-width:66px;',
                className: 'Button Button--primary',
                disabled: this.loading,
                onclick: () => {
                  this.saveData();
                },
              },
              app.translator.trans('wusong8899-tag-background.admin.save')
            )}
            &nbsp;
            {Button.component(
              {
                style: 'min-width:66px;background: rgba(0,0,0,0.1);',
                className: 'Button',
                disabled: this.loading,
                onclick: () => {
                  this.hide();
                },
              },
              app.translator.trans('wusong8899-tag-background.admin.cancel')
            )}
          </div>
        </div>
      </div>
    );
  }

  saveData() {
    this.loading = true;

    const backgroundUrl = this.backgroundUrl();
    const tagID = this.tagData.id()!;

    app
      .request({
        url: `${app.forum.attribute('apiUrl')}/tagBackgroundSetImage`,
        method: 'POST',
        body: { tagID, backgroundUrl },
      })
      .then((result: any) => {
        this.hide();
        // pushPayload expects a JSON:API payload; the controller returns Tag payload
        app.store.pushPayload(result as any);
        // Ensure store is updated; force redraw
        // eslint-disable-next-line no-console
        console.log(app.store.getById('tags', tagID));
        m.redraw();
      })
      .catch(() => {
        this.loading = false;
      });
  }
}

